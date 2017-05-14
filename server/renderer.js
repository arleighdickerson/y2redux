require('babel-register')()
require('ignore-styles').default([
    'gif',
    'jpg',
    'eot',
    'woff',
    'ttf',
    'eot',
    'scss',
    'sass',
    'css',
    'less',
    'woff2'
  ].map(ext => '.' + ext)
)


const config = require('../config')
Object.assign(global, config.globals)

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ReactRouter = require('react-router')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const AppContainer = require('../src/containers/AppContainer').default
const createStore = require('../src/store/createStore').default
const createRoutes = require('../src/routes/index').default

app.use(bodyParser.json());
app.use('/', function (req, res) {
  try {
    const initialState = req.body.initialState
    const userAgent = req.body.userAgent
    const history = ReactRouter.createMemoryHistory(initialState.routing.location.pathname)
    const store = createStore(history, initialState)
    const routes = createRoutes(store)
    res.status(200).send(
      ReactDOMServer.renderToString(
        React.createElement(AppContainer, {store, routes, userAgent, history})
      )
    )
  } catch (err) {
    console.error(err)
    console.error(err.stack)
    res.status(500).send(err.message + "\nSTACK [[[\n" + err.stack + "\n]]]\n");
  }
});

app.listen(config.renderer_port);
