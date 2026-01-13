import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "user already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // store token in Redis
    await redis.set(`session:${user._id}`, token, "EX", 60 * 60 * 24);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //redis

    await redis.set(`session:${user._id}`, token, "EX", 60 * 60 * 24);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const logout = async (req, res) => {
  try {
    await redis.del(`session:${req.userId}`);
    res.json({ msg: "Logged out" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
