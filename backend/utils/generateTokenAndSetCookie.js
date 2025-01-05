import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: true, // Enable for HTTPS
		sameSite: "none", // Allow cross-origin cookies
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};