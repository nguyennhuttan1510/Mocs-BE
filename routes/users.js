var express = require("express");
const { route } = require(".");
const {
  getAll,
  post,
  getStaff,
  patchStaff,
  deleteStaff,
  deleteAllStaff,
} = require("../controller/Staff");
var router = express.Router();
var Staff = require("../models/StaffModel");

const upload = require("../middleware/UploadImage");

/* GET users listing. */
router.get("/", getAll);

router.get("/:idStaff", function (req, res, next) {
  const idStaff = req.params.idStaff;
  console.log(idStaff);
  Staff.findOne({ id: idStaff })
    .exec()
    .then((Staff) => {
      console.log(Staff);
      res.status(200).send({
        status: true,
        data: Staff,
      });
    })
    .catch((err) => {
      res.status(404).send({
        status: false,
        data: {},
      });
    });
});

router.post(
  "/",
  upload.single("avatar"), //"image" IS FIELD NAME NEED UPLOAD
  async function (req, res, next) {
    let maxIdStaff = 0;
    await Staff.find()
      .exec()
      .then((data) => {
        const idStaff = data.map((e) => e.id);
        return (maxIdStaff = Math.max(...idStaff) + 1);
      });
    const initStaff = {
      id: req.body?.id || maxIdStaff,
      name: req.body.name == "" ? `User${maxIdStaff}` : req.body.name,
      username: req.body.username,
      password:
        req.body?.password == "undefined" ? "123456" : req.body?.password,
      phone: req.body.phone,
      position: req.body.position ? req.body.position : "Client",
      avatar: req?.file?.path,
      salary: parseInt(req.body.salary) || 0,
      bonus: req.body?.bonus || 0,
    };
    const staff = new Staff(initStaff);

    try {
      Staff.findOne({ username: req.body.username })
        .exec()
        .then(async (objStaff) => {
          if (objStaff) {
            res.send({
              status: false,
              message: "username has created, please use username other",
              data: [],
            });
            return;
          }
          await staff.save();
          res.send({
            status: true,
            message:
              initStaff.position === "Client"
                ? "Created successfully"
                : "Added Staff successfully",
            data: staff,
          });
        });
    } catch (error) {
      res.status(500).send({ error: err });
    }
  }
);

router.post("/:idStaff", upload.single("avatar"), function (req, res, next) {
  const idStaff = req.params.idStaff;
  console.log("🚀 ~ file: Staff.js ~ line 77 ~ idStaff", idStaff);
  console.log("🚀 ~ file: Staff.js ~ line 80 ~ req.body", req.body);
  Staff.findOne({ id: idStaff })
    .exec()
    .then((data) => {
      console.log("🚀 ~ file: users.js ~ line 98 ~ .then ~ data", data);
      const objStaffUpdate = {
        phone: req.body.phone || data.phone,
        salary: req.body.salary || data.salary,
        position: req.body.position || data.position,
        bonus: req.body.bonus || data.bonus,
        name: req.body.name || data.name,
        avatar: req?.file?.path || data.avatar,
        password: req.body.password !== "" ? req.body.password : data.password,
      };
      Staff.findOneAndUpdate({ id: idStaff }, objStaffUpdate, { new: true })
        .exec()
        .then((Staff) => {
          console.log("🚀 ~ file: Staff.js ~ line 81 ~ .then ~ Staff", Staff);
          res.send({
            status: true,
            message: `Update Staff ${Staff.name} successfully`,
          });
        })
        .catch((err) => {
          res.status(500).send({ error: err });
        });
    });
});

router.delete("/:idStaff", deleteStaff);

router.delete("/", deleteAllStaff);

module.exports = router;
