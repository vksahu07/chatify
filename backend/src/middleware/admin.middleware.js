import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";

export const protectAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: "Forbidden - Admins only" });

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
