import { Router } from "express";
import { userLogin, userSignup, userSignout } from "../controllers/authController.js";

const router = Router();

router.post("/login", userLogin);
router.post("/signup", userSignout);
router.get("/signout", userSignup);

export default router;