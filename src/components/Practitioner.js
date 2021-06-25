import React, { useState, useEffect } from 'react';
import { getPractitioners } from "../services";

const imageWrapperStyle = {
	textAlign: 'center'
}

const Practitioner = () => {

	// Initial States
	const [practitioners, setPractitioners] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// UseEffect to call API and get practitioner List
	useEffect(() => {
		(
			async () => {
				await getPractitioners().then((res) => {
					setPractitioners(flattenPractitionerObj(res));
					setIsLoading(false)
				});
			}
		)()

	}, []);

	const flattenPractitionerObj = (response) => {
		return (response.data.entry || []).map((item) => {
			const name = item.resource.name || [];
			return {
				id: item.resource.id,
				name: `${((name[0] || {}).given || []).join(" ")} ${(name[0] || {}).family || 'N/A'
					}`,
				gender: item.resource.gender || 'N/A',
				dob: item.resource.birthDate || 'N/A',
				photo:
					"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
			};
		});
	};

	// Format the date
	const dateFormatter = (date) => {

		const newDate = new Date(date);

		if (newDate !== 'Invalid Date') {
			const day = newDate.getDate().toString().padStart(2, '0')
			const month = newDate.getMonth().toString().padStart(2, '0')
			const year = newDate.getFullYear()

			return `${year}/${month}/${day}`
		} else {
			return 'N/A'
		}
	}

	// Delete Practitioner and update the state object
	const handleDelete = (id) => {
		if (window.confirm('Do you really want to delete this practitioner?')) {
			const newPractitionerList = practitioners.filter((practitioner) => practitioner.id !== id);
			setPractitioners(newPractitionerList);
		}

	}

	return (
		<div className="practitioner-wrapper">
			<h2>Practitioner</h2>
			{
				!isLoading && practitioners.length > 0 ?
					<div className="cardsContainerStyle">
						{
							practitioners.map((practitioner) => {
								return (
									<div key={practitioner.id} className='cardStyle'>
										<div style={imageWrapperStyle}>
											<img
												src={practitioner.photo}
												alt="Avatar"
												style={{ height: 100, width: 100, borderRadius: "50%" }}
											/>
										</div>
										<div>
											<p>{practitioner.name}</p>
											<p>{practitioner.gender}</p>
											<p>{dateFormatter(practitioner.dob)}</p>
										</div>
										<button type="button" onClick={() => handleDelete(practitioner.id)}>
											Delete
										</button>
									</div>
								)
							})
						}
					</div>
					: <h2>Loading...</h2>
			}
		</div>
	)
}

export default Practitioner