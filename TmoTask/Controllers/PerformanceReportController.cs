using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace TmoTask.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class PerformanceReportController : ControllerBase
    {
        private string CSV_SRC_PATH = "../orders.csv";

        private class CsvHeaders
        {
            public required string Seller { get; set; }
            public required string Product { get; set; }
            public required string Price { get; set; }
            public required string OrderDate { get; set; }
            public required string Branch { get; set; }
        }

        [HttpGet]
        public OkObjectResult GetBranches()
        {
            /**************************************************************************************
             * Returns an HTTP status 200 code and a JSON containing a list of the branch names in
             * the CSV file.
             * Read dynamically from orders.csv; in a prod env, orders.csv could've changed from 
             * the last time we read from it.
             * 
             * This code assumes that the orders.csv "database" originates from server-side and is
             * thus trusted, safe, correctly formatted code, hence why it returns an
             * OkObjectResult.
             * 
             * NOTE: This code forces the database to be reread every time it's run. This is 
             * probably bad for production level code. I'm assuming enterprise-level solutions
             * would likely cache/memoize the results of this function, with some sort of boolean
             * option/parameter to force a fresh read of the orders.csv "database".
             * ***********************************************************************************/

            // First, ensure that the input file orders.csv isn't malformed. Read the first line
            // of the file.
            //
            // Not sure if it would be more clever to do this as I read the file using CsvReader,
            // but I just want to make something that works in C# at the moment.
            using (var reader = new StreamReader(CSV_SRC_PATH))
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
                        "Input CSV file has wrong field names in header");
                }
            }

            // Read each line from the CSV file. Return a JSON-formatted string with one key "list"
            // whose value is an array of strings corresponding to the branch names.
            HashSet<string> branchnames = new HashSet<string>();
            using (var reader = new StreamReader(CSV_SRC_PATH))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var parsed = csv.GetRecords<CsvHeaders>();
                // Regex to check if values in the Price field are valid.
                // Allow whole dollars to implicitly be zero (i.e. the pattern matches "0.99" and
                // ".16") but there must be two decimal places, corresponding to cents (i.e. the
                // pattern matches "22162.33" but not "0.113" or ".2").
                string pricepattern = @"^\d*\.\d{2}$";
                // Regex to check if values in the OrderDate field are valid. OrderDates must be in
                // format YYYY-MM-DD.
                string datepattern = @"\d{4}-\d\d-\d\d";
                Regex priceregex = new Regex(pricepattern);
                Regex dateregex = new Regex(datepattern);

                foreach (var line in parsed)
                {
                    // Check the CSV file's contents in each line.
                    // Enforce no naming conventions for Seller, Product, and Branch fields, since
                    // I don't know how data in orders.csv might be organized in the future (i.e.
                    // what if someone inputs an employee name into the Seller field in the
                    // future?)
                    MatchCollection pricematch = priceregex.Matches(line.Price);
                    MatchCollection datematch = dateregex.Matches(line.OrderDate);
                    System.Diagnostics.Debug.Assert(pricematch.Count < 2, "Bad Price regex");
                    System.Diagnostics.Debug.Assert(datematch.Count < 2, "Bad OrderDate regex");
                    string linetext = $"{line.Seller},{line.Product},{line.Price}," +
                        $"{line.OrderDate},{line.Branch}";
                    if (pricematch.Count == 0) throw new InvalidDataException(
                        $"Invalid Price value '{line.Price}' in line: {linetext}");
                    if (datematch.Count == 0) throw new InvalidDataException(
                        $"Invalid OrderDate value '{line.OrderDate}' in line: {linetext}");
                    branchnames.Add(line.Branch);
                }
            }
            string[] arr = new string[branchnames.Count];
            branchnames.CopyTo(arr);
            var result = new
            {
                list = arr
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("{branchname}/{numSellers}")]
        public IActionResult GetTopSellers(string branchname, int numSellers)
        {
            /**************************************************************************************
             * Returns an HTTP status code. If the query was successful, also return the top
             * sellers.
             * 
             * NOTE: From my understanding of the technical requirements, I could easily move the
             *       the functionality of this code into the GetBranches() function, and I suspect
             *       that was why the source file provided as a template provided a single Get()
             *       function that I could fill out. However, in a live environment, grabbing a
             *       list of branches and grabbing the top sellers from each branch aren't two
             *       functionalities that always occur together; what if someone wanted to grab the
             *       list of branches and then sort by product instead, for example?
             *       
             *       Anyhow, the same caveats that apply to the GetBranches() function occur here.
             *       This code would be problematic in an environment that handles large volumes
             *       of data since I'm rereading the entire CSV "database" every time this function
             *       is called, but I don't have the enterprise level experience needed to write
             *       this code any cleaner. All I can do is note that caveat here. My guess is that
             *       the results of GetBranch() would be cached somehow and that a boolean
             *       parameter for whether a database refresh is needed would be used. That line of
             *       reasoning lines up with what I've learned using the Meta JSSDK, at least.
             * ***********************************************************************************/
            string? branchlist = (string?)GetBranches().Value;

        }
    }
}
