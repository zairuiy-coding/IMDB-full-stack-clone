import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
const config = require('../config.json');

export default function ProductionInfoPage() {
  const { titleId } = useParams();

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

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://${config.server_host}:${config.server_port}/productionInfo/${titleId}`)
      .then(res => res.json())
      .then(resJson => setProductionData(resJson))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, [titleId]);

//   console.log('productionData: ', productionData);


  return (
    <Container>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <Stack direction='row' justify='center'>
          {/* Your title-specific content */}
          <div>
            <h1 style={{ fontSize: 64 }}>{productionData[0].primaryTitle}</h1>
            <h2>Start Year: {productionData[0].startYear}</h2>
            <p>Rating: {productionData[0].averageRating}</p>
            <p>Duration: {productionData[0].runtimeMinutes}</p>
            <p>Genres: {productionData[0].genre}</p>
            <h2>Principals</h2>
            {productionData.map((prod, index) => (
                index < 5 &&
                <p
                    component="li"
                    variant="subtitle1"
                    // align="center"
                    key={prod.personName + ": " + prod.role}
                >
                    {prod.personName + ": " + prod.role}
                    {/* <Link to={`/PersonInfo/${prod.titleId}`} style={{ textDecoration: 'none' }}>
                        {prod.primaryTitle + ":" + prod.averageRating}
                    </Link> */}
                </p>
            ))}
            <h2>Similar Product Recommendation:</h2>


            {/* Add more details as needed */}
            {/* <Link onClick={() => setSelectedTitleId(productionData[0].titleId)}>
              View Production Card
            </Link> */}
          </div>

        </Stack>
      )}
    </Container>
  );
}
