const { Resend } = require("resend");

const resend = new Resend("re_VQinHgaG_DUE4xrJXRXtvC9KGJjG2c1gQ");

async function SendMail(input) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: "atif251171@gmail.com", //for testing purposes
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
