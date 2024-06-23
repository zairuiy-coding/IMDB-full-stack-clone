const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const db = require('./db'); // Import the database connection

const app = express();
app.use(cors({
  origin: '*',
}));

// a test route to ensure the database connection is working
app.get('/', (req, res) => {
    res.send('Hello, this is the root path!');
  });

// Example route to test database connection
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send(`Database query failed: ${err.message}`);
        return;
      }
      res.send(`The solution is: ${results[0].solution}`);
    });
  });

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/random', routes.random);
app.get('/topProduction/:productionType', routes.topProduction);
app.get('/genre/:titleId', routes.genre);
app.get('/top20ForGenre/:specificGenre/:productionType', routes.top20ForGenre);
app.get('/top20ForYear/:year/:productionType', routes.top20ForYear);
app.get('/productionInfo/:titleId', routes.production);
app.get('/search_productions/:type', routes.search_productions);
app.get('/search_people', routes.search_people);
app.get('/personInfo/:personId', routes.person);
app.get('/similarProductions/:titleId/:productionType/:thisYear', routes.similarProductions);

app.listen(config.server_port, config.server_host, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
  });
  

module.exports = app;
