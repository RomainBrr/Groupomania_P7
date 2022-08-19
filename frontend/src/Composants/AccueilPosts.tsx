import { POST } from "../Types/types";
type Props = {
	posts: POST[] | null;
	userId: string | number | null;
	refresh: React.Dispatch<React.SetStateAction<number>>;
	isAdmin: boolean | null;
};

import { Box, Text } from "@chakra-ui/react";
import Post from "./Post";

const AccueilPosts = (Props: Props) => {
	const { posts, userId, refresh, isAdmin } = Props;

	return (
		<Box>
			{posts && posts?.length < 1 ? (
				<Text textAlign="center" p={10}>
					Aucune publication pour l&apos;instant 😴{" "}
				</Text>
			) : (
				posts?.map((post) => {
					return (
						<Post
							key={post.post_id}
							isAdmin={isAdmin}
							userId={userId}
							refresh={refresh}
							post={post}
						/>
					);
				})
			)}
		</Box>
	);
};
export default AccueilPosts;
