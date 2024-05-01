import {
	Alert,
	AlertIcon,
	AlertTitle,
	Button,
	Card,
	CardBody,
	Flex,
	HStack,
	Heading,
	Icon,
} from "@chakra-ui/react";
import { IoLockClosed, IoPersonAdd } from "react-icons/io5";
import { FormInput } from "../components/Form/FormInput";
import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { generateRandomAvatar } from "../utils/avatar";
import { AvatarInput } from "../components/Form/AvatarInput";
import { useState } from "react";
import { useRegisterMutation } from "../states/query/auth/useRegisterMutation";
import { AxiosError } from "axios";
import { ErrorResponse } from "../types/ErrorResponse";

const RegisterPage = () => {
	const [error, setError] = useState<string | undefined>(undefined);
	const registerMutation = useRegisterMutation();
	const navigate = useNavigate();
	const initialValues = {
		displayName: "",
		username: "",
		password: "",
		passwordConfirm: "",
		avatar: generateRandomAvatar(),
	};

	const schema = yup.object().shape({
		avatar: yup.string(),
		displayName: yup.string().required("Please enter your name"),
		username: yup.string().required("Please enter your username"),
		password: yup
			.string()
			.required("Please enter your password")
			.min(8, "It should be at least 8 chars."),
		passwordConfirm: yup
			.string()
			.required("Please confirm your password")
			.oneOf([yup.ref("password")], "Passwords doesn't match"),
	});

	const formik = useFormik({
		initialValues,
		validationSchema: schema,
		onSubmit: (values, actions) => {
			registerMutation.mutate(values, {
				onSettled: () => {
					actions.setSubmitting(false);
				},
				onSuccess: () => {
					setError(undefined);
					navigate("/chat");
				},
				onError: (err) => {
					if (err instanceof AxiosError) {
						const error = err.response?.data as ErrorResponse;
						if (error.type === "VALIDATION_ERROR") {
							actions.setFieldError(
								error.error.field ?? "",
								error.error.message
							);
						} else {
							setError(error.error.message);
						}
					}
				},
			});
		},
	});

	return (
		<Flex
			bg="primary"
			w="full"
			h="100vh"
			direction={"column"}
			alignItems={"center"}
			justifyContent={{ base: "flex-start", lg: "center" }}
			overflow={"auto"}
			p="2"
		>
			<Card
				boxShadow={"xl"}
				w={{ base: "95%", md: "45%", "2xl": "40%" }}
				bg="background"
				p={{ base: "3", lg: "6" }}
				borderRadius={"3xl"}
			>
				<CardBody>
					<HStack justifyContent={"center"} alignItems={"end"}>
						<Icon as={IoLockClosed} fontSize={"4xl"} />
						<Heading fontSize={"2xl"} fontWeight={"bold"}>
							SecureChat
						</Heading>
					</HStack>
					{error && (
						<Alert
							mt="8"
							status="error"
							variant={"solid"}
							borderRadius={"md"}
							size={"sm"}
						>
							<AlertIcon />
							<AlertTitle>{error}</AlertTitle>
						</Alert>
					)}

					<Flex mt={error ? "4" : "14"} direction={"column"}>
						<form
							onChange={formik.handleChange}
							onSubmit={formik.handleSubmit}
							onReset={formik.handleReset}
						>
							<Flex gap={"6"} direction={"column"}>
								<Flex alignItems={"center"} gap={"3"}>
									<AvatarInput
										value={formik.values.avatar}
										placeholder={formik.values.displayName}
										onChange={(value) =>
											formik.setFieldValue(
												"avatar",
												value
											)
										}
									/>
									<FormInput
										formik={formik}
										label="Display name"
										name="displayName"
										placeholder="Enter your name here"
										type="text"
									/>
								</Flex>
								<FormInput
									formik={formik}
									label="Username"
									name="username"
									placeholder="Enter your username here"
									type="text"
								/>
								<Flex
									gap={"6"}
									alignItems={"flex-start"}
									direction={{ base: "column", lg: "row" }}
								>
									<FormInput
										formik={formik}
										label="Password"
										name="password"
										placeholder="Enter your password here"
										type="password"
									/>
									<FormInput
										formik={formik}
										label="Confirm Password"
										name="passwordConfirm"
										placeholder="Confirm your password here"
										type="password"
									/>
								</Flex>
							</Flex>
							<Flex
								justifyContent={"space-between"}
								mt="20"
								direction={{
									base: "column-reverse",
									lg: "row",
								}}
								gap={"4"}
							>
								<Button
									as={Link}
									to="/login"
									variant={"link"}
									fontWeight={"normal"}
									colorScheme={"gray"}
								>
									Already have an account
								</Button>
								<Button
									type="submit"
									boxShadow={"xl"}
									borderRadius={"xl"}
									colorScheme={"primary"}
									size={"lg"}
									leftIcon={<Icon as={IoPersonAdd} />}
									px="5"
									isLoading={formik.isSubmitting}
								>
									Create account
								</Button>
							</Flex>
						</form>
					</Flex>
				</CardBody>
			</Card>
		</Flex>
	);
};
export default RegisterPage;
