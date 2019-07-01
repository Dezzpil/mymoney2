
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./client_secret.json');

// Identifying which document we'll be accessing/reading from
var doc = new GoogleSpreadsheet('1UIV4RkOx8KJK2zQYig0klH5_f8FCOdwIWV8YF2VyF8I');

// Authentication
doc.useServiceAccountAuth(creds, function (err) {

  // Getting cells back from tab #2 of the file
  doc.getCells(2, callback);

  // Callback function determining what to do with the information
  function callback(err, rows){

    // Logging the output or error, depending on how the request went
    console.log(rows)
    console.log(err)

    // Rending the test page while passing in the response data through "rows". Can access specific data points via: rows[i]._value
    res.render('test', {rows:rows})
  }
});