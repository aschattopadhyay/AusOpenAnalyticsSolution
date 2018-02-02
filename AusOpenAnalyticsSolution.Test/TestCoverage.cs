using AusOpenAnalyticsSolution.BO;
using AusOpenAnalyticsSolution.Utility;
using NUnit.Framework;
using System;

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
        public void TestBOMatchNumberOfRecords()
        {

            Match testMatch = new Match();
            Assert.NotZero(testMatch.NumberOfRecords);
        }



    }
}
