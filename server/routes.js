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
};

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
};


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
};

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
};


/*********************
 * PRODUCT INFO PAGE *
 *********************/

const production = async function(req, res) {
    connection.query(`
    SELECT P.primaryTitle, P.isAdult, P.startYear, P.runtimeMinutes, P.averageRating, G.genre,
    PS.prinamryName AS personName, PC.category AS role
    FROM Production P
    JOIN Genres G ON P.titleId = G.titleId
    JOIN Principal PC ON P.titleId = PC.titleId
    JOIN Person PS on PC.personId = PS.personId
    WHERE P.titleId = ${req.params.titleId}
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
};


/**************************
 * PRODUCTION SEARCH PAGE *
 **************************/

const search_productions = async function(req, res) {
  const primaryTitle = req.query.primaryTitle ?? '';
  const isAdult = req.query.isAdult === 'true' ? 1 : 0;
  const startYearLow = req.query.startYearLow ?? 0;
  const startYearHigh = req.query.startYearHigh ?? 2050;
  const runtimeMinutesLow = req.query.runtimeMinutesLow ?? 0;
  const runtimeMinutesHigh = req.query.runtimeMinutesHigh ?? 55000;

  const genre = req.query.genre;
  const genreQuery = (genre === 'All' || (!genre)) ? '' : ` AND genre = '${genre}'`;

  const averageRatingLow = req.query.averageRatingLow ?? 0.0;
  const averageRatingHigh = req.query.averageRatingHigh ?? 10.0;
  const numVotesLow = req.query.numVotesLow ?? 0;
  const numVotesHigh = req.query.numVotesHigh ?? 3000000;

  connection.query(`
    SELECT p.titleId, primaryTitle, startYear, runtimeMinutes, averageRating
    FROM ${req.params.type} t JOIN Production p ON t.titleId = p.titleId JOIN Genres g ON t.titleId = g.titleId
      JOIN Rating r ON t.titleId = r.titleId
    WHERE primaryTitle LIKE '%${primaryTitle}%' AND isAdult = ${isAdult} AND startYear >= ${startYearLow} AND startYear <= ${startYearHigh}
      AND runtimeMinutes >= ${runtimeMinutesLow} AND runtimeMinutes <= ${runtimeMinutesHigh} AND averageRating >= ${averageRatingLow}
      AND averageRating <= ${averageRatingHigh} AND numVotes >= ${numVotesLow} AND numVotes <= ${numVotesHigh}${genreQuery}
    GROUP BY titleId, primaryTitle
    ORDER BY primaryTitle
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};


/**********************
 * PERSON SEARCH PAGE *
 **********************/

const search_people = async function(req, res) {
  const primaryName = req.query.primaryName ?? '';
  const birthYearLow = req.query.birthYearLow ?? 0;
  const birthYearHigh = req.query.birthYearHigh ?? 2023;
  const deathYearLow = req.query.deathYearLow ?? 0;
  const deathYearHigh = req.query.deathYearHigh ?? 2023;

  const profession = req.query.profession;
  const professionQuery = (profession === 'All' || (!profession)) ? '' : ` AND profession = '${profession}'`;

  connection.query(`
    SELECT p.*, GROUP_CONCAT(profession SEPARATOR ', ') AS professions
    FROM Person p JOIN PrimaryProfessions pp ON p.personId = pp.personId
    WHERE p.personId IN (SELECT p.personId
                         FROM Person p JOIN PrimaryProfessions pp ON p.personId = pp.personId
                         WHERE primaryName LIKE '%${primaryName}%' AND birthYear >= ${birthYearLow} AND birthYear <= ${birthYearHigh}
                             AND deathYear >= ${deathYearLow} AND deathYear <= ${deathYearHigh}${professionQuery})
    GROUP BY p.personId, primaryName
    ORDER BY primaryName;
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};


module.exports = {
  topProduction,
  genre,
  top20ForGenre,
  top20ForYear,
  production,
  search_productions,
  search_people
};
