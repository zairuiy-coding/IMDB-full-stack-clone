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
}


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


/*********************
 * PRODUCT INFO PAGE *
 *********************/

const production = async function(req, res) {
    connection.query(`
    SELECT P.primaryTitle, P.isAdult, P.startYear, P.runtimeMinutes, R.averageRating, G.genre,
    PS.primaryName AS personName, PC.category AS role
    FROM Production P
    JOIN Genres G ON P.titleId = G.titleId
    JOIN Principal PC ON P.titleId = PC.titleId
    JOIN Person PS on PC.personId = PS.personId
    JOIN Rating R on P.titleId = R.titleId
    WHERE P.titleId = ?
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
}

/*********************
 * PERSONINFO PAGE *
 *********************/

const person = async function(req, res) {
    connection.query(`
    SELECT PS.primaryName, PS.birthyear, PS.deathyear, PP.profession, P.primaryTitle 
    FROM Person PS
    JOIN PrimaryProfessions PP on PS.personId = PP.personId
    JOIN KnowForTitles KFT on PS.personId = KFT.personId
    JOIN Production P on KFT.titleId = P.titleId
    WHERE PS.personId = ${req.params.personId}
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

/***************************************
 * SIMILAR PRODUCTIONS RECOMMENDATION*
 ***************************************/

const similarProductions = async function(req, res) {
    connection.query(`
    WITH thisGenres AS (
      SELECT genre FROM Genres
      WHERE titleId = ${req.params.titleId}
    ),
    WITH thisCrew AS(
      SELECT DISTINCT personId FROM Principal
      WHERE titleId = ${req.params.titleId}
    ),
    WITH condition0 AS(
      SELECT titleId FROM ${req.params.productionType} T
    ),
    WITH condition1 AS(
      SELECT titleId FROM genres 
      WHERE genres IN thisGenres 
      GROUP BY titleId
      HAVING COUNT(genre) >= 2
    ),
    WITH condition2 AS(
      SELECT titleId FROM Production
      WHERE startYear <= ${req.params.thisYear} + 10 AND startYear >= ${req.params.thisYear} - 10
    ),
    WITH condition3 AS(
      SELECT titleId FROM Principal
      WHERE personId IN thisCrew
      GROUP BY titleId
      HAVING COUNT(DISTINCT personId) >= 2
    ),
    WITH similarIds AS(
      (SELECT * FROM condition0) 
      INTERSECT
      (
        ((SELECT * FROM condition1) 
            INTERSECT
        (SELECT * FROM condition2)) 
            UNION
        ((SELECT * FROM condition1) 
            INTERSECT
        (SELECT * FROM condition3)) 
            UNION
        ((SELECT * FROM condition2)
            INTERSECT
        (SELECT * FROM condition3))
        ) 
      ),
      SELECT P.titleId, P.primaryTitle, P.isAdult, P.startYear, P.averageRating 
      FROM Production P
      JOIN similarIds S
      On P.titleId = S.titleId
      ORDER BY P.averageRating DESC 
      LIMIT 10
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
      res.json(data);
      }
    }
  );
}




module.exports = {
  topProduction,
  genre,
  top20ForGenre,
  top20ForYear,
  production
}









