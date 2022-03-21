import nodemailer from "nodemailer";
import Mail, { AttachmentLike } from "nodemailer/lib/mailer";
import { Readable } from "stream";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(
  to: string | Mail.Address | (string | Mail.Address)[] | undefined,
  html: string | Buffer | Readable | AttachmentLike | undefined
) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("testAccount", testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "ispqhaxshwhsgjbr@ethereal.email", // generated ethereal user
      pass: "AdAsVu31bZh3C9Q6qg", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject: "Change password", // Subject line
    html, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
