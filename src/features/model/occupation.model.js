import mongoose from "mongoose";

/**
 * Occupation Schema
 */
const occupationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

occupationSchema.set("toJSON", { virtuals: true });
export const OccupationModel = mongoose.model("Occupation", occupationSchema);

export default OccupationModel;
