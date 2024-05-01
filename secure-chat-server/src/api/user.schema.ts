import * as yup from "yup";
const userSchema = yup.object().shape({
	avatar: yup.string().required(),
	displayName: yup.string().required("Display Name missing"),
	username: yup.string().required("Username missing"),
	password: yup
		.string()
		.required("Password missing.")
		.min(8, "Password should be at least 8 chars."),
});

const loginSchema = yup.object().shape({
	username: yup.string().required("Username missing"),
	password: yup
		.string()
		.required("Password missing.")
		.min(8, "Password should be at least 8 chars."),
});

export { userSchema, loginSchema };
