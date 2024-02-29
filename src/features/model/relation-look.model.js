import mongoose from "mongoose";

/**
 * Relation Looking Schema
 */
const relationLookingSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

relationLookingSchema.set("toJSON", { virtuals: true });
const RelationLookingModel = mongoose.model(
  "RelationLooking",
  relationLookingSchema
);

export default RelationLookingModel;
