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


router.post("/db/users", function (req, res) {

  var dbQuery = "INSERT INTO bank.users (birthdate, credit_score, email, first_name, gender, user_id, last_name, metadata, phone, zip_code) VALUES (?,?,?,?,?,?,?,?,?,?)";

  connection.query(dbQuery, [req.query.birthdate, req.query.credit_score, req.query.email, req.query.first_name, req.query.gender, req.query.user_id, req.query.last_name, req.query.metadata, req.query.phone, req.query.zip_code], function (err, result) {
    if (err) throw err;
    console.log("User Successfully Saved!");
    res.json(result);
    res.end();
  });

});

router.post("/db/accounts", function (req, res) {

  var dbQuery = "INSERT INTO bank.accounts (account_type, account_name, balance, available_balance, account_number, currency_code, account_id, user_id) VALUES (?,?,?,?,?,?,?,?)";

  connection.query(dbQuery, [req.query.account_type, req.query.account_name, req.query.balance, req.query.available_balance, req.query.account_number, req.query.currency_code, req.query.account_id, req.query.user_id], function (err, result) {
    if (err) throw err;
    console.log("Account Successfully Saved!");
    res.json(result);
    res.end();
  });

});

router.post("/db/transactions", function (req, res) {

  var dbQuery = "INSERT INTO bank.transactions (transaction_id, transaction_status, transaction_type, amount, transaction_description, transacted_on, posted_on, category, user_id, account_id) VALUES (?,?,?,?,?,?,?,?,?,?)";

  connection.query(dbQuery, [req.query.transaction_id, req.query.transaction_status, req.query.transaction_type, req.query.amount, req.query.transaction_description, req.query.transacted_on, req.query.posted_on, req.query.category, req.query.user_id, req.query.account_id,], function (err, result) {
    if (err) throw err;
    console.log("Transaction Successfully Saved!");
    res.json(result);
    res.end();
  });

});




// on demand

router.post("/int-bank/sessions", function (req, res) {
  
  var dbQuery = `SELECT user_id FROM bank.users WHERE user_id='${req.body.mdx.session[0].userkey[0]}'`;

  connection.query(dbQuery, function (err, result) {
    if (err) throw err;
   
    var session = [ { mdx: [ { _attr: { version: '5.0'} }, { session: [ { key: req.body.mdx.session[0].userkey[0] }]} ] } ];
    
    res.set('Content-Type', 'application/xml; charset=utf-8')
    res.send(xml(session));
    console.log(req.body.mdx.session[0].userkey[0])
  });
});

router.get("/int-bank/accounts", function (req, res) {
  
  var dbQuery = `SELECT account_type, account_name, balance, available_balance, account_number, currency_code, account_id, user_id FROM bank.accounts WHERE user_id='${req.header('MDX-Session-Key')}'`;

  connection.query(dbQuery, function (err, result) {
    if (err) throw err;

    var account= [ { mdx: [ { _attr: { version: '5.0'} }, { account: [ { id: result[0].account_id }, { type: result[0].account_type }, { name: result[0].account_name }, { balance: result[0].balance }, { available_balance: result[0].available_balance }, { currency_code: result[0].currency_code }]} ] } ];
    res.set('Content-Type', 'application/xml; charset=utf-8')
    res.send(xml(account))

    
  });
});

router.get("/int-bank/accounts/443/transactions", function (req, res) {
  
  var dbQuery = `SELECT transaction_id, transaction_status, transaction_type, amount, transaction_description, transacted_on, posted_on, category, user_id, account_id FROM bank.transactions WHERE account_id='${443}'`;

  connection.query(dbQuery, function (err, result) {
    if (err) throw err;

    res.json(result)
    var transaction= [ { mdx: [ { _attr: { version: '5.0'} }, { account: [ { id: result[0].account_id }, { type: result[0].account_type }, { name: result[0].account_name }, { balance: result[0].balance }, { available_balance: result[0].available_balance }, { currency_code: result[0].currency_code }]} ] } ];
    // res.set('Content-Type', 'application/xml; charset=utf-8')
    // res.send(xml(account))

    
  });
});



module.exports = router;

