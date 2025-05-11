import { agenda } from "../config/agenda.js";
import EmailSchedule from "../models/EmailSchedule.js";

export const scheduleEmail = async (req, res) => {
  try {
    const user = req.user;
    const { email, subject, body, sendAt } = req.body;

    // Validate Input
    if (!email || !subject || !body || !sendAt) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    // Convert `sendAt` to UTC to prevent timezone issues
    const scheduledTime = new Date(sendAt).toISOString();

    // Create and save email schedule
    const emailSchedule = new EmailSchedule({ user, email, subject, sendAt: scheduledTime, body });
    await emailSchedule.save();

    // Schedule email via Agenda
    try {
      await agenda.schedule(scheduledTime, "send email", {
        email,
        subject,
        body,
        sendAt: scheduledTime,
        emailId: emailSchedule._id,
      });
    } catch (error) {
      console.error("❌ Error scheduling email in Agenda:", error.message);
      return res.status(500).json({ success: false, error: "Failed to schedule email." });
    }

    return res.status(200).json({
      success: true,
      message: "Email scheduled successfully",
      emailSchedule,
    });

  } catch (error) {
    console.error("❌ Email scheduling error:", error.message);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};