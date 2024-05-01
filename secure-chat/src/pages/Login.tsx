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
import { IoLockClosed, IoLockOpen } from "react-icons/io5";
import { FormInput } from "../components/Form/FormInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../states/query/auth/useLoginMutation";
import { AxiosError } from "axios";
import { ErrorResponse } from "../types/ErrorResponse";
import { useState } from "react";

const LoginPage = () => {
	const [error, setError] = useState<string | undefined>(undefined);
	const loginMutation = useLoginMutation();
	const navigate = useNavigate();
	const initialValues = {
		username: "",
		password: "",
	};

	const schema = yup.object().shape({
		username: yup.string().required("Please enter your username"),
		password: yup
			.string()
			.required("Please enter your password")
			.min(8, "It should be at least 8 chars."),
	});

	const formik = useFormik({
		initialValues,
		validationSchema: schema,
		onSubmit: (values, actions) => {
			loginMutation.mutate(values, {
				onSettled: () => {
					actions.setSubmitting(false);
				},
				onSuccess: () => {
					setError(undefined);
					navigate("/");
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
			justifyContent={"center"}
		>
			<Card
				boxShadow={"xl"}
				w={{ base: "90%", md: "40%", xl: "35%", "2xl": "30%" }}
				bg="background"
				p="6"
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
								<FormInput
									formik={formik}
									label="Username"
									name="username"
									placeholder="Enter your username here"
									type="text"
								/>
								<FormInput
									formik={formik}
									label="Password"
									name="password"
									placeholder="Enter your password here"
									type="password"
								/>
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
									to="/register"
									variant={"link"}
									fontWeight={"normal"}
									colorScheme={"gray"}
								>
									Create a new account
								</Button>
								<Button
									type="submit"
									boxShadow={"xl"}
									borderRadius={"xl"}
									colorScheme={"primary"}
									size={"lg"}
									leftIcon={<Icon as={IoLockOpen} />}
									px="10"
									isLoading={formik.isSubmitting}
								>
									Login
								</Button>
							</Flex>
						</form>
					</Flex>
				</CardBody>
			</Card>
		</Flex>
	);
};

export default LoginPage;
