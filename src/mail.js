const nodemailer = require("nodemailer");

const mailReceiver = process.env.MAIL_RECEIVER || "";

const TYPE_SUCCESS = 0;
const TYPE_ERROR = 0;

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "",
  port: process.env.SMTP_PORT || "",
  secure: process.env.SMTP_SECURE ? true : false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

exports.notify = async (subject, data, type) => {
  let info = await transporter.sendMail({
    from: `"CoWIN Notifier" <${mailReceiver}>`,
    to: mailReceiver,
    subject: "CoWIN Vaccination Slot Available!",
    text: "Hello world",
    html: "<b>Hello world</b>",
  });
};

exports.postAvailability = async (data) => {
  await this.notify("CoWIN Vaccination Slot Available!", data, TYPE_SUCCESS);
};

exports.postError = async (err) => {
  await this.notify("CoWIN Notifier failed to execute", err, TYPE_ERROR);
};
