const dotenv = require("dotenv");
dotenv.config();
const { Resend } = require("resend");
const api = process.env.RESEND_API;
const resend = new Resend(api);

async function SendMail(input) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: process.env.RESEND_EMAIL, //for testing purposes
    subject: input.subject,
    html: input.html,
  });

  if (error) {
    console.log(error.message);
    return {
      status: false,
      message: error.message,
    };
  }

  return {
    status: true,
    message: "Message Send Success",
  };
}

module.exports = SendMail;
