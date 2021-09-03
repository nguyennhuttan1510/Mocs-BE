var express = require("express");
var router = express.Router();

const { giveStaff } = require("../controller/signin");

/* GET users listing. */

router.post("/", giveStaff);

module.exports = router;
