import { extendTheme, type ThemeConfig } from "@chakra-ui/react";


const config: ThemeConfig = {
	initialColorMode: "light",
	useSystemColorMode: false,
};


const theme = extendTheme({
	styles: {
		global: {
			"html, body": {
				fontFamily: "Lato, sans-serif",
			},
		},
	},
	colors: {
		textes: {
			sombre: "#4E5166",
			white: "whitesmoke",
		},
		elements: {
			rouge: "#FD2D01",
			rose: "#FFD7D7",
			bleu: "#4E5166",
		},
		fond: {
			light: "white",
			dark: "rgb(20, 24, 48)",
			elements: "rgb(20, 24, 33)",
		},
		primaire: "#FD2D01",
		secondaire: "#FFD7D7",
		tertiaire: "#4E5166",
		neutre: "whitesmoke",
	},
	config,
});

export default theme;
