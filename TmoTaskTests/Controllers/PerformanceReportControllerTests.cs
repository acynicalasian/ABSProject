using Microsoft.VisualStudio.TestTools.UnitTesting;
using TmoTask.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.TypeConversion;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Converted = TmoTask.Controllers.PerformanceReportController._CsvHeaders;

namespace TmoTask.Controllers.Tests
{
	[TestClass()]
    public class PerformanceReportControllerTests
    {
        // Not sure if this solution works across platforms but it feels better than hardcoding a
        // path based on where I myself stored the project. Also more secure.
        //
        // Running the tests seems to occur in /{solution folder}/TmoTaskTests/bin/debug/net8.0
        // but the test CSV files are stored in /{solution folder}/TmoTaskTests/testcases
        private string CSVFOLDER = "../../../testcases";

        [TestMethod()]
        public void ValidateOriginalCSV()
        {
            var c = new PerformanceReportController();
            var d = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/../orders.csv");
            try
            {
                c.GetBranches();
                c.GetTopSellers("Branch 3", 2);
                c.GetTopSellers("Branch 2", 113);
            }
            catch (InvalidDataException)
            {
                // We shouldn't run into this code when we made a valid query into the CSV
                // "database".
                Assert.Fail();
            }
        }

        [TestMethod()]
        public void ConfirmBranch2DecSellerDOnly()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/../orders.csv");
            c.GetBranches();
            List<Converted> serializedData = c._getDataDirectly();
            List<Converted> data = new List<Converted>();
            foreach (var e in data)
            {
                string[] splitdate = e.OrderDate.Split('-');
                int mm = int.Parse(splitdate[1]);
                if (mm == 12)
                {
                    if (e.Seller != "Seller D") Assert.Fail();
                }
            }
		}

        // This method shouldn't throw an exception if our logic in GetTopSellers() worked. The
        // logic should force GetBranches() to run if we haven't processed the CSV data yet.
        [TestMethod()]
        public void TestCSVAvoidUninitiatedDataOnGetTopSeller()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/../orders.csv");
            c.GetTopSellers("Branch 1", 22, false);
        }

        [TestMethod()]
        public void TestEmptyCSV()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/empty.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void TestNewLineOnlyCSV()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/newline.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVHeaderTooFewFieldsWrongFieldNames()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/badheader1.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVHeaderTooManyFieldsWrongFieldNames()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/badheader2.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVHeaderMissingFieldNames()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/badheader3.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVHeaderTooManyFieldNames()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/badheader4.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVHeaderViolatesRFC4180()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/badheader5.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataPriceNoDecimal()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata1.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataPriceTooFewDecimals()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata2.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataPriceTooManyDecimals()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata3.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        // Yikes, I should've made the CSV files with descriptive names! Do it if I have time.
        public void CSVDataPriceNoLeadingZero()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata17.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataPriceIsAlphaString()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata4.csv");
            Assert.ThrowsException<TypeConverterException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataPriceIsSpecialChar()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata5.csv");
            Assert.ThrowsException<TypeConverterException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataPriceIsNegative()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata6.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataOrderDateBadFormat()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata7.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataOrderDateYearTooShort()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata8.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataOrderDateYearTooLong()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata9.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataOrderDateMalformedMissingMonth()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata10.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataOrderDateSingleDigitMonth()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata11.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataOrderDateValidMonthTooLong()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata12.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataOrderDateIllegalMonth()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata13.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        // Probably no need to check formatting issue for days since if our regex is bad, it
        // probably failed the tests for formatting issues for months and years.

        [TestMethod()]
        public void ValidateLeapYearLogic()
        {
            var c = new PerformanceReportController();
            try
            {
                c._setcsvpath($"{CSVFOLDER}/leapyears.csv");
                c.GetBranches();
            }
            catch (InvalidDataException)
            {
                // We shouldn't ever catch this exception because the file has good leap years.
                Assert.Fail();
            }
        }

        [TestMethod()]
        public void CSVDataOrderDateBadLeapYearNotMultOf4()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata14.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void CSVDataOrderDateBadLeapYearMultOf100()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata15.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        // We don't need to check over 31 days since no month has over 31 days.
        public void CSVDataOrderDateBad30DayMonth()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/baddata16.csv");
            Assert.ThrowsException<InvalidDataException>(() => c.GetBranches());
        }

        [TestMethod()]
        public void QueryNonExistentBranchName()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/../orders.csv");
            var res = c.GetTopSellers("foo", 1000, false);
            Assert.AreEqual(typeof(NotFoundObjectResult), res.GetType());
        }

        [TestMethod()]
        public void QueryNumSellerLessThanOne()
        {
            var c = new PerformanceReportController();
            c._setcsvpath($"{CSVFOLDER}/../orders.csv");
            var res = c.GetTopSellers("Branch 3", 0);
            Assert.AreEqual(typeof(BadRequestObjectResult), res.GetType());
            res = c.GetTopSellers("Branch 1", -3);
            Assert.AreEqual(typeof(BadRequestObjectResult), res.GetType());
        }
    }
}