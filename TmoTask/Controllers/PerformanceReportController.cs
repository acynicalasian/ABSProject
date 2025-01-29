using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Collections.Generic;

namespace TmoTask.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class PerformanceReportController : ControllerBase
    {
        private class CsvHeaders
        {
            public required string Seller { get; set; }
            public required string Product { get; set; }
            public required double Price { get; set; }
            public required string OrderDate { get; set; }
            public required string Branch { get; set; }
        }

        [HttpGet]
        public IActionResult GetBranches()
        {
            /**************************************************************************************
             * Returns an HTTP status 200 code and a JSON containing a list of the branch names in
             * the CSV file.
             * Read dynamically from orders.csv; in a prod env, orders.csv could've changed from 
             * the last time we read from it.
             * 
             * NOTE: This code forces the database to be reread every time it's run. This is 
             * probably bad for production level code.
             * ***********************************************************************************/
            
            HashSet<string> branchnames = new HashSet<string>();
            using (var reader = new StreamReader("../orders.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var parsed = csv.GetRecords<CsvHeaders>();
                foreach (var line in parsed)
                {
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

        // Returns 
    }
}
