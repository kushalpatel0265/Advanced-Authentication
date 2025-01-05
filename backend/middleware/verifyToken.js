import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;
	
	if (!token) {
		console.log("No token found in cookies");
		return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			console.log("Token verification failed");
			return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
		}

		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log("Error in verifyToken:", error.message);
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ success: false, message: "Invalid token" });
		}
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ success: false, message: "Token expired" });
		}
		return res.status(500).json({ success: false, message: "Server error" });
	}
};