import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

import App from './App';
import reportWebVitals from './reportWebVitals';

const link = new HttpLink({
	uri: "https://rickandmortyapi.com/graphql",
})

const client = new ApolloClient({
	link,
	cache: new InMemoryCache().restore(window.__APOLLO_STATE__ || {}),
})

render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App link={link} client={client} />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
