import { useState } from "react";

import { CREATIONUTILISATEUR } from "../Types/types";
type Props = {
	setEtat: React.Dispatch<React.SetStateAction<"Connexion" | "Inscription">>;
};

import {
	FormLabel,
	Input,
	Button,
	Flex,
	InputGroup,
	InputRightElement,
	useColorModeValue,
} from "@chakra-ui/react";

// Données à transmettre
type FormInputs = {
	email: string;
	password: string;
};

// Gestion du fomulaire
import { useForm } from "react-hook-form";

const Inscription = (Props: Props) => {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<FormInputs>();

	const { setEtat } = Props;
	const [showPassword, setShowPassword] = useState(false);

	// Gestion du thème
	const couleurDesBoutons = useColorModeValue("primaire", "secondaire");

	const onSubmit = async (datas: FormInputs) => {
		console.log(datas);

		const { email, password } = datas;
		const infosUtilisateur = new FormData();

		infosUtilisateur.append("email", email);
		infosUtilisateur.append("password", password);

		await fetch("http://localhost:4200/auth/signup", {
			method: "POST",
			body: infosUtilisateur,
		})
			.then((response) => response.json())
			.then((datas: CREATIONUTILISATEUR) => {
				console.log("DATAS", datas);

				if (datas.response === "Nouvel utilisateur créé") {
					console.log(datas.response);
					setEtat("Connexion");
				}
			})
			.catch((err) => {
				console.log(err);
				return err;
			});
	};

	function hideAndShowPassword() {
		setShowPassword((value) => !value);
	}
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormLabel
				transform="translateX(2%)"
				fontWeight="bold"
				fontSize={{ base: "xs", md: "md" }}
			>
				Email utilisateur :
			</FormLabel>
			<Input
				size="sm"
				w="100%"
				id="email"
				type="email"
				placeholder="E-mail professionnel"
				isDisabled={isSubmitting}
				required={true}
				focusBorderColor="crimson"
				{...register("email")}
			/>

			<FormLabel
				transform="translateX(2%)"
				marginTop={5}
				fontWeight="bold"
				fontSize={{ base: "xs", md: "md" }}
			>
				Mot de passe :
			</FormLabel>

			<InputGroup size="sm">
				<Input
					size="sm"
					w="100%"
					id="password"
					placeholder="Code confidentiel"
					type={showPassword ? "text" : "password"}
					isDisabled={isSubmitting}
					required={true}
					focusBorderColor="crimson"
					{...register("password")}
				/>
				<InputRightElement width="4.5rem">
					<Button h="70%" mr="10px" size="xs" onClick={hideAndShowPassword}>
						{showPassword ? "Cacher" : "Voir"}
					</Button>
				</InputRightElement>
			</InputGroup>

			<Flex justify="center">
				<Button
					marginTop={10}
					m={{ base: "60px 0 ", md: "" }}
					isDisabled={isSubmitting}
					size="sm"
					w="40%"
					type="submit"
					colorScheme="red"
					bgColor={couleurDesBoutons}
				>
					S&apos;inscrire
				</Button>
			</Flex>
		</form>
	);
};

export default Inscription;
