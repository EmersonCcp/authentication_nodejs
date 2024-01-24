import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} from "../controllers/users.controllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/api/users", authenticateToken, getUsers);
router.get("/api/user/:id", getUser);
router.post("/api/user", createUser);
router.put("/api/user/:id", updateUser);
router.delete("/api/user/:id", authenticateToken, deleteUser);

export default router;
