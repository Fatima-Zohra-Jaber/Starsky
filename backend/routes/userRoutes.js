import express from "express";
import { register, login, getIdUser} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getIdUser);

export default router;

