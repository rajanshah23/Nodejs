const { renderRegisterPage, handlRegister, renderloginPage, handleLogin, handleLogout, renderForgotPasswordPage, handleForgotPassword, renderVerifyOtpPage, verifyOtp, renderResetPassword, handeResetPassword } = require("../controllers/authController")

const router=require("express").Router()

router.route('/register').get(renderRegisterPage).post(handlRegister)
router.route('/login').get(renderloginPage).post(handleLogin)
router.route('/logout').get(handleLogout)


router.route('/forgotPassword')
  .get(renderForgotPasswordPage)
  .post(handleForgotPassword);


  router.route('/verifyotp')
  .get(renderVerifyOtpPage)

  router.route("/verifyOtp/:id").post(verifyOtp)
router.route("/resetPassword").get(renderResetPassword)
router.route("/resetPassword/:email/:otp").post(handeResetPassword)
 
module.exports=router