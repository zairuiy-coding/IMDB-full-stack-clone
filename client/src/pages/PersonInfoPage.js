import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
import SimpleTable from '../components/SimpleTable';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function PersonInfoPage() {
  
  const { personId } = useParams();
  const [personData, setPersonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const personRes = await fetch(`https://${config.server_host}:${config.server_port}/personInfo/${personId}`);
        const personJson = await personRes.json();
        setPersonData(personJson);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [personId]);


  return (
    <Container>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && personData.length > 0 && (
        <Stack direction='row' justify='center'>
          <div>
            <h1 style={{ fontSize: 64 }}>{personData[0].primaryName}</h1>
            {/* <h2>Profession: {personData[0].profession}</h2> */}
            <p>Birth Year: {personData[0].birthyear}</p>
            <p>Death Year: {personData[0].deathyear}</p>
            <h2>Productions</h2>
            {/* {personData.map((person, index) => (
              <p
              key={person.primaryTitle + ": " + person.profession}
              component="li"
              variant="subtitle1"
            >
              {person.primaryTitle + ":  " + person.profession}
              </p>
            ))} */}
            <SimpleTable
                route={`https://${config.server_host}:${config.server_port}/personInfo/${personId}`}
                columns={[
                  { field:'primaryTitle', headerName: 'Product Title' },
                  { field:'profession', headerName: 'Profession' },
                ]}
            />
          </div>
        </Stack>
      )}
    </Container>
  );
}
