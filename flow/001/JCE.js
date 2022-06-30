const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let mssql = require('./../../function/mssql');


router.get('/flow001', async (req, res) => {

return  res.json("testflow1");
});

router.post('/getJCEdata', async (req, res) => {
  //-------------------------------------
  console.log(req.body);
  input = req.body;
  //-------------------------------------
  let output = [];

  var db = await mssql.qurey(`SELECT * FROM [GW_SUPPORT].[dbo].[data_with_code]`);
  if (db === `er`) {
    return res.json([]);
  }
  output = db;

  //-------------------------------------
  res.json(output);
});


module.exports = router;
