const { check, body, validationResult } = require('express-validator');

exports.UserValidator = function (req, res, next) {
  //name
  body('position').isLength({ min: 5 });
  //   check('name', 'Name is required.').not().isEmpty();
  //   check('phone', 'Phone is required.').not().isEmpty();
  //   check('avatar', 'Username must be more than 1 characters').isLength({
  //     min: 2,
  //   });
  //   check('position', 'Position is required.').not().isEmpty();
  // req.check('password', 'Password must be more than 6 characters').isLength({min:6});
  // req.check('password_confirm', 'Password confirm is required.').not().isEmpty();
  // req.check('password_confirm','Password mismatch').equals(req.body.password);

  //check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
