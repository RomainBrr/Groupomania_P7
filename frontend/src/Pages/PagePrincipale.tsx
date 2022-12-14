import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";


import { POST } from "../Types/types";


import { Box, Text, Flex, useColorMode } from "@chakra-ui/react";


import AccueilPosts from "../Composants/AccueilPosts";
import OngletsNavigation from "../Composants/OngletsNavigation";
import UtilisateurPosts from "../Composants/UtilisateurPosts";
import UtilisateurLikes from "../Composants/UtilisateurLikes";

const PagePrincipale = () => {
	const { estConnecte } = useContext(AuthContext);

	const [refresh, setRefresh] = useState<number>(0);

	const [datas, setDatas] = useState<POST[] | null>(null);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<null | Error>(null);

	const [ongletAffichÃ©, setOngletAffichÃ©] = useState<
		"Accueil" | "Mes Posts" | "Likes" | null
	>("Accueil");

	useEffect(() => {
		const fetchDatas = async () => {
			setIsLoading(true);

			await fetch("http://localhost:4200/posts", {
				method: "GET",
				headers: {
					Authorization: "Bearer " + estConnecte.token,
				},
			})
				.then(async (response) => {
					const resultat = await response.json();
					if (!response.ok) {
						throw new Error(resultat.message);
					}

					return resultat;
				})
				.then((datas) => {
					setDatas(() => datas);
					datas && setIsSuccess(true);
				})
				.catch((err) => {
					setIsError(err);
				})
				.finally(() => setIsLoading(false));
		};

		setTimeout(fetchDatas, 1000);
	}, [refresh, isSuccess]);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, [ongletAffichÃ©]);

	if (refresh === 0 && isLoading) {
		return <Text>En cours de chargement ..</Text>;
	}

	const { colorMode } = useColorMode();

	return (
		<Flex
			align="center"
			flexDirection="column"
			w="100%"
			h="100%"
			minHeight="100vh"
		>
			<Box
				pos="relative"
				w={{ base: "90%", md: "95%" }}
				h="95%"
				margin="0 auto 50px"
				background="white"
				borderRadius="3xl"
				overflow="hidden"
				shadow="base"
				bgColor={colorMode === "light" ? "#fdfdfd" : "tertiaire"}
			>
				<Flex>
					<OngletsNavigation
						nomOnglet="Accueil"
						etat={ongletAffichÃ©}
						setEtat={setOngletAffichÃ©}
					/>
					<OngletsNavigation
						nomOnglet="Mes Posts"
						etat={ongletAffichÃ©}
						setEtat={setOngletAffichÃ©}
					/>
					<OngletsNavigation
						nomOnglet="Likes"
						etat={ongletAffichÃ©}
						setEtat={setOngletAffichÃ©}
					/>
				</Flex>

				{isSuccess && ongletAffichÃ© === "Accueil" && (
					<Box>
						{datas ? (
							<AccueilPosts
								posts={datas}
								refresh={setRefresh}
								userId={estConnecte.userId}
								isAdmin={estConnecte.isAdmin}
							/>
						) : (
							isError && <p>{isError.message}</p>
						)}
					</Box>
				)}

				{ongletAffichÃ© === "Mes Posts" && (
					<UtilisateurPosts
						posts={datas}
						refresh={setRefresh}
						userId={estConnecte.userId}
						etat={ongletAffichÃ©}
						isAdmin={estConnecte.isAdmin}
					/>
				)}
				{ongletAffichÃ© === "Likes" && (
					<UtilisateurLikes
						posts={datas}
						refresh={setRefresh}
						userId={estConnecte.userId}
						etat={ongletAffichÃ©}
						isAdmin={estConnecte.isAdmin}
					/>
				)}
			</Box>
		</Flex>
	);
};
export default PagePrincipale;
