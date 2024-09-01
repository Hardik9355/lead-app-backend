import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    mobile_number: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    product: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
