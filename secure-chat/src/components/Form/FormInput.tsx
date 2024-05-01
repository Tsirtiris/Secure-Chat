import {
	Flex,
	FormControl,
	FormControlProps,
	FormErrorMessage,
	FormLabel,
	FormLabelProps,
	Icon,
	IconButton,
	Input,
	InputProps,
} from "@chakra-ui/react";
import { FormikProps } from "formik";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

interface FormInputProps {
	name: string;
	label: string;
	type?: React.HTMLInputTypeAttribute;
	placeholder: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	formik: FormikProps<any>;
	formControlProps?: FormControlProps;
	inputProps?: InputProps;
	labelProps?: FormLabelProps;
}

export const FormInput = ({
	name,
	label,
	type,
	placeholder,
	formik,
	inputProps,
	labelProps,
	formControlProps,
}: FormInputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	const handleTogglePassword = () => {
		setShowPassword((val) => !val);
	};

	return (
		<>
			<FormControl
				bg="white"
				py="3"
				px="4"
				borderRadius={"xl"}
				boxShadow={"lg"}
				transition={"all 200ms ease-in-out"}
				{...formControlProps}
				_focusWithin={{
					boxShadow: "2xl",
				}}
				_disabled={{
					bg: "background",
					shadow: "sm",
				}}
				isDisabled={formik.isSubmitting}
				isInvalid={!!formik.touched[name] && !!formik.errors[name]}
			>
				<FormLabel mb="1" fontSize={"xs"} {...labelProps}>
					{label}
				</FormLabel>
				<Flex>
					<Input
						autoComplete={name}
						color={"gray.900"}
						flex={"1"}
						name={name}
						fontSize={"sm"}
						variant={"unstyled"}
						placeholder={placeholder}
						onChange={formik.handleChange}
						value={formik.values[name]}
						type={
							type === "password" && showPassword ? "text" : type
						}
						{...inputProps}
					/>
					{type === "password" && (
						<IconButton
							onClick={handleTogglePassword}
							size={"xs"}
							variant={"unstyled"}
							aria-label="show-icon"
							transition={"all 200ms"}
							_hover={{ color: "primary" }}
							icon={
								<Icon
									as={showPassword ? IoEye : IoEyeOff}
									fontSize={"lg"}
								/>
							}
						/>
					)}
				</Flex>
				{formik.errors[name] && (
					<FormErrorMessage fontSize={"xs"}>
						{formik.errors[name]?.toString()}
					</FormErrorMessage>
				)}
			</FormControl>
		</>
	);
};
