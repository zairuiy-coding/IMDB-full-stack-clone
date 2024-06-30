import { useEffect, useState } from 'react';
import { Button, Container, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function PersonSearchPage() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);

  const [primaryName, setPrimaryName] = useState('');
  const [birthYear, setBirthYear] = useState([1800, 2013]);
  const [deathYear, setDeathYear] = useState([1800, 2023]);
  const [profession, setProfession] = useState('All');

  useEffect(() => {
    setLoading(true);
    fetch(`https://${config.server_host}:${config.server_port}/search_people`)
      .then(res => res.json())
      .then(resJson => {
        const peopleWithId = resJson.map((person) => ({ id: person.personId, ...person }));
        setData(peopleWithId);
        setLoading(false);
      });
  }, []);

  const search = () => {
    setLoading(true);
    fetch(`https://${config.server_host}:${config.server_port}/search_people?primaryName=${primaryName}&birthYearLow=${birthYear[0]}` +
      `&birthYearHigh=${birthYear[1]}&deathYearLow=${deathYear[0]}&deathYearHigh=${deathYear[1]}&profession=${profession}`
    )
      .then(res => res.json())
      .then(resJson => {
        const peopleWithId = resJson.map((person) => ({ id: person.personId, ...person }));
        setData(peopleWithId);
        setLoading(false);
      });
  };

  const columns = [
    { field: 'primaryName', headerName: 'Name', width: 360, renderCell: (params) => (
        <NavLink to={`/person_info/${params.row.personId}`}>{params.value}</NavLink>
      ) },
    { field: 'birthYear', headerName: 'Birth Year', width: 150 },
    { field: 'deathYear', headerName: 'Death Year', width: 150 },
    { field: 'professions', headerName: 'Professions', width: 490 }
  ];

  const professions = ['All', 'actor', 'actress', 'animation_department', 'art_department', 'art_director', 'assistant',
    'assistant_director', 'camera_department', 'casting_department', 'casting_director', 'cinematographer', 'composer',
    'costume_department', 'costume_designer', 'director', 'editor', 'editorial_department', 'executive', 'legal', 'location_management',
    'make_up_department', 'manager', 'miscellaneous', 'music_artist', 'music_department', 'podcaster', 'producer', 'production_designer',
    'production_manager', 'publicist', 'script_department', 'set_decorator', 'sound_department', 'soundtrack', 'special_effects', 'stunts',
    'talent_agent', 'transportation_department', 'visual_effects', 'writer'];

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
      <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>Search People</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField 
            label='Name' 
            value={primaryName} 
            onChange={(e) => setPrimaryName(e.target.value)} 
            style={{ width: "100%", border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }} 
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl style={{ width: '100%', marginBottom: '20px' }}>
            <InputLabel id='profession_label'>Profession</InputLabel>
            <Select labelId='profession_label' label='Profession' value={profession} onChange={(e) => setProfession(e.target.value)}>
              {professions.map((profession) => (
                <MenuItem key={profession} value={profession}>{profession}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'gray', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" style={{ color: 'orange' }} gutterBottom>
                Birth Year
              </Typography>
            </div>
            <input
              type="range"
              value={birthYear[0]}
              min={1800}
              max={2013}
              step={1}
              onChange={(e) => setBirthYear([parseInt(e.target.value), birthYear[1]])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <input
              type="range"
              value={birthYear[1]}
              min={1800}
              max={2013}
              step={1}
              onChange={(e) => setBirthYear([birthYear[0], parseInt(e.target.value)])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>Selected Range: {birthYear[0]} - {birthYear[1]}</div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'gray', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" style={{ color: 'orange' }} gutterBottom>
                Death Year
              </Typography>
            </div>
            <input
              type="range"
              value={deathYear[0]}
              min={1800}
              max={2023}
              step={1}
              onChange={(e) => setDeathYear([parseInt(e.target.value), deathYear[1]])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <input
              type="range"
              value={deathYear[1]}
              min={1800}
              max={2023}
              step={1}
              onChange={(e) => setDeathYear([deathYear[0], parseInt(e.target.value)])}
              style={{ width: '80%', height: '20px', marginTop: '8px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>Selected Range: {deathYear[0]} - {deathYear[1]}</div>
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px' }}>People YOU LOOK FOR</h2>
      <div style={{ marginBottom: '40px' }}>
        <DataGrid
          rows={loading ? [] : data}
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
