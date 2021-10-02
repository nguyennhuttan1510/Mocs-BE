const Staff = require("../models/StaffModel");

const handleFieldResponse = (Staff) => {
  const result = Staff.map((e) => ({
    id: e.id,
    name: e.name,
    avatar: e.avatar,
    position: e.position,
  }));
  return result;
};

exports.getAll = function (req, res, next) {
  Staff.find()
    .exec()
    .then((Staffs) => {
      const result = handleFieldResponse(Staffs);
      res.status(200).send({
        status: true,
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        status: false,
        data: [],
      });
    });
};

exports.getStaff = function (req, res, next) {
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
};

// exports.post = async function (req, res, next) {
//   const staff = new Staff(req.body);
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   console.log(req.body);
//   try {
//     await staff.save();
//     res.send({
//       status: true,
//       message: 'added Staff successfully',
//       data: staff,
//     });
//   } catch (error) {
//     res.send({
//       status: fasle,
//       message: 'added Staff fail',
//       data: {},
//     });
//   }
// };

// exports.patchStaff = function (req, res, next) {
//   const idStaff = req.params.idStaff;
//   console.log("🚀 ~ file: Staff.js ~ line 77 ~ idStaff", idStaff);
//   console.log("🚀 ~ file: Staff.js ~ line 80 ~ req.body", req.body);
//   const objStaffUpdate = {
//     phone: req.body.phone,
//     salary: !!req.body.salary || 0,
//     position: req.body.position,
//     bonus: !!req.body.bonus || 0,
//     name: req.body.name,
//     avatar: req?.file?.path,
//   };
//   Staff.findOneAndUpdate({ id: idStaff }, objStaffUpdate, { new: true })
//     .exec()
//     .then((Staff) => {
//       console.log("🚀 ~ file: Staff.js ~ line 81 ~ .then ~ Staff", Staff);
//       res.send({
//         status: true,
//         message: `Update Staff ${Staff.name} successfully`,
//         data: Staff,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({ error: err });
//     });
// };

exports.deleteStaff = function (req, res, next) {
  const idStaff = req.params.idStaff;
  Staff.findOneAndDelete({ id: idStaff })
    .exec()
    .then((Staff) => {
      console.log(Staff);
      res.send({
        status: true,
        data: Staff,
        massage: "Staff deleted successfully",
      });
    })
    .catch((err) => {
      res.send({
        status: false,
        massage: "Staff deleted fail",
      });
    });
};

exports.deleteAllStaff = function (req, res, next) {
  const idStaff = req.params.idStaff;
  //   const query = { id: idStaff };
  Staff.deleteMany()
    .exec()
    .then((Staff) => {
      console.log(Staff);
      res.send({
        status: true,
        data: Staff,
        massage: "Staffs deleted successfully",
      });
    })
    .catch((err) => {
      res.send({
        status: false,
        massage: "Staffs deleted fail",
      });
    });
};
