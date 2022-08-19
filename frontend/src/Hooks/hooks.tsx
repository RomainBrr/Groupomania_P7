import { useEffect, useState } from "react";
import { POST } from "../Types/types";
import Cookies from "js-cookie";
// Token de session
const TOKENACTIF = Cookies.get("token");

export const useFetch = (url: string) => {
	const [datas, setDatas] = useState<POST[] | null>(null);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<null | Error>(null);

	useEffect(() => {
		const fetchDatas = async () => {
			setIsLoading(true);

			await fetch(url, {
				method: "GET",
				headers: {
					Authorization: "Bearer " + TOKENACTIF,
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
					return err;
				})
				.finally(() => setIsLoading(false));
		};

		fetchDatas();
	}, []);

	return {
		isSuccess: { isSuccess, datas },
		isError,
		isLoading,
	};
};
