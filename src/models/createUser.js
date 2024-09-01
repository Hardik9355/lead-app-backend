import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (v) {
          // Regular expression to validate the username format: e.g., 'JohnDoe123'
          return /^[a-zA-Z]+\d+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid username!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
