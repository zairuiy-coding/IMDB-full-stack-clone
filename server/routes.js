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


/****************
 * RANDOM ROUTE *
 ****************/

// Returns a random production
const random = async function(req, res) { //isAdult is boolean in original data
  const isAdult = req.query.isAdult === true ? 1 : 0;
  connection.query(`
    SELECT *
    FROM Production
    WHERE isAdult <= ${isAdult}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        titleId: data[0].titleId, primaryTitle: data[0].primaryTitle
      });
    }
  });
};


/************************
 * TOP PRODUCTION PAGE  *
 ************************/

//  Return the top 250 productions for each production type(movie, short and tvSeries).
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

// Return applicable genres for a specific production based on titleId.
const genre = async function(req, res) {
    connection.query(`
    SELECT G.genre AS genre
    FROM Genres G
    WHERE titleId = ?
  `, 
    [req.params.titleId],
    (err, data) => {
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

//  Return the top 20 productions for each different genre, e.g. comedy, animation and documentary for each production type(movie, short and tvSeries)
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

// Return the top 20 productions in each year for each production type(movie, short and tvSeries).
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

// optimized and simplified after creating the table ProductionInfoView to cache join result
const production = async function(req, res) {
    connection.query(`
    SELECT * FROM ProductionInfoView WHERE titleId = ?
  `, 
  [req.params.titleId],
  (err, data) => {
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

// Returns an array of productions ordered by primaryTitle (ascending) with all their properties matching the search conditions
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
  
//   console.log([
//     primaryTitle,
//     isAdult,
//     startYearLow,
//     startYearHigh,
//     runtimeMinutesLow,
//     runtimeMinutesHigh,
//     averageRatingLow,
//     averageRatingHigh,
//     genre,
//     genreQuery
//   ])
  /*
  SELECT p.titleId, primaryTitle, startYear, runtimeMinutes, averageRating
  FROM ${req.params.type} t JOIN Production p ON t.titleId = p.titleId JOIN Genres g ON t.titleId = g.titleId
    JOIN Rating r ON t.titleId = r.titleId
  WHERE primaryTitle LIKE '%${primaryTitle}%' AND isAdult = ${isAdult} AND startYear >= ${startYearLow} AND startYear <= ${startYearHigh}
    AND runtimeMinutes >= ${runtimeMinutesLow} AND runtimeMinutes <= ${runtimeMinutesHigh} AND averageRating >= ${averageRatingLow}
    AND averageRating <= ${averageRatingHigh}${genreQuery}
  GROUP BY titleId, primaryTitle
  ORDER BY primaryTitle;
  */
  connection.query(`
    SELECT DISTINCT prg.titleId, primaryTitle, startYear, runtimeMinutes, averageRating
    FROM ${req.params.type} t JOIN prod_rating_genres prg on t.titleId = prg.titleId
    WHERE primaryTitle LIKE '%${primaryTitle}%' AND isAdult = ${isAdult} AND startYear BETWEEN ${startYearLow} AND ${startYearHigh} AND
        runtimeMinutes BETWEEN ${runtimeMinutesLow} AND ${runtimeMinutesHigh} AND
        averageRating BETWEEN ${averageRatingLow} AND ${averageRatingHigh}${genreQuery}
    ORDER BY primaryTitle;
    `,
    (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(
            data
          );
        }
      }
  );
};


/**********************
 * PERSON SEARCH PAGE *
 **********************/

//  Returns an array of productions with all their properties matching the search query about person (primaryName and category) ordered by primaryTitle (ascending)
const search_people = async function(req, res) {
  const primaryName = req.query.primaryName ?? '';
  const birthYearLow = req.query.birthYearLow ?? 1800;
  const birthYearHigh = req.query.birthYearHigh ?? 2023;
  const deathYearLow = req.query.deathYearLow ?? 1800;
  const deathYearHigh = req.query.deathYearHigh ?? 2023;

  const profession = req.query.profession;
  const professionQuery = (profession === 'All' || (!profession)) ? '' : ` AND profession = '${profession}'`;

  /*
  SELECT p.*, GROUP_CONCAT(profession SEPARATOR ', ') AS professions
    FROM Person p JOIN PrimaryProfessions pp ON p.personId = pp.personId
    WHERE p.personId IN (SELECT p.personId
                         FROM Person p JOIN PrimaryProfessions pp ON p.personId = pp.personId
                         WHERE primaryName LIKE '%${primaryName}%' AND birthYear >= ${birthYearLow} AND birthYear <= ${birthYearHigh}
                             AND deathYear >= ${deathYearLow} AND deathYear <= ${deathYearHigh}${professionQuery})
    GROUP BY personId, primaryName
    ORDER BY primaryName;
  */
  connection.query(`
    SELECT p.*, GROUP_CONCAT(profession SEPARATOR ', ') AS professions
    FROM Person p JOIN PrimaryProfessions pp ON p.personId = pp.personId
    WHERE p.personId IN (SELECT personId
                         FROM person_profess pp
                         WHERE primaryName LIKE '%${primaryName}%' AND birthYear BETWEEN ${birthYearLow} AND ${birthYearHigh} AND
                             deathYear BETWEEN ${deathYearLow} AND ${deathYearHigh}${professionQuery})
    GROUP BY personId, primaryName
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


/********************
 * PERSON INFO PAGE *
 ********************/

// Return all information about a person
const person = async function(req, res) {
    connection.query(`
    SELECT PS.primaryName, PS.birthyear, PS.deathyear, PP.profession, P.primaryTitle, P.titleId
    FROM Person PS
    JOIN PrimaryProfessions PP on PS.personId = PP.personId
    JOIN KnownForTitles KFT on PS.personId = KFT.personId
    JOIN Production P on KFT.titleId = P.titleId
    WHERE PS.personId = ?
  `, 
  [req.params.personId],
  (err, data) => {
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


/**************************************
 * SIMILAR PRODUCTIONS RECOMMENDATION *
 **************************************/

// Returns an array of productions with all their properties matching the search query ordered by averageRating(descending)
const similarProductions = async function (req, res) {
      const Query = `
        SELECT P.titleId, P.primaryTitle, P.isAdult, P.startYear, R.averageRating
        FROM Production P
        JOIN Rating R
        On P.titleId = R.titleId
        JOIN ${req.params.productionType} T
        On P.titleId = T.titleId
        JOIN Genres G
        On P.titleId = G.titleId
        WHERE R.numVotes > 10000 AND genre IN (SELECT genre FROM Genres WHERE titleId = '${req.params.titleId}')
            AND startYear <= ${req.params.thisYear} + 10 AND startYear >= ${req.params.thisYear} - 10
            AND P.titleId <> '${req.params.titleId}'
        GROUP BY P.titleId, P.primaryTitle, P.isAdult, P.startYear, R.averageRating
        HAVING COUNT(genre) >= 2
        ORDER BY R.averageRating DESC
        LIMIT 10
      `;
  
      connection.query(Query,  (err, data) => {
        if (err || data.length === 0) {
          console.error(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
};


module.exports = {
  random,
  topProduction,
  genre,
  top20ForGenre,
  top20ForYear,
  production,
  search_productions,
  search_people,
  person,
  similarProductions
};
