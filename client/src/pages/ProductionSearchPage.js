import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function ProductionSearchPage({ type }) {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);  // New state for loading

  const [primaryTitle, setPrimaryTitle] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [startYear, setStartYear] = useState([1900, 2023]);
  const [runtimeMinutes, setRuntimeMinutes] = useState([0, 5300]);
  const [genre, setGenre] = useState('All');
  const [averageRating, setAverageRating] = useState([0, 10]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://${config.server_host}:${config.server_port}/search_productions/${type}`)
      .then(res => res.json())
      .then(resJson => {
        const productionsWithId = resJson.map((production) => ({ id: production.titleId, ...production }));
        setData(productionsWithId);
        setLoading(false);
      });
  }, [type]);

  const search = () => {
    setLoading(true);
    fetch(`https://${config.server_host}:${config.server_port}/search_productions/${type}?primaryTitle=${primaryTitle}` +
      `&isAdult=${isAdult}&startYearLow=${startYear[0]}&startYearHigh=${startYear[1]}&runtimeMinutesLow=${runtimeMinutes[0]}` +
      `&runtimeMinutesHigh=${runtimeMinutes[1]}&genre=${genre}&averageRatingLow=${averageRating[0]}` +
      `&averageRatingHigh=${averageRating[1]}`
    )
      .then(res => res.json())
      .then(resJson => {
        const productionsWithId = resJson.map((production) => ({ id: production.titleId, ...production }));
        setData(productionsWithId);
        setLoading(false);
      });
  };

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
    ryWidth = 4;
    rtWidth = 4;
  } else if (type === 'Short') {
    typeDisplayed = 'Shorts';
    releaseYear = [1900, 2023];
    runtime = [0, 110];
    ryWidth = 4;
    rtWidth = 4;
  } else {
    typeDisplayed = 'TV Series';
    releaseYear = [1930, 2023];
    runtime = [0, 5300];
    ryWidth = 4;
    rtWidth = 4;
  }

  const genres = ['All', 'Documentary', 'Short', 'Animation', 'Comedy', 'Romance', 'Sport', 'News', 'Drama', 'Fantasy', 'Horror', 
    'Biography', 'Music', 'War', 'Crime', 'Western', 'Family', 'Adventure', 'Action', 'History', 'Mystery', 'Sci-Fi', 'Musical', 
    'Thriller', 'Film-Noir', 'Talk-Show', 'Game-Show', 'Reality-TV', 'Adult'];

  const rangeInputStyle = `
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      background: gray;
      cursor: pointer;
      border-radius: 50%;
    }
    input[type="range"]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: gray;
      cursor: pointer;
      border-radius: 50%;
    }
    input[type="range"]::-ms-thumb {
      width: 20px;
      height: 20px;
      background: gray;
      cursor: pointer;
      border-radius: 50%;
    }
  `;

  const getRowClassName = (params) => {
    if (params.index === 0) {
      return 'bold-row';
    }
    return '';
  };

  return (
    <Container>
      <style>
        {rangeInputStyle}
        {`
          .bold-row {
            font-weight: bold;
          }
        `}
      </style>
      <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Search {typeDisplayed}</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField 
            label='Title' 
            value={primaryTitle} 
            onChange={(e) => setPrimaryTitle(e.target.value)} 
            style={{ width: "100%", border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }} 
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl style={{ width: '100%', marginBottom: '20px' }}>
            <InputLabel id='genre_label'>Genre</InputLabel>
            <Select labelId='genre_label' label='Genre' value={genre} onChange={(e) => setGenre(e.target.value)}>
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
            style={{ marginBottom: '20px' }}
          />
        </Grid>
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
      <Button
        onClick={() => search()} 
        style={{ 
          backgroundColor: 'black',
          color: 'white',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 'bold',
          marginTop: '40px',
          marginBottom: '60px',
          fontSize: '20px',
          padding: '15px 80px',
        }}
      >
        Search
      </Button>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px' }}>{typeDisplayed} YOU WOULD LIKE</h2>
      <div style={{ marginBottom: '40px' }}>
        <DataGrid
          rows={loading ? [] : data} // Show empty rows if loading
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight 
          getRowClassName={getRowClassName}
          components={{
            NoRowsOverlay: () => (
              <div style={{ padding: '10px', textAlign: 'center' }}>
                {loading ? "Loading..." : "No rows"}
              </div>
            )
          }}
        />
      </div>
    </Container>
  );
}
