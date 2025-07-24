import express from "express";
import { register, login, getIdUser} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getIdUser);

export default router;

