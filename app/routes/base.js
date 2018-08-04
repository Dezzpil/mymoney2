const express = require('express');
const router = express.Router();
const assert = require('assert');
const Parser = require('../src/InputParser.js');
const Connector = require('../src/MongoConnector.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = { title: 'Home' };
  res.render('index', data);
});

/* GET purchases page */
router.get('/p', async function(req, res, next) {

    let purchases = [];
    try {
        let connector = new Connector();
        let db = await connector.connect();
        let col = db.collection('purchases');
        purchases = await col.find().toArray();
        console.log(purchases);
    } catch (e) {
        res.status(500).send(e.toString());
    }

    // let exampleList = [{ text: 'example', value: 42.2, made_at: new Date()}];

    let data = { title: 'Покупки', list: purchases };
    res.render('purchases', data);
});

/**
 *
 */
router.post('/p', async function(req, res, next) {

    let parser = new Parser();
    let parsed = {};
    try {
        parsed = parser.parse(req.body.text);
    } catch (e) {
        res.status(500).send(e.toString());
    }

    let rightNow = new Date();
    let now = rightNow.toISOString().slice(0,10).replace(/-/g,"/");
    let result = Object.assign(parsed, {made_at: now});

    try {
        let connector = new Connector();
        let db = await connector.connect();
        let col = db.collection('purchases');
        let r = await col.insertOne(result);
        assert.equal(1, r.insertedCount);
    } catch (e) {
        res.status(500).send(e.toString());
    }

    res.redirect(301, '/p');
});

module.exports = router;
