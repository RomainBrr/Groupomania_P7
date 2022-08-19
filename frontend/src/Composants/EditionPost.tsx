import { useState, useEffect, useRef } from "react";


import {
	Button,
	Box,
	Input,
	FormLabel,
	Stack,
	Image,
	useColorMode,
	InputGroup,
	Flex,
	Textarea,
	Heading,
	useColorModeValue,
	InputLeftElement,
} from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
	faArrowLeft,
	faCircleXmark,
	faFileCircleCheck,
	faFileCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

// Types
import { POST } from "../Types/types";

// Navigation
import {
	useParams,
	Link,
	useNavigate,
	NavigateFunction,
} from "react-router-dom";

// Gestion du formulaire
import { useForm, Controller, SubmitHandler } from "react-hook-form";

// Import du hook de requête 
import { useFetch } from "../Hooks/hooks";

// Notifications
import {
	activeNotif,
	creerPost,
	modifierPost,
	supprimerLaPhoto,
} from "../Fonctions/Fonctions";

const EditionPost = () => {
	// Utilisation des paramètres de recherche
	const { id } = useParams();

	// Navigation
	const navigate = useNavigate();

	// Etats
	const [post, setPost] = useState<POST | null | "nouveaupost">(null);
	const [imageAttendue, setImageAttendue] = useState<string | null>(null);
	const [showImage, setShowImage] = useState<boolean>(true);

	// Récupération de l'image
	const imageRef = useRef<HTMLInputElement | null>(null);

	// Gestion du thème
	const { colorMode } = useColorMode();
	const buttonColor = useColorModeValue("primaire", "secondaire");
	const notifColor = useColorModeValue("#4E5166", "#FFD7D7");
	const couleurDuTexte = useColorModeValue("textes.sombre", "textes.white");

	// Si l'id des paramètres n'est pas égal à "nouveaupost"
	if (id !== "nouveaupost") {
		const { isSuccess } = useFetch("http://localhost:4200/posts");

		useEffect(() => {
			if (
				isSuccess.datas &&
				id !== undefined &&
				typeof Number(id) === "number"
			) {
				const { datas } = isSuccess;
				for (const Post of datas) {
					Post.post_id === Number(id) && setPost(Post);
				}
			}
		}, [isSuccess]);
	} else
		useEffect(() => {
			setPost(id);
		}, [post]);

	// Validation du formulaire
	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = useForm<POST>();

	const onSubmit: SubmitHandler<POST> = async (data: POST) => {
		const imageDuPost = imageAttendue ? imageRef.current : null;

		if (id) {
			if (id !== "nouveaupost") {
				const confirmation = await modifierPost(data, id, imageDuPost);

				confirmationOperation(
					confirmation,
					"Le post à été modifié !",
					navigate,
					notifColor
				);
			} else {
				const confirmation = await creerPost(data, imageDuPost);
				confirmationOperation(
					confirmation,
					"Nouveau post créé !",
					navigate,
					notifColor
				);
			}
		}
	};

	return (
		<Box
			bgColor={colorMode === "light" ? "#fdfdfd" : "fond.dark"}
			w={{ base: "90%", md: "95%" }}
			color={couleurDuTexte}
			borderRadius={{ base: "xl", md: "3xl" }}
			shadow="xs"
			p={{ base: 3, md: 10 }}
		>
			<Stack spacing={5}>
				<Flex w="100%" align="center" mb={5}>
					<Link to={"/"}>
						<Button
							colorScheme="red"
							color={buttonColor}
							variant="outline"
							isDisabled={isSubmitting}
							size={{ base: "xs", md: "md" }}
						>
							<FontAwesomeIcon icon={faArrowLeft} />
						</Button>
					</Link>
					<Heading
						as="h1"
						fontSize={{ base: "xl", md: "2xl" }}
						fontWeight="bold"
						m="0 auto"
					>
						{id !== "nouveaupost" ? "Edition de post" : "Nouveau post"}
					</Heading>
				</Flex>

				{post && (
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack spacing={10}>
							<Stack spacing={0}>
								<FormLabel
									fontSize={{ base: "sm", md: "md" }}
									fontWeight="bold"
								>
									Titre
								</FormLabel>
								<Controller
									name="title"
									control={control}
									defaultValue={
										post !== "nouveaupost" ? post?.title : ""
									}
									render={({ field }) => (
										<Input
											type="text"
											size={{ base: "sm", md: "md" }}
											w={{ base: "80%", md: "xs" }}
											fontSize={{ base: "xs", md: "sm" }}
											required={true}
											isDisabled={isSubmitting}
											{...field}
										/>
									)}
								/>
							</Stack>

							<Stack spacing={0}>
								<FormLabel
									fontSize={{ base: "sm", md: "md" }}
									fontWeight="bold"
								>
									Contenu
								</FormLabel>
								<Flex
									flexDir={{ base: "column", md: "row" }}
									align="center"
								>
									<Controller
										name="content"
										control={control}
										defaultValue={
											post !== "nouveaupost" ? post?.content : ""
										}
										render={({ field }) => (
											<Textarea
												flex={{ md: 3 }}
												mr={{ base: 0, md: 2 }}
												fontSize={{ base: "xs", md: "sm" }}
												w={{ base: "100%", md: "2xl" }}
												h={{ base: "200px", md: "xs" }}
												required={true}
												isDisabled={isSubmitting}
												{...field}
											/>
										)}
									/>
									{post !== "nouveaupost" &&
										post.is_image === true &&
										showImage && (
											<Flex
												flexDir="column"
												align="center"
												justify={{
													base: "flex-start",
													md: "center",
												}}
												flex={{ md: 1 }}
												h={{ base: "100%", md: "md" }}
												w="100%"
												mt={{ base: "5", md: "0" }}
											>
												<Image
													w="80%"
													shadow={{ base: "sm", md: "none" }}
													p={{ base: 5, md: "0" }}
													objectFit="contain"
													src={post.image_url}
													alt={`${post.title}`}
												/>
												<Button
													colorScheme="red"
													color={buttonColor}
													variant="outline"
													size="xs"
													mt={{ base: 2, md: 5 }}
													w="50%"
													isDisabled={isSubmitting}
													onClick={async () => {
														const suppression =
															await supprimerLaPhoto(post);
														suppression && setShowImage(false);
														activeNotif(
															"La photo à bien été supprimée",
															true,
															notifColor
														);
													}}
												>
													Supprimer l&apos;image
												</Button>
											</Flex>
										)}
								</Flex>
							</Stack>

							<Stack spacing={0}>
								<FormLabel
									fontSize={{ base: "sm", md: "md" }}
									fontWeight="bold"
								>
									Image
								</FormLabel>
								<InputGroup
									size={{ base: "sm", md: "md" }}
									flexShrink={1}
									flexWrap="wrap"
								>
									<InputLeftElement top={1}>
										<FontAwesomeIcon
											icon={
												!imageAttendue
													? faFileCircleXmark
													: faFileCircleCheck
											}
											color={!imageAttendue ? "red" : "green"}
										/>
										{imageAttendue && (
											<Button
												size="xs"
												onClick={() => {
													setImageAttendue(null);
												}}
											>
												<FontAwesomeIcon
													icon={faCircleXmark}
													color="black"
												/>
											</Button>
										)}
									</InputLeftElement>
									<Input
										ml={10}
										type="file"
										accept=".jpg, .jpeg, .png"
										name="image"
										id="image"
										ref={imageRef}
										border="none"
										isDisabled={isSubmitting}
										onChange={(e) => {
											setImageAttendue(e.target.value);
										}}
									/>
								</InputGroup>
							</Stack>
						</Stack>

						<Flex justify="center" m={10} mt={{ base: 10, md: "100px" }}>
							<Button
								type="submit"
								colorScheme="red"
								bgColor={buttonColor}
								w="xs"
								size={{ base: "xs", md: "md" }}
								isLoading={isSubmitting}
								loadingText={
									id === "nouveaupost"
										? "Création ..."
										: "Modifications ..."
								}
							>
								{id === "nouveaupost" ? "Publier" : "Modifier"}
							</Button>
						</Flex>
					</form>
				)}
			</Stack>
		</Box>
	);
};
export default EditionPost;


function confirmationOperation(
	operation: boolean,
	message: string,
	navigate: NavigateFunction,
	notyfColor: string
) {
	if (operation) {
		navigate("/");
		activeNotif(message, true, notyfColor);
	} else activeNotif("Un problème est survenue", false, notyfColor);
}
