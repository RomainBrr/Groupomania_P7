import { createContext } from "react";

type ContextConnexion = {
	estConnecte: {
		connexion: boolean;
		token: string | null;
		userId: string | number | null;
		username: string | null;
		isAdmin: boolean | null;
	};
	setEstConnecte: React.Dispatch<any>;
};

const etatDeConnexion: ContextConnexion = {
	estConnecte: {
		connexion: false,
		token: null,
		userId: null,
		username: null,
		isAdmin: null,
	},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setEstConnecte: () => {},
};

export const AuthContext = createContext(etatDeConnexion);
