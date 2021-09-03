var express = require("express");
var router = express.Router();
var DefaultTable = require("../models/DefaultTableModel");

const mongoose = require("mongoose");

/* GET users listing. */

router.post("/", async function (req, res, next) {
  console.log(req.body);
  //   if (!req.body) return;
  const createTable = {
    id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  };
  const defaultTable = new DefaultTable(createTable);
  try {
    await defaultTable.save();
    res.status(200).send({
      message: "Table Created",
      status: true,
      data: defaultTable,
    });
  } catch (error) {
    res.status(400).send({
      message: "Creating table failed",
      status: false,
    });
  }
});

router.put("/:id", function (req, res) {
  const id = req.params.id;
  const formData = req.body;

  if (!id)
    return res.status(202).send({
      status: false,
      message: "Table not found",
    });

  DefaultTable.findOneAndUpdate({ id: id }, formData, { new: true })
    .exec()
    .then((data) => {
      if (data) {
        res.status(200).send({
          status: true,
          message: "Table updated",
          data: data,
        });
      } else {
        res.status(202).send({
          status: false,
          message: "Table update fail",
        });
      }
    });
});

router.delete("/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return;

  await DefaultTable.findOneAndDelete({ id: id })
    .exec()
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "Table deleted ",
          status: true,
          data: data,
        });
      }
    })
    .catch((error) => {
      res.status(400).send({
        message: "Deleting table failed",
        status: false,
      });
    });
});

module.exports = router;
