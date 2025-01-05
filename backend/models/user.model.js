import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: function() {
				return !this.provider; // Only required if not using OAuth
			},
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		provider: {
			type: String,
			enum: [null, 'google', 'github'],
			default: null
		},
		providerId: {
			type: String,
			sparse: true
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;