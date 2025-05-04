import {agenda} from "../config/agenda.js";
import EmailSchedule from "../models/EmailSchedule.js";

export const scheduleEmail = async (req, res) => {
  try {
    const user = req.user
    const { email, subject, body, sendAt } = req.body;
    const emailSchedule = new EmailSchedule({
      user,
      email,
      subject,
      sendAt,
      body,
    });
    await emailSchedule.save();
    
    await agenda.schedule(new Date(sendAt), "send email", {
      email,
      subject,
      body,
      sendAt,
      emailId: emailSchedule._id,
    });
    return res.status(200).send({
      success: true,
      message: "Email scheduled successfully",
      emailSchedule,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, error: "Internal server error" });
  }
};