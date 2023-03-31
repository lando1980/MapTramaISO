var express = require('express');
var router = express.Router();
var Iso8583Service = require("../logic/Iso8583Service.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/getIso8583_A", Iso8583Service.getIso8583_A);

router.get("/getIso8583_B", Iso8583Service.getIso8583_B);

router.get("/getAscciFromHex", Iso8583Service.getAscciFromHex);

module.exports = router;

// Como validar longitud de campos en react?