const nodemailer = require("nodemailer");
const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shahrajan284@gmail.com", //company gmail
      pass: "izasyptnhspwyvrv" //app password
    }
  });
  
  const mailOption = {
    from: "Nodejs<shahrajan284@gmail.com>",
    to: data.email,
    subject: data.subject,
    text: data.text,
  };
  await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
