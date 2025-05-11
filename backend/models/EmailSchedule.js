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
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email format",
    },
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
}, { timestamps: true });

// Indexing for faster query performance
EmailScheduleSchema.index({ user: 1, sendAt: 1 });

// Middleware: Auto-update status when email time passes
EmailScheduleSchema.pre("save", function (next) {
  if (this.sendAt && this.sendAt <= new Date()) {
    this.status = "sent";
  }
  next();
});

// Method to schedule an email
EmailScheduleSchema.methods.scheduleEmail = async function () {
  try {
    if (this.sendAt <= new Date()) {
      this.status = "sent";
      await this.save();
    }
  } catch (error) {
    console.error("❌ Error scheduling email:", error.message);
  }
};

const EmailSchedule = mongoose.model("EmailSchedule", EmailScheduleSchema);

export default EmailSchedule;