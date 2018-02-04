using AusOpenAnalyticsSolution.API.Controllers;
using AusOpenAnalyticsSolution.BO;
using AusOpenAnalyticsSolution.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace AusOpenAnalyticsSolution.Test
{
    [TestFixture]
    public class TestCoverage
    {
        [Test]
        public void TestUtilityReadData()
        {
            var result = ReadData.GetCsvRecords();

            Assert.IsNotNull(result);
        }

        [Test]
        public void TestUtilityCsvHelper()
        {
            string _filePath = string.Concat(System.Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "\\AusOpenApp\\2017 Australian Open Final Rafael Nadal vs Roger Federer.csv");
            using (var testStream = new MemoryStream(Encoding.UTF8.GetBytes("whatever")))
            {
                CsvFileReader testReader1 = new CsvFileReader(testStream, EmptyLineBehavior.NoColumns);
                Assert.IsNotNull(testReader1);
            }

            using (var testReader2 = new CsvFileReader(_filePath))
            {
                List<string> testColumns = new List<string>();
                bool result = testReader2.ReadRow(testColumns);
                Assert.True(result);

            }


        }

        [Test]
        public void TestBOMatchNumberOfRecords()
        {

            Match testMatch = new Match();
            Assert.NotZero(testMatch.NumberOfRecords);
        }


        [Test]
        public void TestBOMatchGetCsvRecordAtIndexNullTest()
        {

            Match testMatch = new Match();
            CsvRecord testRecord = testMatch.GetCsvRecordAtIndex(291);
            Assert.Null(testRecord);
        }


        [Test]
        public void TestBOMatchGetCsvRecordAtIndexTest()
        {

            Match testMatch = new Match();
            CsvRecord testRecord = testMatch.GetCsvRecordAtIndex(45);
            Assert.IsNotNull(testRecord);
        }

        [Test]
        public void TestBOMatchGetPlayerOneTest()
        {
            CsvRecord record = new CsvRecord();
            record.ServeDirectionDecider = "0-0";
            Player playerOne = null;
            Match testMatch = new Match();
            playerOne = testMatch.GetPlayerOne(record, playerOne);
            Assert.IsNotNull(playerOne);
        }

        [Test]
        public void TestBOMatchGetPlayerTwoTest()
        {
            CsvRecord record = new CsvRecord();
            record.ServeDirectionDecider = "0-0";
            Player playerTwo = null;
            Match testMatch = new Match();
            playerTwo = testMatch.GetPlayerTwo(record, playerTwo);
            Assert.IsNotNull(playerTwo);
        }

        [Test]
        public void TestBOMatchProbabilityOfWideSecondServeFromLeft()
        {
            Player playerOne = new Player();
            playerOne.NumberOfSecondServeFromLeft = 4;
            playerOne.NumberOfWideSecondServeFromLeft = 2;

            Assert.AreEqual(playerOne.ProbabilityOfWideSecondServeFromLeft,50.0);
        }


        [Test]
        public void TestBOMatchPercentageOfFirstServe()
        {
            Player playerOne = new Player();
            playerOne.NumberOfFirstServe = 4;
            playerOne.NumberOfFirstServeIn = 2;

            Assert.AreEqual(playerOne.PercentageOfFirstServe, 50.0);
        }

        [Test]
        public async Task TestMatchControllerGet()
        {

            IHttpContextAccessor _httpContextAccessor = new HttpContextAccessor();
            _httpContextAccessor.HttpContext = new DefaultHttpContext();
            _httpContextAccessor.HttpContext.Request.Headers["device-id"] = "4022018";

            MatchController testController = new MatchController(_httpContextAccessor);
            
            IActionResult actionResult = await testController.Get();

            // Assert
            Assert.NotNull(actionResult);

        }
        
    }
}
