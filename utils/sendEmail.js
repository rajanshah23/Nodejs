const nodemailer = require("nodemailer");
const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:  process.env.EMAIL_USER, //company gmail
      pass: process.env.EMAIL_PASSWORD //app password
    }
  });
  
  const mailOption = {
    from: `Nodejs<${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: data.subject,
    text: data.text,
  };
  await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
