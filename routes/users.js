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
const { UserValidator } = require("../validation/Staff");

const { body, validationResult } = require("express-validator");
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
  // body('position').isLength({ min: 5 }),
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
      name: req.body.name,
      username: req.body.username,
      password: req.body?.password || "123456",
      phone: req.body.phone || "",
      position: req.body.position,
      avatar: req?.file?.path,
      salary: parseInt(req.body.salary),
    };
    const staff = new Staff(initStaff);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
            message: "added Staff successfully",
            data: staff,
          });
        });
    } catch (error) {
      res.status(500).send({ error: err });
    }
  }
);

router.patch("/:idStaff", patchStaff);

router.delete("/:idStaff", deleteStaff);

router.delete("/", deleteAllStaff);

module.exports = router;
