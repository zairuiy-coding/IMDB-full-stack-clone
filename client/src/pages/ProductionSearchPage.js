import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from 
  '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function ProductionSearchPage({ type }) {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);

  const [primaryTitle, setPrimaryTitle] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [startYear, setStartYear] = useState([1900, 2023]);
  const [runtimeMinutes, setRuntimeMinutes] = useState([0, 5300]);
  const [genre, setGenre] = useState('All');
  const [averageRating, setAverageRating] = useState([0, 10]);

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
      `&averageRatingHigh=${averageRating[1]}`
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
  let ryWidth = 0;
  let rtWidth = 0;
  if (type === 'Movie') {
    typeDisplayed = 'Movies';
    releaseYear = [1900, 2023];
    runtime = [0, 1000];
    // ryWidth = 4;
    // rtWidth = 6;
    ryWidth = 4;
    rtWidth = 4;
  } else if (type === 'Short') {
    typeDisplayed = 'Shorts';
    releaseYear = [1900, 2023];
    runtime = [0, 110];
    // ryWidth = 5;
    // rtWidth = 4;
    ryWidth = 4;
    rtWidth = 4;
  } else {
    typeDisplayed = 'TV Series';
    releaseYear = [1930, 2023];
    runtime = [0, 5300];
    // ryWidth = 3;
    // rtWidth = 7;
    ryWidth = 4;
    rtWidth = 4;
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
        {/* <Grid item xs={ryWidth}>
          <p>Release Year</p>
          <Slider style={{ color: 'black' }}
            value={startYear}
            min={releaseYear[0]}
            max={releaseYear[1]}
            step={1}
            onChange={(e, newValue) => setStartYear(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
        <Grid item xs={rtWidth}>
          <p>Runtime (mins)</p>
          <Slider style={{ color: 'black' }}
            value={runtimeMinutes}
            min={runtime[0]}
            max={runtime[1]}
            step={1}
            onChange={(e, newValue) => setRuntimeMinutes(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
        <Grid item xs={12-ryWidth-rtWidth}>
          <p>Average Rating</p>
          <Slider style={{ color: 'black' }}
            value={averageRating}
            min={0.0}
            max={10.0}
            step={0.1}
            onChange={(e, newValue) => setAverageRating(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid> */}
        <Grid item xs={ryWidth}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'gray', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" style={{ color: 'orange' }} gutterBottom>
                Release Year
              </Typography>
            </div>
            <input
              type="range"
              value={startYear[0]}
              min={releaseYear[0]}
              max={releaseYear[1]}
              step={1}
              onChange={(e) => setStartYear([parseInt(e.target.value), startYear[1]])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <input
              type="range"
              value={startYear[1]}
              min={releaseYear[0]}
              max={releaseYear[1]}
              step={1}
              onChange={(e) => setStartYear([startYear[0], parseInt(e.target.value)])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>Selected Range: {startYear[0]} - {startYear[1]}</div>
            </div>
          </div>
        </Grid>
        <Grid item xs={rtWidth}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'gray', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" style={{ color: 'orange' }} gutterBottom>
                Runtime (mins)
              </Typography>
            </div>
            <input
              type="range"
              value={runtimeMinutes[0]}
              min={runtime[0]}
              max={runtime[1]}
              step={1}
              onChange={(e) => setRuntimeMinutes([parseInt(e.target.value), runtimeMinutes[1]])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <input
              type="range"
              value={runtimeMinutes[1]}
              min={runtime[0]}
              max={runtime[1]}
              step={1}
              onChange={(e) => setRuntimeMinutes([runtimeMinutes[0], parseInt(e.target.value)])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>Selected Range: {runtimeMinutes[0]} - {runtimeMinutes[1]}</div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12-ryWidth-rtWidth}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'gray', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" style={{ color: 'orange' }} gutterBottom>
                Average Rating
              </Typography>
            </div>
            <input
              type="range"
              value={averageRating[0]}
              min={0.0}
              max={10.0}
              step={0.1}
              onChange={(e) => setAverageRating([parseInt(e.target.value), averageRating[1]])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <input
              type="range"
              value={averageRating[1]}
              min={0.0}
              max={10.0}
              step={0.1}
              onChange={(e) => setAverageRating([averageRating[0], parseInt(e.target.value)])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>Selected Range: {averageRating[0]} - {averageRating[1]}</div>
            </div>
          </div>
        </Grid>
      </Grid>
      {/* <Button
        onClick={() => search()} 
        style={{ backgroundColor: 'black', color: 'white', left: '50%', 
        transform: 'translateX(-50%)', fontWeight: 'bold', marginTop: '25px' }}>
          Search
      </Button> */}
      <Button
        onClick={() => search()} 
        style={{ 
          backgroundColor: 'black',
          color: 'white',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 'bold',
          marginTop: '60px',
          marginBottom: '200px',
          fontSize: '20px', // Adjust the font size as needed
          padding: '15px 80px' // Adjust the padding as needed
        }}>
        Search
      </Button>
      <h2>{typeDisplayed} YOU WOULD LIKE</h2>
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
