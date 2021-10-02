var express = require("express");
var router = express.Router();
var Event = require("../../models/clients/Event");
const upload = require("../../middleware/UploadImage");

const mongoose = require("mongoose");

/* GET users listing. */

router.post("/", upload.single("url_image"), async function (req, res, next) {
  if (!req.body) {
    res.status(202).send({
      message: "Please, fill form",
      status: false,
    });
  }
  const createEvent = {
    id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    startDate: req.body.startDate || new Date(),
    endDate: req.body.endDate,
    url_image: req?.file?.path,
  };
  const event = new Event(createEvent);
  try {
    await event.save();
    res.status(200).send({
      message: "Event Created Successfully",
      status: true,
      data: event,
    });
  } catch (error) {
    res.status(202).send({
      message: "Event Create Fail",
      status: false,
    });
  }
});

module.exports = router;
