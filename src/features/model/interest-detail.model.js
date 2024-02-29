import mongoose from "mongoose";

/**
 * Interest Detail Schema
 */
const interestDetailsSchema = new mongoose.Schema({
  interest_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interest",
    required: true,
  },
  interest_name: {
    type: String,
  },
});

interestDetailsSchema.set("toJSON", { virtuals: true });
const InterestDetailModel = mongoose.model(
  "InterestDetail",
  interestDetailsSchema
);

export default InterestDetailModel;
