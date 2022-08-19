// Type pour la connexion et l'inscription
export type CONNEXIONUTILISATEUR = {
	userId: number;
	token: string;
	username: string;
	is_admin: string;
};

export type CREATIONUTILISATEUR = {
	response: string;
	newUser?: any;
};

// Type pour les posts
export type POST = {
	owner_name: string;
	post_id: number;
	title: string;
	content: string;
	likes: number;
	usersIds_likes: string;
	createdAt: Date;
	image_url?: string;
	is_image: boolean;
	owner_id: number;
	updatedAt: Date;
};

//  Type pour l''état de connexion
export type ETAT_DE_CONNEXION = {
	connexion: boolean;
	token: string | null;
	userId: string | number | null;
	username: string | null;
	isAdmin: boolean | null;
};
