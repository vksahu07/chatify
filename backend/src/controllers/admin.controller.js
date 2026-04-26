import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { ENV } from "../lib/env.js";

export const adminLogin = (req, res) => {
  const { username, password } = req.body;
  if (
    username === ENV.ADMIN_USERNAME &&
    password === ENV.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ isAdmin: true, username }, ENV.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token });
  }
  return res.status(401).json({ message: "Invalid admin credentials" });
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const totalMessages = await Message.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const messagesToday = await Message.countDocuments({ createdAt: { $gte: today } });

    // Messages per day last 7 days
    const last7 = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ totalUsers, bannedUsers, totalMessages, newUsersToday, messagesToday, last7 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const query = search
      ? { $or: [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : {};
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Message.deleteMany({
      $or: [{ senderId: req.params.id }, { receiverId: req.params.id }],
    });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const banUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBanned: true });
    res.json({ message: "User banned" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const unbanUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBanned: false });
    res.json({ message: "User unbanned" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const messages = await Message.find()
      .populate("senderId", "fullName email")
      .populate("receiverId", "fullName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Message.countDocuments();
    res.json({ messages, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
