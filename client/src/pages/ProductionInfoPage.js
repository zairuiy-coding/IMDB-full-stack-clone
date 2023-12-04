import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Link, Stack } from '@mui/material';

import ProductionCard from '../components/ProductionCard';
import { formatDuration, formatReleaseDate } from '../helpers/formatter';
const config = require('../config.json');

export default function ProductionInfoPage() {
  const { titleId } = useParams();

  const [selectedTitleId, setSelectedTitleId] = useState(null);
  const [productionData, setProductionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://${config.server_host}:${config.server_port}/productionInfo/${titleId}`)
      .then(res => res.json())
      .then(resJson => setProductionData(resJson))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, [titleId]);

  console.log('productionData: ', productionData);


  return (
    <Container>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <Stack direction='row' justify='center'>
          {/* Your title-specific content */}
          <div>
            <h1 style={{ fontSize: 64 }}>{productionData.primaryTitle}</h1>
            <h2>Start Year: {productionData.startYear}</h2>
            <p>Rating: {productionData.averageRating}</p>
            <p>Duration: {productionData.runtimeMinutes}</p>
            <p>Genres: {productionData.genre}</p>
            <p>Principals: {productionData.personName}</p>
            <p>Roles: {productionData.role}</p>
            {/* Add more details as needed */}
            <Link onClick={() => setSelectedTitleId(productionData.titleId)}>
              View Production Card
            </Link>
          </div>
          {/* Optionally include ProductionCard or other components based on your needs */}
          {selectedTitleId && <ProductionCard songId={selectedTitleId} handleClose={() => setSelectedTitleId(null)} />}
        </Stack>
      )}
    </Container>
  );
}
