using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text.RegularExpressions;

namespace TmoTask.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class PerformanceReportController : ControllerBase
    {
        private string CSV_SRC_PATH;
        public PerformanceReportController() : base()
        {
            // I think this has to be relative to Program.cs
            this.CSV_SRC_PATH = "orders.csv";


            // Debug purposes; comment out when done and uncomment the above line.
            //this.CSV_SRC_PATH = "headernobody.csv";
        }

        // Probably a much better way to do this, but I'm just hacking together unit tests with
        // MSTestv2, and I have no clue what kind of mess I'll create if the automatically
        // generated PerformanceReportControllerTests class inherits from this class; otherwise
        // I'd just make CSV_SRC_PATH protected or something.
        //
        // This violates naming conventions but it's not meant to be used outside test cases so it
        // should be fine? I'd assume C# will still let this compile and just output a warning.
        [NonAction]
        public void _setcsvpath(string s)
        {
            CSV_SRC_PATH = s;
            return;
        }

        private class CsvHeaders
        {
            public required string Seller { get; set; }
            public required string Product { get; set; }
            public required decimal Price { get; set; }
            public required string OrderDate { get; set; }
            public required string Branch { get; set; }
        }

        private class HoldJson
        {
            public string[]? list { get; set; }
        }

        // Store the processed CSV's data here to avoid having to use CsvHelper to reread
        // orders.csv, unless a user explicitly states they want to refresh the database.
        private List<CsvHeaders>? _processeddata;

        private string[]? _processedbranchlist;

        [HttpGet]
        public OkObjectResult GetBranches()
        {
            /**************************************************************************************
             * Returns an HTTP status 200 code and a JSON containing a list of the branch names in
             * the CSV file. 
             * 
             * Stores the processed CSV file as a member object to avoid having to reprocess it.
             * 
             * Read dynamically from orders.csv; in a prod env, orders.csv could've changed from 
             * the last time we read from it.
             * ***********************************************************************************/

            // First, ensure that the input file orders.csv isn't malformed. Read the first line
            // of the file.
            this.ParseCsvHeader();

            // Read each line from the CSV file. Return a JSON-formatted string with one key "list"
            // whose value is an array of strings corresponding to the branch names.
            var branchnames = this.ProcessCSVAndExtractBranchnames();
            string[] arr = new string[branchnames.Count];
            branchnames.CopyTo(arr);
            this._processedbranchlist = arr;
            var result = new
            {
                list = arr
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("{branchname}/{numSellers}/{refresh=false}")]
        public IActionResult GetTopSellers(string branchname, int numSellers, bool refresh=false)
        {
            /**************************************************************************************
             * Returns an HTTP status code 200 and a corresponding JSON-format string listing the
             * top numSellers sellers at branch named branchname. If no entries in orders.csv
             * correspond to branchname, returns code 404 with an error message. If numSellers
             * exceeds the number of sellers corresponding to branchname, return all sellers at
             * branchname.
             * 
             * If refresh is true, this forces the entire CSV database to be reprocessed. Else,
             * search the data stored in the member variable set by GetBranches().
             * 
             * NOTE: From my understanding of the technical requirements, I could easily move the
             *       the functionality of this code into the GetBranches() function, and I suspect
             *       that was why the source file provided as a template provided a single Get()
             *       function that I could fill out. However, in a live environment, grabbing a
             *       list of branches and grabbing the top sellers from each branch aren't two
             *       functionalities that always occur together; what if someone wanted to grab the
             *       list of branches and then sort by product instead, for example?
             * ***********************************************************************************/

            // If the value is null, we haven't even procesed the database yet. Do that first and
            // go from there. Or, if we want a refresh, reprocess the CSV file first.
            if (_processeddata == null || refresh || _processedbranchlist == null)
            {
                this.GetBranches();
                return this.GetTopSellers(branchname, numSellers, false);
            }

            if (!this._processedbranchlist.Contains(branchname))
            {
                return NotFound($"No branch named {branchname} was found.");
            }

            if (numSellers < 1) return BadRequest("Number of sellers cannot be less than 1.");

            // Accumulate totals for each seller.
            var sellerTotals = new Dictionary<string, decimal>();
            foreach(var line in this._processeddata)
            {
                if (line.Branch == branchname)
                {
                    if (sellerTotals.ContainsKey(line.Seller))
                        sellerTotals[line.Seller] += line.Price;
                    else
                        sellerTotals.Add(line.Seller, line.Price);
                }
            }

            // Swap key and value pairs in our sellerTotals into a new dict. Copy the keys in the
            // new dict to an array, and then sort it high to low. We can now use the values of
            // the sorted array to quickly access key-value pairs in the reversed dict to get an
            // array of the sellars ordered from high to low sales.
            var reverseddict = new Dictionary<decimal, string>();
            foreach(var key in sellerTotals.Keys)
            {
                reverseddict.Add(sellerTotals[key], key);
            }
            decimal[] sortedvalues = new decimal[reverseddict.Count];
            reverseddict.Keys.CopyTo(sortedvalues, 0);
            Array.Sort(sortedvalues, (a,b) => Math.Sign(b-a));
            string[] sellersranked = new string[sortedvalues.Length];
            for (int i = 0; i < sortedvalues.Length; i++)
                sellersranked[i] = reverseddict[sortedvalues[i]];
            int n = numSellers;

            // Unfortunately I have to convert the decimal values to strings because Ok() strips
            // zeroes in the hundredth place value and I have no clue how to change that.
            List<string> sortedstr = sortedvalues.Select(x => $"{x}").ToList<string>();
            var objtojson = new
            {
                ranking = (n >= sortedvalues.Length) ? sellersranked : sellersranked[0..n],
                sellertotal = (n >= sortedvalues.Length) ? sortedstr : sortedstr[0..n]
            };
            // Ordering of the arrays lines up, so ranking[i]'s total is sellartotal[i].
            return Ok(objtojson);
        }

        private void ParseCsvHeader()
        {
            // Not sure if it would be more clever to do this as I read the file using CsvReader,
            // but I just want to make something that works in C# at the moment.
            using (var reader = new StreamReader(this.CSV_SRC_PATH))
            {
                string headerformat = "Seller,Product,Price,OrderDate,Branch";
                string? firstline = reader.ReadLine();

                // Catch empty order.csv file.
                if (firstline == null) throw new InvalidDataException(
                    "Input CSV file cannot be empty");
                else if (firstline != headerformat)
                {
                // Catch order.csv file with improperly formatted header record that violates
                // RFC 4180, which states spaces cannot be ignored; enforce standardized CSV
                // formatting.
                    if (firstline.Split(',') != headerformat.Split(',') &&
                        firstline.Split(',', ' ') == headerformat.Split(','))
                    {
                        throw new InvalidDataException(
                            "Input CSV file's header's field names are not RFC 4180 compliant");
                    }
                // Header has invalid field names.
                    else throw new InvalidDataException(
                        $"Input CSV file must have header {headerformat}");
                }
            }
        }

        private HashSet<string> ProcessCSVAndExtractBranchnames()
        {
            HashSet<string> branchnames = [];
            this._processeddata = [];
            using (var reader = new StreamReader(this.CSV_SRC_PATH))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var parsed = csv.GetRecords<CsvHeaders>();
                // Regex to check if values in the Price field are valid.
                // Prices must be of format {explicitwhole#}.{explicitfractional#} where zeros
                // must be included (i.e. 1.00, 0.11, 0.00).
                string pricepattern = @"^\d+\.\d{2}$";
                // Regex to check if values in the OrderDate field are valid. OrderDates must be in
                // format YYYY-MM-DD.
                string datepattern = @"^\d{4}-\d\d-\d\d$";
                Regex priceregex = new Regex(pricepattern);
                Regex dateregex = new Regex(datepattern);

                foreach (var line in parsed)
                {
                    // Check the CSV file's contents in each line.
                    // Enforce no naming conventions for Seller, Product, and Branch fields, since
                    // I don't know how data in orders.csv might be organized in the future (i.e.
                    // what if someone inputs an employee name into the Seller field in the
                    // future?)
                    MatchCollection pricematch = priceregex.Matches(Convert.ToString(line.Price));
                    MatchCollection datematch = dateregex.Matches(line.OrderDate);
                    System.Diagnostics.Debug.Assert(pricematch.Count < 2, "Bad Price regex");
                    System.Diagnostics.Debug.Assert(datematch.Count < 2, "Bad OrderDate regex");
                    string linetext = $"{line.Seller},{line.Product},{line.Price}," +
                        $"{line.OrderDate},{line.Branch}";
                    if (pricematch.Count == 0) throw new InvalidDataException(
                        $"Invalid Price value '{line.Price}' in line: {linetext}");
                    if (datematch.Count == 0) throw new InvalidDataException(
                        $"Invalid OrderDate value '{line.OrderDate}' in line: {linetext}");
                    string[] splitdate = line.OrderDate.Split('-');
                    int yyyy = int.Parse(splitdate[0]);
                    int mm = int.Parse(splitdate[1]);
                    int dd = int.Parse(splitdate[2]);
                    // Make sure month and day values are valid.
                    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) throw new InvalidDataException(
                        $"Invalid OrderDate value '{line.OrderDate}' in line: {linetext}");
                    switch (mm)
                    {
                        case 2:
                            // Handle leap years: divisble by 4, but not 100, unless also divisible
                            // by 400.
                            int ddbound;
                            if (yyyy % 4 == 0)
                            {
                                // Handle years divisible by 100
                                if (yyyy % 100 == 0)
                                    // divisible by 400? Then it's a leap year, otherwise no.
                                    ddbound = (yyyy % 400 == 0) ? 29 : 28;
                                // leap years divisible by 4 but not 100 are always leap years.
                                else ddbound = 29;
                            }
                            else ddbound = 28;
                            if (dd > ddbound) throw new InvalidDataException(
                                $"Invalid OrderDate value '{line.OrderDate}' in line: {linetext}");
                            break;
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            if (dd > 30) throw new InvalidDataException(
                                $"Invalid OrderDate value '{line.OrderDate}' in line: {linetext}");
                            break;
                        default:
                            if (dd > 31) throw new InvalidDataException(
                                $"Invalid OrderDate value '{line.OrderDate}' in line: {linetext}");
                            break;
                    }
                    branchnames.Add(line.Branch);
                    this._processeddata.Add(line);
                }
            }
            return branchnames;
        }
    }
}
