import mongoose from "mongoose";

/**
 * Interes Schema
 */
const interestSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

interestSchema.set("toJSON", { virtuals: true });
const InterestModel = mongoose.model("Interest", interestSchema);

export default InterestModel;
