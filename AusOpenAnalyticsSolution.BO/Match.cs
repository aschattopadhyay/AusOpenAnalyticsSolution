using AusOpenAnalyticsSolution.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace AusOpenAnalyticsSolution.BO
{
    public class Match
    {
        private int numberOfRecords = 0;
        public int NumberOfRecords
        {
            get
            {
                return numberOfRecords;
            }
            set
            {

                numberOfRecords = value;

            }
        }
        private List<CsvRecord> allData = null;



        public Match()
        {
            //Read the CSV file
            allData = ReadData.GetCsvRecords();
            this.numberOfRecords = allData.Count;

        }

        public CsvRecord GetCsvRecordAtIndex(int index)
        {
            CsvRecord record = null;
            if(index >=0 && index < allData.Count)
                record = this.allData[index];

            return record;

        }
        
        public Player GetPlayerOne(CsvRecord record, Player playerOne)
        {
            if(playerOne == null)
                playerOne = new Player();
            playerOne.Name = record.PlayerOneName;
            playerOne.CurrentGame = record.PlayerOnePoint;
            playerOne.CurrentSet = Convert.ToInt32(record.PlayerOneGame);
            playerOne.TotalSet = Convert.ToInt32(record.PlayerOneSet);
            playerOne.FirstServeShot = record.PlayerOneFirstServeShot;
            playerOne.SecondServeShot = record.PlayerOneSecondServeShot;

            return playerOne;

        }

        public Player GetPlayerTwo(CsvRecord record, Player playerTwo)
        {
            if (playerTwo == null)
                playerTwo = new Player();
            playerTwo.Name = record.PlayerTwoName;
            playerTwo.CurrentGame = record.PlayerTwoPoint;
            playerTwo.CurrentSet = Convert.ToInt32(record.PlayerTwoGame);
            playerTwo.TotalSet = Convert.ToInt32(record.PlayerTwoSet);
            playerTwo.FirstServeShot = record.PlayerTwoFirstServeShot;
            playerTwo.SecondServeShot = record.PlayerTwoSecondServeShot;
            return playerTwo;

        }



    }
}
