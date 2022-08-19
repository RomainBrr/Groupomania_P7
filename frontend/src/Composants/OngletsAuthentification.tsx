import { Box, Button, useColorModeValue } from "@chakra-ui/react";

type Props = {
	nomOnglet: "Connexion" | "Inscription";
	etat: "Connexion" | "Inscription";
	setEtat: React.Dispatch<React.SetStateAction<"Connexion" | "Inscription">>;
};

const OngletsAuthentification = (Props: Props) => {
	const { nomOnglet, etat, setEtat } = Props;

	// Gestion du thème
	const couleurBordureBas = useColorModeValue("elements.bleu", "whitesmoke");
	const couleurDuTexte = useColorModeValue("textes.white", "textes.sombre");

	function changerOnglet() {
		setEtat(nomOnglet);
	}

	return (
		<Box w="100%">
			{etat === nomOnglet ? (
				<Button
					w="100%"
					h={10}
					fontSize={{ base: "sm", md: "lg" }}
					transition="ease-in 0.2s "
					colorScheme="red"
					borderBottom={{ base: "4px solid", md: "5px solid" }}
					borderBottomColor={{
						base: couleurBordureBas,
						md: couleurBordureBas,
					}}
					color={couleurDuTexte}
					shadow="md"
					fontWeight="bold"
					onClick={() => setEtat(nomOnglet)}
				>
					{nomOnglet}
				</Button>
			) : (
				<Button
					w="100%"
					h={9}
					fontSize={{ base: "xs", md: "md" }}
					transform="scale(0.99)"
					size="sm"
					opacity={0.7}
					shadow="xs"
					onClick={changerOnglet}
				>
					{nomOnglet}
				</Button>
			)}
		</Box>
	);
};
export default OngletsAuthentification;
