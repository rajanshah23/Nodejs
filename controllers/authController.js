const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { users, questions } = require("../model/index");
const { text } = require("express");
const { errorMonitor } = require("nodemailer/lib/xoauth2");
const sendEmail = require("../utils/sendEmail");

//home
exports.renderHomePage = async (req, res) => {
  const [success] = req.flash("success");
  const data = await questionsss.findAll({
    //return array
    include: {
      model: users,
      attributes: ["username"],
    },
  });
  console.log(data);
  res.render("home.ejs", { data, success });
};

exports.renderRegisterPage = (req, res) => {
  res.render("auth/register");
};

//Register
exports.handlRegister = async (req, res) => {
  //destructuring
  // const username=req.body.username// const email=req.body.email// const password=req.body.password
  //or
  const { username, email, password } = req.body;

  if (!email || !username || !password) {
    return res.send("Please provide  username  email and password");
  }

  await sendEmail({
    email: email,
    text: "Thank you for registering",
    subject: "Welcome to Project",
  });

  await users.create({
    email,
    username,
    password: await bcrypt.hash(password, 10), // i can do like this to  password: bcrypt.hashSync(passwor,10)
  });

  res.redirect("/login");
};

exports.renderloginPage = (req, res) => {
  const [error] = req.flash("error");
  const [success] = req.flash("success");
  res.render("auth/login", { error, success });
};

//login
exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send("Please provide email and password");
  }
  //email check
  const [data] = await users.findAll({
    where: {
      email: email,
    },
  });

  if (data) {
    //next password check garney
    const isMatched = bcrypt.compareSync(password, data.password);
    if (isMatched) {
      const token = jwt.sign({ id: data.id }, "hahaha", {
        expiresIn: "30d",
      });
      res.cookie("jwtToken", token);
      req.flash("success", "Logged in Successfully");
      res.redirect("/");
    } else {
      req.flash("error", "Invalid Email or Password😂");
      res.redirect("/login");
    }
  } else {
    req.flash("error", "No user with that email");
    res.redirect("/login");
  }
};

//logout
exports.handleLogout = (req, res) => {
  res.clearCookie("jwtToken");
  req.flash("success", "Logged out successfully");
  res.redirect("/login");
};

//forgot password
exports.renderForgotPasswordPage = (req, res) => {
  res.render("./auth/forgotPassword");
};

exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const data = await users.findAll({
    where: {
      email: email,
    },
  });

  if (data.length === 0) return res.send("No user registered with that email");
  const otp = Math.floor(1000 + Math.random() * 9000);

  //send that  otp to above incoming email
  await sendEmail({
    email: email,
    subject: "Your reset password OTP",
    text: `Your otp is ${otp}`,
  });
  data[0].otp = otp;
  data[0].otpGeneratedTime = Date.now();
  await data[0].save();

  res.redirect("/verifyOtp?email=" + email);
};

exports.renderVerifyOtpPage = (req, res) => {
  const email = req.query.email;
  res.render("./auth/verifyOtp", { email: email });
};

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.id;
  const data = await users.findAll({
    where: {
      otp: otp,
      email: email,
    },
  });
  if (data.length === 0) {
    return res.send("Invalid Otp");
  }
  const currentTime = Date.now();
  const otpGeneratedTime = data[0].otpGeneratedTime;
  if (currentTime - otpGeneratedTime <= 120000) {
    res.redirect(`/resetPassword?email=${email}&otp=${otp}`);
  } else {
    res.send("Otp expired!!");
  }
};

///Reset Password

exports.renderResetPassword = async (req, res) => {
  const { email, otp } = req.query;
  if (!email || !otp) {
    return res.send("Please provide email,otp in query");
  }
  res.render("./auth/resetPassword", { email, otp });
};

exports.handeResetPassword = async (req, res) => {
  const { email, otp } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.send("Please provide email,otp,newPassword,confirmPassword");
  }
  if (newPassword !== confirmPassword) {
    return res.send("New password must match confirm password");
  }
  const userData = await users.findAll({
    where: {
      email,
      otp,
    },
  });
  const currentTime = Date.now();
  const otpGeneratedTime = userData[0].otpGeneratedTime;
  if (currentTime - otpGeneratedTime <= 120000) {
    await users.update(
      {
        password: bcrypt.hashSync(newPassword, 10),
      },
      {
        where: {
          email: email,
        },
      }
    );
    res.redirect("/login");
  } else {
    res.send("Otp expiredd !!!");
  }
};
