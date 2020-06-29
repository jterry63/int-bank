require('dotenv').config()
const axios = require("axios");
const router = require("express").Router();
const keys = require("../keys.js");
var connection = require("../config/connection.js");
var xml = require('xml');



//DATABASE------------------------------


router.get("/db/user", function (req, res) {
  
  var dbQuery = `SELECT birthdate, credit_score, email, first_name, gender, user_id, last_name, metadata, phone, zip_code FROM bank.users WHERE user_id='${req.query.user_id}'`;

  connection.query(dbQuery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

router.put("/db/user", function (req, res) {

  var dbQuery = `UPDATE users SET user_description = '${req.query.description}' WHERE firebase_id = '${req.query.firebase_id}'`;

  console.log(dbQuery)
  connection.query(dbQuery, function (err, result) {
    if (err) throw err;
    console.log("User Description Successfully Updated!");
    res.json(result);
    res.end();
  });

});

router.post("/db/users", function (req, res) {

  var dbQuery = "INSERT INTO bank.users (birthdate, credit_score, email, first_name, gender, user_id, last_name, metadata, phone, zip_code) VALUES (?,?,?,?,?,?,?,?,?,?)";

  connection.query(dbQuery, [req.query.birthdate, req.query.credit_score, req.query.email, req.query.first_name, req.query.gender, req.query.user_id, req.query.last_name, req.query.metadata, req.query.phone, req.query.zip_code], function (err, result) {
    if (err) throw err;
    console.log("User Successfully Saved!");
    res.json(result);
    res.end();
  });

});

router.put("/db/users", function (req, res) {

  var dbQuery = `UPDATE users SET mx_user_id = '${req.query.mx_user_id}' WHERE firebase_id = '${req.query.firebase_id}'`;

  console.log(dbQuery)
  connection.query(dbQuery, function (err, result) {
    if (err) throw err;
    console.log("User Successfully Updated!");
    res.json(result);
    res.end();
  });

});

router.get("/db/user/guid", function (req, res) {
  
  var dbQuery = `SELECT mx_user_id FROM bank.users WHERE firebase_id='${req.query.firebase_id}'`;

  connection.query(dbQuery, function (err, result) {
    if (err) throw err;
    res.json(result[0].mx_user_id);
  });
});



// on demand

router.post("/int-bank/sessions", function (req, res) {
  
  var dbQuery = `SELECT user_id FROM bank.users WHERE user_id='${req.header('user_id')}'`;

  connection.query(dbQuery, function (err, result) {
    if (err) throw err;
   
    var example4 = [ { mdx: [ { _attr: { version: '5.0'} }, { session: [ { key: result[0].user_id }]} ] } ];
    res.set('Content-Type', 'application/xml; charset=utf-8')
    res.send(xml(example4));
    console.log(result[0].user_id)
  });
});






module.exports = router;

