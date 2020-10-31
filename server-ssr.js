import React from 'react'
import express from 'express'
import fs from 'fs'

import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { getDataFromTree } from '@apollo/react-ssr'

import fetch from 'node-fetch'
import AppComponent from './src/App.js'

const app = express()

app.use('/static', express.static('./build/static'))

const index = fs.readFileSync('./build/index.html').toString()

const Html = ({ content, state }) => <>
      <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
      <script dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
      }} />
    </>

const cache = new InMemoryCache({ resultCaching: false });
  const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://rickandmortyapi.com/graphql",
      fetch,
    }),
    cache,
    //  fetch,
  })

app.use("/", async (req, res) => {
  
  const App = (
    <ApolloProvider client={client}>
      <AppComponent />
    </ApolloProvider>
  )

  await getDataFromTree(App)

  const content = renderToString(App)
  const initialState = client.extract()

  const renderData = renderToStaticMarkup(<Html content={content} state={initialState} />)

  const ret = index.replace('<noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div>', renderData)

  res.status(200).end(ret)
});

app.listen(4010 , () => console.log(
  `React SSR server is now running on http://localhost:4010`
))
