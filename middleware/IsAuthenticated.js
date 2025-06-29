const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { users } = require("../model/index");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.jwtToken;
  console.log(token);
  if (!token || token === null || token === undefined) {
    //yedi token aayena vane login page ma lagdiney
    return res.redirect('/login');
  }
  //yedi token aayo vane
  const verifiedResult = await promisify(jwt.verify)(token, "hahaha");
  console.log(verifiedResult);
  const data = await users.findByPk(verifiedResult.id);
  if (!data) {
    return res.redirect('/login');
  }
  req.userId = verifiedResult.id;
  next();
};
