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

// // Function to create the view
// const ProductionInfoView = (callback) => {
//     connection.query(`
//         CREATE OR REPLACE VIEW ProductionInfoView AS
//         SELECT
//             P.titleId,
//             P.primaryTitle,
//             P.isAdult,
//             P.startYear,
//             P.runtimeMinutes,
//             R.averageRating,
//             G.genre,
//             PS.primaryName AS personName,
//             PC.category AS role
//         FROM
//             Production P
//         JOIN
//             Genres G ON P.titleId = G.titleId
//         JOIN
//             Principal PC ON P.titleId = PC.titleId
//         JOIN
//             Person PS ON PC.personId = PS.personId
//         JOIN
//             Rating R ON P.titleId = R.titleId
//     `, (err) => {
//         if (err) {
//             console.log("Error creating ProductionInfoView:", err);
//             callback(err);
//         } else {
//             console.log("ProductionInfoView created successfully");
//             callback(null);
//         }
//     });
// };

// // Initialize the ProductionInfoView when the application starts
// ProductionInfoView((err) => {
//     if (err) {
//         // Handle initialization error, if any
//         console.log("Error initializing ProductionInfoView:", err);
//     } else {
//         // Continue with your application initialization
//         console.log("ProductionInfoView initialized successfully");
//     }
// });


// // Route to fetch data from the view
// const production = (req, res) => {
//     connection.query(`
//         SELECT * FROM ProductionInfoView WHERE titleId = ?
//     `, [req.params.titleId], (err, data) => {
//         if (err || data.length === 0) {
//             console.log(err);
//             res.json({});
//         } else {
//             res.json(data);
//         }
//     });
// };

const production = async function(req, res) {
    connection.query(`
    SELECT
        P.titleId,
        P.primaryTitle,
        P.isAdult,
        P.startYear,
        P.runtimeMinutes,
        R.averageRating,
        G.genre,
        PS.primaryName AS personName,
        PS.personId AS personId,
        PC.category AS role
    FROM
        Production P
    JOIN
        Genres G ON P.titleId = G.titleId
    JOIN
        Principal PC ON P.titleId = PC.titleId
    JOIN
        Person PS ON PC.personId = PS.personId
    JOIN
        Rating R ON P.titleId = R.titleId
    WHERE
        P.titleId = ?
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
  // const numVotesLow = req.query.numVotesLow ?? 0;
  // const numVotesHigh = req.query.numVotesHigh ?? 3000000;

  /*
  SELECT p.titleId, primaryTitle, startYear, runtimeMinutes, averageRating
  FROM ${req.params.type} t JOIN Production p ON t.titleId = p.titleId JOIN Genres g ON t.titleId = g.titleId
    JOIN Rating r ON t.titleId = r.titleId
  WHERE primaryTitle LIKE '%${primaryTitle}%' AND isAdult = ${isAdult} AND startYear >= ${startYearLow} AND startYear <= ${startYearHigh}
    AND runtimeMinutes >= ${runtimeMinutesLow} AND runtimeMinutes <= ${runtimeMinutesHigh} AND averageRating >= ${averageRatingLow}
    AND averageRating <= ${averageRatingHigh} AND numVotes >= ${numVotesLow} AND numVotes <= ${numVotesHigh}${genreQuery}
  GROUP BY titleId
  ORDER BY primaryTitle;
  */
  /*
  AND numVotes BETWEEN ${numVotesLow} AND ${numVotesHigh}
  */
  connection.query(
    `
    SELECT DISTINCT pr.titleId, primaryTitle, startYear, runtimeMinutes, averageRating
    FROM ${req.params.type} t
    JOIN prod_rating pr ON t.titleId = pr.titleId
    JOIN Genres g ON t.titleId = g.titleId
    WHERE primaryTitle LIKE ? AND isAdult = ? AND startYear BETWEEN ? AND ?
      AND runtimeMinutes BETWEEN ? AND ? AND averageRating BETWEEN ? AND ? ${genreQuery}
    ORDER BY primaryTitle;
    `,
    [
      `%${primaryTitle}%`,
      isAdult,
      startYearLow,
      startYearHigh,
      runtimeMinutesLow,
      runtimeMinutesHigh,
      averageRatingLow,
      averageRatingHigh,
    ],
    (err, data) => {
      // Handle the result
    }
  );
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


/********************
 * PERSON INFO PAGE *
 ********************/

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
