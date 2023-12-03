const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/topProduction/:productionType', routes.topProduction);
app.get('/genre/:titleId', routes.genre);
app.get('/top20ForGenre/:specificGenre/:productionType', routes.top20ForGenre);
app.get('/top20ForYear/:year/:productionType', routes.top20ForYear);
app.get('/productionInfo/:titleId', routes.production);
app.get('/search_productions/:type', routes.search_productions);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
