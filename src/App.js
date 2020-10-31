import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import './index.css';

const query = gql`
  query ($gender: String) {
	characters(page:0, filter:{status:"Alive", species:"Alien", gender: $gender}) {
		info {
			count
		}
		results {
			id
			name
			species
			type
			image
			location {
				name
			}
			episode {
				name
			}
		}
    }
  }
`;

const App = () => {
	const [gender, setGender] = useState('Male')
	
	const { loading, data } = useQuery(query, { variables: { gender } });

	const changeGender = () => {
		setGender(gender === 'Male' ? 'Female' : 'Male')
	}

	console.log(' - gender ->', gender)

	if (loading || !data) return <p>Loading: <b>Yes</b></p>
	const c = data.characters

	return (
		<>
			<div className="cards">
				<p>Total characters found: <b>{c.info.count}</b></p>
				&nbsp;
				<button onClick={changeGender}>{gender}</button>
			</div>

			<div className="cards">
				{c.results.map(i =>
					<article key={i.id} className="card">
						<img src={i.image} alt={i.name} />
						<div className="text">
							<h4>{i.name}</h4>
							<p>#{i.id} [{i.species}] {i.type}</p>
							<p className="loc-epi">
								Location: <span>{i.location.name}</span><br />
								Episode: <span>{i.episode[0].name}</span>
							</p>
						</div>
					</article>
				)}
			</div>
			
			
		</>
	)
}

export default App