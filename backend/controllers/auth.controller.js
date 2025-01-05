import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		// Generate a simple 6-digit code
		const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken: verificationCode,
			verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
		});

		await user.save();

		// Try to send verification email
		try {
			await sendVerificationEmail(user.email, verificationCode);
		} catch (emailError) {
			console.error('Failed to send verification email:', emailError);
			return res.status(201).json({
				success: true,
				message: "Account created but verification email failed to send. Please contact support.",
				user: {
					...user._doc,
					password: undefined,
				},
			});
		}

		res.status(201).json({
			success: true,
			message: "User created successfully. Please check your email for verification code.",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.error('Signup error:', error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code, email } = req.body;
	
	try {
		// Find user by email first
		const user = await User.findOne({ email });
		
		if (!user) {
			return res.status(400).json({ 
				success: false, 
				message: "User not found." 
			});
		}

		// Check if already verified
		if (user.isVerified) {
			return res.status(400).json({
				success: false,
				message: "Email is already verified."
			});
		}

		// Check verification code
		if (user.verificationToken !== code) {
			return res.status(400).json({
				success: false,
				message: "Invalid verification code."
			});
		}

		// Check if code is expired
		if (user.verificationTokenExpiresAt < new Date()) {
			return res.status(400).json({
				success: false,
				message: "Verification code has expired."
			});
		}

		// Verify the user
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		// Send welcome email
		try {
			await sendWelcomeEmail(user.email, user.name);
		} catch (error) {
			console.error('Failed to send welcome email:', error);
			// Continue even if welcome email fails
		}

		// Set authentication token
		generateTokenAndSetCookie(res, user._id);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.error("Error in verifyEmail:", error);
		res.status(500).json({ 
			success: false, 
			message: "Something went wrong while verifying your email." 
		});
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkVerification = async (req, res) => {
	const { email } = req.query;

	try {
		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required"
			});
		}

		const user = await User.findOne({ email });
		
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			});
		}

		return res.status(200).json({
			success: true,
			isVerified: user.isVerified
		});
	} catch (error) {
		console.error("Error in checkVerification:", error);
		res.status(500).json({
			success: false,
			message: "Something went wrong while checking verification status"
		});
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(401).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(401).json({ success: false, message: "Authentication failed" });
	}
};