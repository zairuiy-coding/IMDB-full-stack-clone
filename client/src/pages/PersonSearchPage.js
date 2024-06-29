import { useEffect, useState } from 'react';
import { Button, Container, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function PersonSearchPage() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);

  const [primaryName, setPrimaryName] = useState('');
  const [birthYear, setBirthYear] = useState([1800, 2013]);
  const [deathYear, setDeathYear] = useState([1800, 2023]);
  const [profession, setProfession] = useState('All');

  useEffect(() => {
    fetch(`https://${config.server_host}:${config.server_port}/search_people`)
      .then(res => res.json())
      .then(resJson => {
        const peopleWithId = resJson.map((person) => ({ id: person.personId, ...person }));
        setData(peopleWithId);
      });
  }, []);

  const search = () => {
    fetch(`https://${config.server_host}:${config.server_port}/search_people?primaryName=${primaryName}&birthYearLow=${birthYear[0]}` +
      `&birthYearHigh=${birthYear[1]}&deathYearLow=${deathYear[0]}&deathYearHigh=${deathYear[1]}&profession=${profession}`
    )
      .then(res => res.json())
      .then(resJson => {
        const peopleWithId = resJson.map((person) => ({ id: person.personId, ...person }));
        setData(peopleWithId);
      });
  };

  // This defines the columns of the table of productions. We use the DataGrid component for the table.
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
  
  return (
    <Container>
      <h2>Search People</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <TextField label='Name' value={primaryName} onChange={(e) => setPrimaryName(e.target.value)} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={6}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel id='profession_label'>Profession</InputLabel>
            <Select labelId='profession_label' label='Profession' value={profession} onChange={(e) => setProfession(e.target.value)}>
              {professions.map((profession) => (
                <MenuItem key={profession} value={profession}>{profession}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={6}>
          <p>Birth Year</p>
          <Slider style={{ color: 'black' }}
            value={birthYear}
            min={1500}
            max={2013}
            step={1}
            onChange={(e, newValue) => setBirthYear(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
        <Grid item xs={6}>
          <p>Death Year</p>
          <Slider style={{ color: 'black' }}
            value={deathYear}
            min={1500}
            max={2023}
            step={1}
            onChange={(e, newValue) => setDeathYear(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid> */}
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
          marginTop: '60px',
          marginBottom: '200px',
          fontSize: '20px', // Adjust the font size as needed
          padding: '15px 80px' // Adjust the padding as needed
        }}>
        Search
      </Button>
      <h2>People</h2>
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
