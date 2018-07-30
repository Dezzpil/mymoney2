const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');





/* GET home page. */
router.get('/', function(req, res, next) {
  let data = { title: 'Home' };
  res.render('index', data);
});

/* GET purchases page */
router.get('/p', function(req, res, next) {
    let data = { title: 'Purchases' };
    res.render('purchases', data);
});

router.post('/p', async function(req, res, next) {

  const client = require('./../mongo');
  
  let value = req.body.value || 0;
  let tags = req.body.tags || '';
  if (req.body.comment) {
      let comment = req.body.comment;
  }


  // todo save purchase to collection

  res.redirect(301, '/p');
});

module.exports = router;
