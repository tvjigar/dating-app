import mongoose from "mongoose";

var otpSchema = new mongoose.Schema({
  phone_number: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  created_at: { type: Date, default: Date.now() },
  __v: { type: Number, select: false },
});

otpSchema.set("toJSON", { virtuals: true });
const OtpModel = mongoose.model("Otp", otpSchema);

export default OtpModel;
