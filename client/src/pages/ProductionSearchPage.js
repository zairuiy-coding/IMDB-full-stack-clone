import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Slider, TextField, FormControl, InputLabel, Select, MenuItem } from 
  '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function ProductionSearchPage({ type }) {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);

  const [primaryTitle, setPrimaryTitle] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [startYear, setStartYear] = useState([1870, 2035]);
  const [runtimeMinutes, setRuntimeMinutes] = useState([0, 55000]);
  const [genre, setGenre] = useState('All');
  const [averageRating, setAverageRating] = useState([0, 10]);
  const [numVotes, setNumVotes] = useState([0, 3000000]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_productions/${type}`)
      .then(res => res.json())
      .then(resJson => {
        const productionsWithId = resJson.map((production) => ({ id: production.titleId, ...production }));
        setData(productionsWithId);
      });
  }, [type]);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_productions/${type}?primaryTitle=${primaryTitle}` +
      `&isAdult=${isAdult}&startYearLow=${startYear[0]}&startYearHigh=${startYear[1]}&runtimeMinutesLow=${runtimeMinutes[0]}` +
      `&runtimeMinutesHigh=${runtimeMinutes[1]}&genre=${genre}&averageRatingLow=${averageRating[0]}` +
      `&averageRatingHigh=${averageRating[1]}&numVotesLow=${numVotes[0]}&numVotesHigh=${numVotes[1]}`
    )
      .then(res => res.json())
      .then(resJson => {
        const productionsWithId = resJson.map((production) => ({ id: production.titleId, ...production }));
        setData(productionsWithId);
      });
  };

  // This defines the columns of the table of productions. We use the DataGrid component for the table.
  const columns = [
    { field: 'primaryTitle', headerName: 'Title', width: 490, renderCell: (params) => (
        <NavLink to={`/production_info/${params.row.titleId}`}>{params.value}</NavLink>
      ) },
    { field: 'startYear', headerName: 'Release Year', width: 220 },
    { field: 'runtimeMinutes', headerName: 'Runtime (mins)', width: 220 },
    { field: 'averageRating', headerName: 'Average Rating', width: 220 }
  ];

  let typeDisplayed = '';
  let releaseYear = [];
  let runtime = [];
  let numOfVotes = [];
  let ryWidth = 0;
  let arWidth = 3;
  if (type === 'Movie') {
    typeDisplayed = 'Movies';
    releaseYear = [1890, 2035];
    runtime = [0, 55000];
    numOfVotes = [0, 3000000];
    ryWidth = 3;
  } else if (type === 'Short') {
    typeDisplayed = 'Shorts';
    releaseYear = [1870, 2030];
    runtime = [0, 400];
    numOfVotes = [0, 65000];
    ryWidth = 6;
    arWidth = 5;
  } else {
    typeDisplayed = 'TV Series';
    releaseYear = [1920, 2030];
    runtime = [0, 8500];
    numOfVotes = [0, 2500000];
    ryWidth = 4;
  }

  const genres = ['All', 'Documentary', 'Short', 'Animation', 'Comedy', 'Romance', 'Sport', 'News', 'Drama', 'Fantasy', 'Horror', 
    'Biography', 'Music', 'War', 'Crime', 'Western', 'Family', 'Adventure', 'Action', 'History', 'Mystery', 'Sci-Fi', 'Musical', 
    'Thriller', 'Film-Noir', 'Talk-Show', 'Game-Show', 'Reality-TV', 'Adult'];
  
  return (
    <Container>
      <h2>Search {typeDisplayed}</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField label='Title' value={primaryTitle} onChange={(e) => setPrimaryTitle(e.target.value)} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={4}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel id='genre_label'>Genre</InputLabel>
            <Select labelId='genre_label' label='Label' value={genre} onChange={(e) => setGenre(e.target.value)}>
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>{genre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            label='Adult'
            control={<Checkbox checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} />} 
          />
        </Grid>
        <Grid item xs={ryWidth}>
          <p>Release Year</p>
          <Slider
            value={startYear}
            min={releaseYear[0]}
            max={releaseYear[1]}
            step={1}
            onChange={(e, newValue) => setStartYear(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
        <Grid item xs={12-ryWidth}>
          <p>Runtime (mins)</p>
          <Slider
            value={runtimeMinutes}
            min={runtime[0]}
            max={runtime[1]}
            step={1}
            onChange={(e, newValue) => setRuntimeMinutes(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
        <Grid item xs={arWidth}>
          <p>Average Rating</p>
          <Slider
            value={averageRating}
            min={0.0}
            max={10.0}
            step={0.1}
            onChange={(e, newValue) => setAverageRating(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
        <Grid item xs={12-arWidth}>
          <p>Number of Votes</p>
          <Slider
            value={numVotes}
            min={numOfVotes[0]}
            max={numOfVotes[1]}
            step={10}
            onChange={(e, newValue) => setNumVotes(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
      </Grid>
      <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight 
      />
    </Container>
  );
};
