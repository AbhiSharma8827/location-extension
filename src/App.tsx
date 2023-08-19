import React, { useCallback, useEffect, useState } from "react";
import countryCodes from "./util/countryCode";
import styles from "./App.module.css";

import loading from "./assets/loading.png";

type LocationType = {
	country: string;
	city: string;
};

const initialState = {
	country: "",
	city: "",
};

function App() {
	const [isError, setIsError] = useState<boolean>();
	const [userLocation, setUserLocation] = useState<LocationType>(initialState);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [fetchButtonClicked, setFetchButtonClicked] = useState<boolean>(false);

	const onClickHandler = () => {
		setFetchButtonClicked(true);
	};

	const fetchLocation = useCallback(async () => {
		setIsError(false);
		setIsLoading(true);
		try {
			const ipResponse = await fetch("https://api.ipify.org?format=json");

			if (!ipResponse.ok) {
				throw new Error("Could not fetch IP address!");
			}

			const userIpAddress = await ipResponse.json();
			console.log(
				`https://ipinfo.io/${userIpAddress.ip}?${process.env.REACT_APP_IPINFO_TOKEN}`
			);
			const userLocationResponse = await fetch(
				`https://ipinfo.io/${userIpAddress.ip}?token=${process.env.REACT_APP_IPINFO_TOKEN}`
			);

			if (!userLocationResponse.ok) {
				throw new Error("Could not fetch Country and City!");
			}
			const userLocationDetails = await userLocationResponse.json();
			console.log(userLocationDetails);
			const countryName = countryCodes.find(
				(country) => country.code === userLocationDetails.country
			);
			setUserLocation({
				country: countryName!.name,
				city: userLocationDetails.city,
			});
			setFetchButtonClicked(false);
			setIsLoading(false);
		} catch (error: any) {
			setIsError(true);
			setIsLoading(false);
			console.log(error.message);
		}
	}, []);

	useEffect(() => {
		if (fetchButtonClicked) {
			fetchLocation();
		}
	}, [fetchButtonClicked, fetchLocation]);
	return (
		<div className={styles.container}>
			{isError && <p>could not fetch the user location details!</p>}
			{!isError && userLocation.city !== "" && !isLoading && (
				<h1 className={styles.info}>
					Your country is {userLocation.country} <br /> and city is{" "}
					{userLocation.city}
				</h1>
			)}
			{isLoading && !isError && (
				<img src={loading} alt="loading" className={styles.loading} />
			)}
			<button onClick={onClickHandler} className={styles.button}>
				{isLoading ? "Loading" : "Show my location"}
			</button>
		</div>
	);
}

export default App;
