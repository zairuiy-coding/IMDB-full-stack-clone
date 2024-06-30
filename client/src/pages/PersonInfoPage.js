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
      <style>
        {`
          .person-info-container {
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-left: 0;
            margin-right: auto;
            width: 100%;
          }
          .person-title {
            font-size: 64px;
            margin-bottom: 20px;
            color: #333;
          }
          .person-detail {
            font-size: 18px;
            margin-bottom: 10px;
            color: #666;
          }
          .person-productions {
            margin-top: 40px;
            margin-bottom: 20px;
          }
          .person-productions h2 {
            font-size: 24px;
            color: #333;
          }
        `}
      </style>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && personData.length > 0 && (
        <Stack direction='row' justifyContent='flex-start'>
          <div className="person-info-container">
            <h1 className="person-title">{personData[0].primaryName}</h1>
            <p className="person-detail">Birth Year: {personData[0].birthyear}</p>
            <p className="person-detail">Death Year: {personData[0].deathyear}</p>
            <div className="person-productions">
              <h2>Productions</h2>
              <SimpleTable
                route={`https://${config.server_host}:${config.server_port}/personInfo/${personId}`}
                columns={[
                  { field: 'primaryTitle', headerName: 'Product Title' },
                  { field: 'profession', headerName: 'Profession' },
                ]}
              />
            </div>
          </div>
        </Stack>
      )}
      {!loading && !error && personData.length === 0 && (
        <p>No person data available.</p>
      )}
    </Container>
  );
}
