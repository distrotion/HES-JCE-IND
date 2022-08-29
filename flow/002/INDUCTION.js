const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let mssql = require('./../../function/mssql');

const d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
let day = d;

let INDUCTION = 'INDUCTION';
let COIL_EX = 'COIL_EX';
let COIL_MASTER = 'COIL_MASTER';


router.get('/flow002', async (req, res) => {

  return res.json("testflow2");
});

router.post('/getINDCOIL', async (req, res) => {
  let output = [];
  try {

    output = await mongodb.find(INDUCTION, COIL_EX, {});
  }
  catch (err) {
    output = [];
  }

  res.json(output);
});

router.post('/INDcoilUPDATE', async (req, res) => {

  //-------------------------------------
  console.log("--INDcoilUPDATE--");
  //
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [];

  try {

    let check = await mongodb.find(INDUCTION, COIL_EX, { "WID": input['WID'] });

    if (check.length === 0) {
      let check2 = await mongodb.find(INDUCTION, COIL_EX, { $and: [{ "COIL_NAME": input['COIL_NAME'] }] });

      if (check2.length > 0) {

      } else {
        input['WID'] = `WIDA-${Date.now()}`;
        input['COUNTER'] = '0';
        input['STATUS'] = '';
        var ins = await mongodb.insertMany(INDUCTION, COIL_EX, [input]);
      }

    } else {
      //
      let check2 = await mongodb.find(INDUCTION, COIL_EX, { $and: [{ "COIL_NAME": input['COIL_NAME'] }] });

      if (check2.length > 0) {

      } else {
        let upd = await mongodb.update(INDUCTION, COIL_EX, { "WID": input['WID'] }, { $set: { "COIL_NAME": input['COIL_NAME'], "PATTERN": input['PATTERN'], "LIMIT": input['LIMIT'], "COIL_NO": input['COIL_NO'] } });
      }

      if (input['STATUS'] === 'ACTIVE') {
        let check3 = await mongodb.find(INDUCTION, COIL_EX, { $and: [{ "STATUS": 'ACTIVE', "COIL_NO": input['COIL_NO'], "PATTERN": input['PATTERN'] }] });
        if (check3.length === 0) {
          let upd = await mongodb.update(INDUCTION, COIL_EX, { "WID": input['WID'] }, { $set: { "STATUS": input['STATUS'] } });
        }
      } else {
        let upd = await mongodb.update(INDUCTION, COIL_EX, { "WID": input['WID'] }, { $set: { "STATUS": input['STATUS'] } });
      }

    }

    output = await mongodb.find(INDUCTION, COIL_EX, {});
  }
  catch (err) {
    output = [];
  }
  res.json(output);
});

router.post('/getINDpattern', async (req, res) => {
  let output = [];
  try {

    output = await mongodb.find(INDUCTION, COIL_MASTER, {});
  }
  catch (err) {
    output = [];
  }

  res.json(output);
});

router.post('/INDpatternUPDATE', async (req, res) => {

  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = [];

  try {

    let check = await mongodb.find(INDUCTION, COIL_MASTER, { "PID": input['PID'] });

    if (check.length === 0) {
      let check2 = await mongodb.find(INDUCTION, COIL_MASTER, { $and: [{ "PATTERN": input['PATTERN'] }] });

      if (check2.length > 0) {

      } else {
        input['PID'] = `PIDA-${Date.now()}`;
        var ins = await mongodb.insertMany(INDUCTION, COIL_MASTER, [input]);
      }

    } else {
      //
      let upd = await mongodb.update(INDUCTION, COIL_MASTER, { "PID": input['PID'] }, { $set: { "VOLT": input['VOLT'], "POWER": input['POWER'], "TIME": input['TIME'] } });
    }

    output = await mongodb.find(INDUCTION, COIL_MASTER, {});
  }
  catch (err) {
    output = [];
  }
  res.json(output);
});


router.post('/COILcheckdate', async (req, res) => {
  //-------------------------------------
  console.log(req.body);
  let input = req.body;

  //-------------------------------------
  let output = [];
  try {

    query = `SELECT  *  FROM [PLANT_SUPPORT].[dbo].[HES_INDUCTION] where [date] between '${input['START']} 0:00:00' and '${input['END']} 23:59:59' order by [date] desc`

    var db = await mssql.qurey(query);
    if (db === `er`) {
      return res.json({ "status": "nok", "note": "database error" });
    }

    let dataDB = db[`recordsets`][0]
    resultDATA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (i = 0; i < dataDB.length; i++) {

      for (j = 0; j < 20; j++) {
        if (parseInt(dataDB[i][`F01`].toString()) - 1 == j) {
          resultDATA[j]++;
        }
      }
    }

    output = resultDATA;

  }
  catch (err) {
    output = [];
  }

  res.json(output);
});






module.exports = router;
