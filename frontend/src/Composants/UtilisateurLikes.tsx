import { useState, useLayoutEffect } from "react";

import { POST } from "../Types/types";
type Props = {
	posts: POST[] | null;
	userId: string | number | null;
	refresh: React.Dispatch<React.SetStateAction<number>>;
	etat: "Accueil" | "Mes Posts" | "Likes" | null;
	isAdmin: boolean | null;
};


import { Box } from "@chakra-ui/react";
import Post from "./Post";

export const UtilisateurPosts = (Props: Props) => {
	const { posts, userId, etat, refresh, isAdmin } = Props;
	const [mesPosts, setMesPosts] = useState<POST[]>([]);

	useLayoutEffect(() => {
		const nouveauTableau: POST[] = [];

		if (posts) {
			for (const Post of posts) {
				const likesDuPost = JSON.parse(Post.usersIds_likes);
				const aLike = likesDuPost.find((id: number) => id === userId);

				aLike && nouveauTableau.push(Post);
			}
		}

		setMesPosts(nouveauTableau);
	}, [posts, etat]);

	return (
		<Box>
			{mesPosts &&
				mesPosts.map((post) => {
					return (
						<Post
							key={post.post_id}
							post={post}
							userId={userId}
							refresh={refresh}
							isAdmin={isAdmin}
						/>
					);
				})}
		</Box>
	);
};
export default UtilisateurPosts;
