import { getApiURL } from "@/lib/utils";

async function getAllUsers() {
	const response = await fetch(getApiURL("/api/users"));
	const data = await response.json();
	return data;
}

async function getProfessorUsers() {
	const response = await fetch(getApiURL("/api/users?role=USER"));
	const data = await response.json();
	return data;
}

export { getAllUsers, getProfessorUsers };
