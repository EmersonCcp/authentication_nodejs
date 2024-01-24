import { Router } from "express";
import {
  login,
  register,
  authenticateToken,
} from "../controllers/authentication.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/authenticateToken", authenticateToken);

export default router;
