// Importing existing email templates and Mailtrap configuration
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE, // Newly added template
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

/**
 * Sends a verification email to the specified recipient.
 * @param {string} email - Recipient's email address.
 * @param {string} verificationCode - Verification code to include in the email.
 */
export const sendVerificationEmail = async (email, verificationCode) => {
	const recipient = [{ email }];

	try {
		const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode);

		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: html,
			category: "Email Verification",
		});

		console.log("Verification email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification email`, error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

/**
 * Sends a password reset request email to the specified recipient.
 * @param {string} email - Recipient's email address.
 * @param {string} resetURL - URL for resetting the password.
 */
export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: html,
			category: "Password Reset",
		});

		console.log("Password reset request email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset email`, error);
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

/**
 * Sends a password reset success email to the specified recipient.
 * @param {string} email - Recipient's email address.
 */
export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset success email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};

/**
 * Sends a welcome email to the specified recipient.
 * @param {string} email - Recipient's email address.
 * @param {string} name - Recipient's name.
 * @param {string} loginURL - URL for the recipient to log in.
 */
export const sendWelcomeEmail = async (email, name, loginURL) => {
	const recipient = [{ email }];

	try {
		const html = WELCOME_EMAIL_TEMPLATE
			.replace("{name}", name)
			.replace("{company_info_name}", "Advanced Authentication") 
			.replace("{loginURL}", "http://localhost:3000/dashboard");

		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Welcome to Advanced Authentication!",
			html: html,
			category: "Welcome",
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};
