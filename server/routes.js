const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

const topProduction = async function(req, res) {
    connection.query(`
    SELECT P.titleId AS titleId, P.primaryTitle AS primaryTitle, P.isAdult AS isAdult,
     P.startYear AS startYear, R.averageRating AS averageRating
    FROM Production P
    JOIN Rating R
    on P.titleId = R.titleId
    JOIN ${req.params.productionType} T
    On P.titleId = T.titleId
    WHERE R.numVotes > 10000
    ORDER BY R.averageRating DESC
    LIMIT 250
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data
      );
    }
  });
}

const genre = async function(req, res) {
    connection.query(`
    SELECT G.genre AS genre
    FROM Genres G
    WHERE titleId = ${req.params.titleId}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data
      );
    }
  });
}


const top20ForGenre = async function(req, res) {
    const voteNumThresh = req.params.productionType !== 'Short' ? 10000 : 1000;
    connection.query(`
    WITH SpecificGenre AS (
        SELECT * FROM Genres
        WHERE genre = '${req.params.specificGenre}'
    )
    SELECT P.titleId AS titleId, P.primaryTitle AS primaryTitle, P.isAdult AS isAdult,
     P.startYear AS startYear, R.averageRating AS averageRating
    FROM ${req.params.productionType} T
    JOIN SpecificGenre SG
    On T.titleId = SG.titleId
    JOIN Production P
    On T.titleId = P.titleId
    JOIN Rating R
    on T.titleId = R.titleId
    WHERE R.numVotes > ${voteNumThresh}
    ORDER BY R.averageRating DESC
    LIMIT 20
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data
      );
    }
  });
}

const top20ForYear = async function(req, res) {
    const voteNumThresh = req.params.productionType !== 'Short' ? 10000 : 1000;
    connection.query(`
    SELECT P.titleId AS titleId, P.primaryTitle AS primaryTitle, P.isAdult AS isAdult,
     P.startYear AS startYear, R.averageRating AS averageRating
    FROM ${req.params.productionType} T
    JOIN Production P
    On T.titleId = P.titleId
    JOIN Rating R
    on T.titleId = R.titleId
    WHERE R.numVotes > ${voteNumThresh} AND P.startYear = ${req.params.year}
    ORDER BY R.averageRating DESC
    LIMIT 20
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data
      );
    }
  });
}





module.exports = {
  topProduction,
  genre,
  top20ForGenre,
  top20ForYear,
}
