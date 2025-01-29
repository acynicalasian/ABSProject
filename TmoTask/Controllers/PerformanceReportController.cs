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
            /   Read dynamically from orders.csv; in a prod env, orders.csv could've changed from 
            /   the last time we read from it.
            /
            /   NOTE: This code forces the database to be reread every time it's run. This is
            /   probably bad for production level code.
            **************************************************************************************/
            
            HashSet<string> branchnames = new HashSet<string>();
            using (var reader = new StreamReader("../orders.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {

            }
        }
    }
}
