import { Token, decrypt, generateToken } from "@/app/utils/authHelpers";
import { cookies } from "next/headers";

const BASE_URL = process.env.VERCEL_URL || process.env.BASE_URL;

export async function login(formData: FormData) {
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	const response = await fetch(`${BASE_URL}/api/login`, {
		method: "POST",
		body: JSON.stringify({ username, password }),
	});

	if (response.status !== 201) {
		throw new Error("Error logging in");
	}
	try {
		const { userId, username: user, role } = await response.json();

		const token = generateToken(userId, user, role);
		cookies().set("session", token, {
			secure: true,
			httpOnly: true,
			path: "/",
			sameSite: "strict",
		});
	} catch (error) {
		throw new Error("Error logging in");
	}

	return response;
}

export async function register(formData: FormData) {
	await fetch(`${BASE_URL}/api/register`, {
		method: "POST",
		body: formData,
	});
}

export async function getSession() {
	const session = cookies().get("session")?.value;
	if (!session) return null;
	return decrypt(session) as Token;
}