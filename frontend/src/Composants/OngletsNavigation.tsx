// composants css
import { Box, Button, useColorMode, useColorModeValue } from "@chakra-ui/react";

type Props = {
	nomOnglet: "Accueil" | "Mes Posts" | "Likes" | null;
	etat: "Accueil" | "Mes Posts" | "Likes" | null;
	setEtat: React.Dispatch<
		React.SetStateAction<"Accueil" | "Mes Posts" | "Likes" | null>
	>;
};

const OngletsNavigation = (Props: Props) => {
	const { nomOnglet, etat, setEtat } = Props;

	const { colorMode } = useColorMode();
	const color = useColorModeValue("primaire", "secondaire");

	return (
		<Box w="100%">
			{etat === nomOnglet ? (
				<Button
					w="100%"
					h={{ base: "8", md: "9" }}
					fontSize={{ base: "xs", md: "lg" }}
					fontWeight="bold"
					bgSize="sm"
					transition="ease-in 0.2s "
					colorScheme="red"
					bgColor={color}
					borderBottom="5px solid"
					size="sm"
					borderBottomColor={
						colorMode === "light" ? "elements.bleu" : "whitesmoke"
					}
					color={colorMode === "light" ? "textes.white" : "textes.sombre"}
					onClick={() => setEtat(nomOnglet)}
				>
					{nomOnglet}
				</Button>
			) : (
				<Button
					w="100%"
					h={{ base: "7", md: "8" }}
					fontSize={{ base: "xs", md: "md" }}
					transform="scale(0.99)"
					size="sm"
					opacity={0.7}
					shadow="md"
					fontWeight="bold"
					onClick={() => setEtat(nomOnglet)}
				>
					{nomOnglet}
				</Button>
			)}
		</Box>
	);
};
export default OngletsNavigation;
