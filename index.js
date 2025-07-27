const express = require('express');
const axios = require('axios'); //enable to communicate with etherAi inorder to fetch block no and different timestamp
const {utils}  = require('ethers'); //ether js library
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
require('dotenv').config();

const app = express();
const apiKey = process.env.API_KEY;

// Timestamp and block rewards

class Block{
    constructor(timeStamp,blockReward){
        this.timeStamp=timeStamp;
        this.blockReward=blockReward;
    }
}

const fetchData = async()=>{
   try{
        const listOfBlocks = [];
       // const blockNumber = 1;
       for(let blockNumber=17469523; blockNumber<17469530;blockNumber++){
           const apiUrl = `https://api.etherscan.io/v2/api?chainid=1&module=block&action=getblockreward&blockno=${blockNumber}&apikey=${apiKey}`
        const response = await axios.get(apiUrl);
        const rewardEther = utils.formatEther(response.data.result.blockReward)
       // console.log(rewardEther)
       const timeStamp = response.data.result.timeStamp
       const block = new Block(timeStamp,rewardEther)
       listOfBlocks.push(block);
       }
       exportToCsv(listOfBlocks)
        //console.log(listOfBlocks)
   }catch(error){
    console.error(error)
   }
}

const exportToCsv = (data) => {
    console.log("Hello")
    const csvWriter = createCsvWriter({
         path: 'block_data.csv',
    header: [
        {id: 'timeStamp', title: 'timeStamp'},
        {id: 'blockReward', title: 'blockReward'}
    ]
    });

    csvWriter
      .writeRecords(data)
      .then(()=> {
        console.log('CSV file crated succesfully');
      })
   .catch((error)=>{
    console.error(error);
   });
};

(async()=>{
    try{
       await fetchData()
       app.listen(3000,()=>{
       console.log("Server Running at 3000");
})
    }catch(error){
        console.error(error)
    }
})()
