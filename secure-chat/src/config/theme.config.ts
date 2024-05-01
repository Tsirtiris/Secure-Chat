import { extendTheme } from "@chakra-ui/react";

const config = {
	fonts: {
		body: `poppins, sans-serif`,
		heading: `poppins, sans-serif`,
	},
	colors: {
		black: "#262626",
		background: "#EBEDF2",
		subtitle: "#415058",
		primary: {
			50: "#e6f0ff",
			100: "#bfd1f5",
			200: "#97b3e8",
			300: "#6f94dc",
			400: "#4876d1",
			500: "#2e5cb7",
			600: "#224890",
			700: "#173368",
			800: "#091f41",
			900: "#000a1c",
		},
		secondary: {
			50: "#fff1de",
			100: "#f6d6b9",
			200: "#edbc91",
			300: "#e4a267",
			400: "#db873d",
			500: "#c26e24",
			600: "#98551b",
			700: "#6d3c11",
			800: "#432406",
			900: "#1d0900",
		},
		accent: {
			50: "#fff5dd",
			100: "#fbe4b4",
			200: "#f6d787",
			300: "#f3cd59",
			400: "#efb12c",
			500: "#d68b14",
			600: "#a6610c",
			700: "#773e06",
			800: "#481f00",
			900: "#1b0700",
		},
		success: {
			50: "#eefde0",
			100: "#d7f5ba",
			200: "#bfec90",
			300: "#a5e466",
			400: "#8ddd3c",
			500: "#73c322",
			600: "#599819",
			700: "#3f6d0f",
			800: "#244205",
			900: "#081700",
		},
	},
	semanticTokens: {
		colors: {
			primary: {
				default: "primary.500",
				// _hover: "primary.900",
			},
		},
	},
};

const theme = extendTheme({ ...config });

export default theme;
