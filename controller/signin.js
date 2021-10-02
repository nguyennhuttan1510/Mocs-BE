const Staff = require("../models/StaffModel");

exports.giveStaff = function (req, res, next) {
  if (req.body == {}) return;
  const query = { username: req.body.username, password: req.body.password };
  Staff.findOne(query)
    .exec()
    .then((Staff) => {
      if (!Staff) {
        res.status(404).send({
          status: false,
          error: "sign in is fail, please check account",
        });
        return;
      }
      res.status(200).send({
        status: true,
        data: {
          id: Staff.id,
          name: Staff.name,
          phone: Staff.phone,
          position: Staff.position,
          username: Staff.username,
          salary: Staff.salary,
          bonus: Staff.bonus,
          total_cost: Staff.total_cost,
          createdAt: Staff.createdAt,
          avatar: Staff.avatar,
          feedback: Staff.feedback,
          point: Staff.point,
        },
      });
    });
};
