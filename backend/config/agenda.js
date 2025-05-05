import dotenv from 'dotenv';
dotenv.config();
import Agenda from "agenda";
import nodemailer from "nodemailer";
import EmailSchedule from '../models/EmailSchedule.js';


const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI not defined! Please check your envt variables.");
}

const agenda = new Agenda({
  db: {
    address: mongoUri,
    collection: "users",
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

agenda.define("send email", async (job) => {
  const { email, subject, body, emailId } = job.attrs.data;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: body,
    });
    await EmailSchedule.findByIdAndUpdate(emailId, { status: "sent" });
    console.log(` Email sent to ${email}`);
  } catch (error) {
    console.error(" Error sending email:", error);
  }
});

const agendaReady = (async () => {
  await agenda.start();
  console.log(" Agenda Get started");
})();
agendaReady();

export { agenda, agendaReady };
