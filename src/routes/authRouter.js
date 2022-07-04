import { Router } from "express";
import { userLogin, userSignup, userSignout } from "../controllers/authController.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import { validateSignup } from "../middlewares/validateSignup.js";
import { validateToken } from "../middlewares/validateToken.js";

const router = Router();

router.post("/login", validateLogin, userLogin);
router.post("/signup", validateSignup, userSignup);
router.get("/signout", validateToken, userSignout);

export default router;