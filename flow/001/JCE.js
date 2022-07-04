const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let mssql = require('./../../function/mssql');

const d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;


router.get('/flow001', async (req, res) => {

  return res.json("testflow1");
});

router.post('/getJCEdataMONTH', async (req, res) => {
  console.log("--getJCEdataMONTH--");
  //-------------------------------------
  console.log(req.body);
  input = req.body;
  //-------------------------------------
  let output = {};
  let ALLcou = 0;
  let OKcou = 0;
  let AENGcou = 0;
  let WNGcoa = 0;
  let result = 0;
  let DATEdata = ''


  if (input[`year`] !== undefined && input[`month`] !== undefined) {

    let beYear = input[`year`];
    let beMonth = input[`month`];

    let NeYear = 0;
    let NeMonth = 0;


    DATEdata = `${beYear}-${beMonth}`;
    if (input[`month`] !== '12') {
      NeYear = parseInt(input[`year`])
      NeMonth = parseInt(input[`month`]) + 1
    } else {
      NeYear = parseInt(input[`year`]) + 1
      NeMonth = 1
    }


    var db = await mssql.qurey(`SELECT * FROM [GW_SUPPORT].[dbo].[data_with_code] WHERE '${beYear}-${beMonth}-01' <= datetime and datetime < '${NeYear}-${NeMonth}-01' AND [daycode03]='auto' order by datetime asc`);
    if (db === `er`) {
      return res.json({ "status": "nok", "note": "database error" });
    }

    try {

      result = db[`recordsets`][0]
    } catch (err) {
      return res.json({ "status": "nok", "note": "database error" });
    }



    for (i = 0; i < result.length; i++) {
      if (result[i][`data`].replace("OKNG", "").includes('Type')) {
        ALLcou++;
      }

      if (result[i][`data`].replace("OKNG", "").includes('OK') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('WNG') === false) {
          if (result[i][`data`].replace("OKNG", "").includes('AENG') === false) {
            OKcou++;
          }
        }

      }
      if (result[i][`data`].replace("OKNG", "").includes('AENG') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('WNG') === false) {
          AENGcou++;
        }
      }
      if (result[i][`data`].replace("OKNG", "").includes('WNG') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('AENG') === false) {
          WNGcoa++;
        }
      }

    }


    output = {
      "DATE": DATEdata,
      "DATEstep": Math.floor(new Date(`${input[`year`]}.${input[`month`]}.1`).getTime() / 1000),
      "ALL_AUTO": ALLcou,
      "OK": OKcou,
      "WNG": WNGcoa,
      "NG": ALLcou - OKcou - WNGcoa - AENGcou,
      "AENG": AENGcou,
      "timestamp": day,
    }


    let finddata = await mongodb.find("JCEDATA", "MONTH", { "DATE": DATEdata });
    if (finddata.length === 0) {
      let ind = await mongodb.insertMany("JCEDATA", "MONTH", [output]);
    } else {
      let upd = await mongodb.update("JCEDATA", "MONTH", { "DATE": DATEdata }, { $set: output });
    }

  }



  //-------------------------------------
  return res.json(output);
});

router.post('/getJCEdataDAY', async (req, res) => {
  console.log("--getJCEdataDAY--");
  //-------------------------------------
  console.log(req.body);
  input = req.body;
  //-------------------------------------
  let output = {};
  let ALLcou = 0;
  let OKcou = 0;
  let AENGcou = 0;
  let WNGcoa = 0;
  let result = 0;
  let DATEdata = ''


  if (input[`year`] !== undefined && input[`month`] !== undefined && input[`day`] !== undefined) {

    let beday = input[`day`];
    let beYear = input[`year`];
    let beMonth = input[`month`];

    DATEdata = `${beYear}-${beMonth}-${beday}`;





    var db = await mssql.qurey(`SELECT * FROM [GW_SUPPORT].[dbo].[data_with_code] WHERE '${beYear}-${beMonth}-${beday}' = date  AND [daycode03]='auto' order by datetime asc`);
    if (db === `er`) {
      return res.json({ "status": "nok", "note": "database error" });
    }

    try {

      result = db[`recordsets`][0]
    } catch (err) {
      return res.json({ "status": "nok", "note": "database error" });
    }



    for (i = 0; i < result.length; i++) {
      if (result[i][`data`].replace("OKNG", "").includes('Type')) {
        ALLcou++;
      }

      if (result[i][`data`].replace("OKNG", "").includes('OK') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('WNG') === false) {
          if (result[i][`data`].replace("OKNG", "").includes('AENG') === false) {
            OKcou++;
          }
        }

      }
      if (result[i][`data`].replace("OKNG", "").includes('AENG') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('WNG') === false) {
          AENGcou++;
        }
      }
      if (result[i][`data`].replace("OKNG", "").includes('WNG') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('AENG') === false) {
          WNGcoa++;
        }
      }

    }


    output = {
      "DATE": DATEdata,
      "DATEstep": Math.floor(new Date(`${input[`year`]}.${input[`month`]}.${input[`day`]}`).getTime() / 1000),
      "ALL_AUTO": ALLcou,
      "OK": OKcou,
      "WNG": WNGcoa,
      "NG": ALLcou - OKcou - WNGcoa - AENGcou,
      "AENG": AENGcou,
      "timestamp": day,
    }


    let finddata = await mongodb.find("JCEDATA", "DAY", { "DATE": DATEdata });
    if (finddata.length === 0) {
      let ind = await mongodb.insertMany("JCEDATA", "DAY", [output]);
    } else {
      let upd = await mongodb.update("JCEDATA", "DAY", { "DATE": DATEdata }, { $set: output });
    }

  }

  //-------------------------------------
  return res.json(output);
});

router.post('/getJCEreport', async (req, res) => {
  console.log("--getJCEreport--");
  //-------------------------------------
  console.log(req.body);
  input = req.body;
  //-------------------------------------
  output = {
    'STATUS': 'NOK',
    "DATE": '',
    "ALL_AUTO": '0',
    "OK": '0',
    "WNG": '0',
    "NG": '0',
    "AENG": '0',
  }
  //-------------------------------------
  if (input[`STARTyear`] !== undefined && input[`STARTmonth`] !== undefined && input[`STARTday`] !== undefined && input[`ENDyear`] !== undefined && input[`ENDmonth`] !== undefined && input[`ENDday`] !== undefined) {
    let START = Math.floor(new Date(`${input[`STARTyear`]}.${input[`STARTmonth`]}.${input[`STARTday`]}`).getTime() / 1000);
    let END =  Math.floor(new Date(`${input[`ENDyear`]}.${input[`ENDmonth`]}.${input[`ENDday`]}`).getTime() / 1000);

    //{ DATE : { $gt :  START, $lt : END}}

    // let finddata = await mongodb.find("JCEDATA", "DAY", { "DATEstep" : START});
    let finddata = await mongodb.find("JCEDATA", "DAY", { "DATEstep" : { $gte :  START, $lte : END}});

    if(finddata.length > 0){
      let iALL_AUTO = 0;
      let iOK = 0;
      let iWNG = 0;
      let iNG = 0;
      let iAENG = 0;

      for(i=0;i<finddata.length;i++){
        iALL_AUTO = iALL_AUTO+ finddata[i]['ALL_AUTO'];
        iOK = iOK+ finddata[i]['OK'];
        iWNG = iWNG+ finddata[i]['WNG'];
        iNG = iNG+ finddata[i]['NG'];
        iAENG = iAENG+ finddata[i]['AENG'];
      }
      output = {
        'STATUS': 'OK',
        "DATE": `(${input[`STARTyear`]}-${input[`STARTmonth`]}-${input[`STARTday`]})-(${input[`ENDyear`]}-${input[`ENDmonth`]}-${input[`ENDday`]})`,
        "ALL_AUTO": iALL_AUTO,
        "OK": iOK,
        "WNG": iWNG,
        "NG": iNG,
        "AENG": iAENG,
      }
    }
    
  }

  //-------------------------------------
  return res.json(output);

  
});

router.post('/getJCEdataBARCODE', async (req, res) => {
  console.log("--getJCEdataBARCODE--");
  //-------------------------------------
  console.log(req.body);
  input = req.body;
  //-------------------------------------
  let output = {};
  let ALLcou = 0;
  let OKcou = 0;
  let AENGcou = 0;
  let WNGcoa = 0;
  let result = 0;
  let DATEdata = ''

  output = {
    'STATUS': 'NOK',
    "ALL_AUTO": '0',
    "OK": '0',
    "WNG": '0',
    "NG": '0',
    "AENG": '0',
  }


  if (input[`BARCODE`] != undefined) {

    let inputBARCODE = input[`BARCODE`];


    var db = await mssql.qurey(`SELECT * FROM [GW_SUPPORT].[dbo].[data_with_code] WHERE  [daycode04]='${inputBARCODE}' AND [daycode03]='auto' order by datetime asc`);
    if (db === `er`) {
      return res.json({ "status": "nok", "note": "database error" });
    }

    try {

      result = db[`recordsets`][0]
    } catch (err) {
      return res.json({ "status": "nok", "note": "database error" });
    }



    for (i = 0; i < result.length; i++) {
      if (result[i][`data`].replace("OKNG", "").includes('Type')) {
        ALLcou++;
      }

      if (result[i][`data`].replace("OKNG", "").includes('OK') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('WNG') === false) {
          if (result[i][`data`].replace("OKNG", "").includes('AENG') === false) {
            OKcou++;
          }
        }

      }
      if (result[i][`data`].replace("OKNG", "").includes('AENG') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('WNG') === false) {
          AENGcou++;
        }
      }
      if (result[i][`data`].replace("OKNG", "").includes('WNG') && result[i][`data`].replace("OKNG", "").includes('Type')) {
        if (result[i][`data`].replace("OKNG", "").includes('AENG') === false) {
          WNGcoa++;
        }
      }

    }

    if(result.length>0){
      output = {
        'STATUS': 'OK',
        "PO":inputBARCODE,
        "ALL_AUTO": ALLcou,
        "OK": OKcou,
        "WNG": WNGcoa,
        "NG": ALLcou - OKcou - WNGcoa - AENGcou,
        "AENG": AENGcou,
      }
    }



  }

  //-------------------------------------
  return res.json(output);
});

module.exports = router;
