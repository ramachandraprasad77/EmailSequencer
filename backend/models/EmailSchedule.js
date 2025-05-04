import mongoose from "mongoose";

const EmailScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  sendAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
});

const EmailSchedule = mongoose.model("EmailSchedule", EmailScheduleSchema);

export default EmailSchedule;