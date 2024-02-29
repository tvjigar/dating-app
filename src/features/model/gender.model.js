import mongoose from "mongoose";

/**
 * Gender Schema
 */
const genderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

genderSchema.set("toJSON", { virtuals: true });
const GenderModel = mongoose.model("Gender", genderSchema);

export default GenderModel;
