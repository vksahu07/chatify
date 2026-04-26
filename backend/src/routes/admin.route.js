import express from "express";
import {
  getStats,
  getAllUsers,
  deleteUser,
  banUser,
  unbanUser,
  getAllMessages,
  deleteMessage,
  adminLogin,
} from "../controllers/admin.controller.js";
import { protectAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", protectAdmin, getStats);
router.get("/users", protectAdmin, getAllUsers);
router.delete("/users/:id", protectAdmin, deleteUser);
router.patch("/users/:id/ban", protectAdmin, banUser);
router.patch("/users/:id/unban", protectAdmin, unbanUser);
router.get("/messages", protectAdmin, getAllMessages);
router.delete("/messages/:id", protectAdmin, deleteMessage);

export default router;
