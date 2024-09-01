import connectDB from "../config/db.js";
import User from "../models/createUser.js";
import { formatJSONResponse } from "../utills/ApiGateway.js";
import bcrypt from "bcrypt";
import token from "jsonwebtoken";

const SALT_ROUNDS = 10;
const passwordValidation = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
    password
  );
};
connectDB();

export const createUser = async (event) => {
  try {
    connectDB();
    const { name, username, password } = JSON.parse(event.body);
    if (!name || !username || !password) {
      return formatJSONResponse(400, { data: "Missing required fields" });
    }

    if (!passwordValidation(password)) {
      return formatJSONResponse(400, {
        data: "InPassword must be at least 7 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({ name, username, password: hashedPassword });
    const savedUser = await newUser.save();
    return formatJSONResponse(201, { savedUser });
  } catch (error) {
    return formatJSONResponse(500, { error: "Internal Server Error" });
  }
};
export const loginUser = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);
    if (!username || !password) {
      return formatJSONResponse(400, { message: "Missing required fields" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return formatJSONResponse(400, {
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return formatJSONResponse(400, {
        message: "Invalid username or password",
      });
    }
    const tokens = await token.sign(
      { username: user.username, id: user._id },
      process.env.SECRETKEY,
      { expiresIn: "12h" }
    );

    return formatJSONResponse(200, { data: tokens });
  } catch (error) {
    return formatJSONResponse(500, { error: "Internal Server Error" });
  }
};

export const updateUserPassword = async (event) => {
  try {
    await connectDB();
    const { username, password } = JSON.parse(event.body);

    const result = passwordValidation(password);

    if (!passwordValidation(password)) {
      return formatJSONResponse(400, {
        message:
          "Password must be at least 7 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.findOneAndUpdate(
      { username },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return formatJSONResponse(201, { user });
  } catch (error) {
    return formatJSONResponse(500, { data: "Internal Server Error" });
  }
};
