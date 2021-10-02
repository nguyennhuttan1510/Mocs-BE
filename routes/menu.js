var express = require("express");
var router = express.Router();
var Menu = require("../models/MenuModel");
var { handleResponseMenu } = require("../util/ResponseField");
const upload = require("../middleware/UploadImage");

const mongoose = require("mongoose");

/* GET users listing. */

router.post("/", upload.single("url_image"), async function (req, res, next) {
  console.log("🚀 ~ file: menu.js ~ line 12 ~ req", req.file);
  console.log("🚀 ~ file: menu.js ~ line 12 ~ req", req.body);
  if (!req.body) {
    res.status(202).send({
      message: "Please, fill form",
      status: false,
    });
  }
  const createMenu = {
    id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    discount: req.body.discount,
    category: req.body.category,
    url_image: req?.file?.path,
    description_short_food: req.body.description_short_food,
  };
  const menu = new Menu(createMenu);
  try {
    await menu.save();
    res.status(200).send({
      message: "Menu Created Successfully",
      status: true,
      data: menu,
    });
  } catch (error) {
    res.status(202).send({
      message: "Menu Create Fail",
      status: false,
    });
  }
});

router.post("/:id", upload.single("url_image"), async function (req, res) {
  console.log("🚀 ~ file: menu.js ~ line 44 ~ req", req.body);
  const id = req.params.id;
  if (!id) return;
  if (!req?.body) {
    res.status(202).send({
      message: "Please, fill form",
      status: false,
    });
    return;
  }
  const updateMenu = {
    name: req.body.name,
    price: req.body.price,
    discount: req.body.discount,
    category: req.body.category,
    url_image: req?.file?.path,
    description_short_food: req.body.description_short_food,
  };

  Menu.findOneAndUpdate({ id: id }, updateMenu, { new: true })
    .exec()
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "Menu updated",
          status: true,
          data: data,
        });
      } else {
        res.status(202).send({
          message: "Menu update fail",
          status: false,
        });
      }
    });
});

router.delete("/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return;
  try {
    await Menu.findOneAndDelete({ id: id })
      .exec()
      .then((data) => {
        res.status(200).send({
          message: "Menu Deleted Successfully",
          status: true,
          data: data,
        });
      })
      .catch((err) => {
        res.status(202).send({
          message: "Menu Delete Fail",
          status: false,
        });
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async function (req, res) {
  if (!req.body) return;
  await Menu.find({})
    .exec()
    .then(async (data) => {
      const result = await handleResponseMenu(data);
      console.log("result getAll", result);
      res.status(200).send({
        status: true,
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).send({
        status: false,
        message: err,
      });
    });
});

module.exports = router;
