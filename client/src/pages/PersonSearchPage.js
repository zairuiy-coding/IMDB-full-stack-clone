import { useEffect, useState } from 'react';
import { Button, Container, Grid, Slider, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function PersonSearchPage() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);

  const [primaryName, setPrimaryName] = useState('');
  const [birthYear, setBirthYear] = useState([0, 2023]);
  const [deathYear, setDeathYear] = useState([0, 2023]);
  const [profession, setProfession] = useState('All');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_people`)
      .then(res => res.json())
      .then(resJson => {
        const peopleWithId = resJson.map((person) => ({ id: person.personId, ...person }));
        setData(peopleWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_people?primaryName=${primaryName}&birthYearLow=${birthYear[0]}` +
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

  const professions = ['All', 'actor', 'miscellaneous', 'soundtrack', 'actress', 'music_department', 'writer', 'director', 'producer', 
    'stunts', 'make_up_department', 'composer', 'assistant_director', 'camera_department', 'music_artist', 'editor', 'cinematographer', 
    'casting_director', 'script_department', 'art_director', 'costume_department', 'animation_department', 'art_department', 
    'executive', 'special_effects', 'production_designer', 'production_manager', 'editorial_department', 'sound_department', 
    'talent_agent', 'casting_department', 'costume_designer', 'visual_effects', 'location_management', 'set_decorator', 
    'transportation_department', 'manager', 'publicist', 'legal', 'assistant', 'podcaster', 'production_department', 'choreographer', 
    'electrical_department'];
  
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
        <Grid item xs={6}>
          <p>Birth Year</p>
          <Slider style={{ color: 'black' }}
            value={birthYear}
            min={0}
            max={2023}
            step={1}
            onChange={(e, newValue) => setBirthYear(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
        <Grid item xs={6}>
          <p>Death Year</p>
          <Slider style={{ color: 'black' }}
            value={deathYear}
            min={0}
            max={2023}
            step={1}
            onChange={(e, newValue) => setDeathYear(newValue)}
            valueLabelDisplay='auto' 
          />
        </Grid>
      </Grid>
      <Button onClick={() => search()} 
       style={{ backgroundColor: 'black',color: 'white', left: '50%', 
       transform: 'translateX(-50%)', fontWeight: 'bold', marginTop: '25px' }}>
      {/* style={{ left: '50%', transform: 'translateX(-50%)' }}> */}
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
