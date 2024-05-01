import axios from "axios";
import { TOKEN } from "./token";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	},
});

export const axiosWithToken = () =>
	axios.create({
		baseURL: BASE_URL,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
		},
	});
