import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	checkVerification,
} from "../controllers/auth.controller.js";
import { googleAuth, githubAuth, oauthCallback } from "../controllers/oauth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.get("/check-verification", checkVerification);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", oauthCallback('google'));

router.get("/github", githubAuth);
router.get("/github/callback", oauthCallback('github'));

export default router;