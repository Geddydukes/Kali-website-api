const nodemailer = require("nodemailer");

// route is now api/vi/email

const contact = (req, res) => {
  const data = req.body;
  console.log(data);

  const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: process.env.gmailUser,
      pass: process.env.gmailPassword,
    },
  });

  var mailOptions = {
    from: data.email,
    to: process.env.myEmail,
    subject: "A request for contact",
    html: `<p>${data.name}</p>
                <p>${data.email}</p>
                <p>${data.message}</p>`,
  };

  console.log(smtpTransport, " is the gmail auth");

  console.log(mailOptions, " is the mail options");

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log("Success");
      res.send("Success");
    }
    smtpTransport.close();
  });
};

module.exports = {
  contact,
};
