import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
import SimpleTable from './SimpleTable';


const config = require('../config.json');

const ProductionInfoPage = () => {
  const { titleId } = useParams();

  const [productionData, setProductionData] = useState([]);
  const [similarProductionData, setSimilarProductionData] = useState([]);
  const [thisYear, setThisYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productionRes = await fetch(`http://${config.server_host}:${config.server_port}/productionInfo/${titleId}`);
        const productionJson = await productionRes.json();

        const year = productionJson.length > 0 ? productionJson[0].startYear : null;
        setThisYear(year);
        setProductionData(productionJson);

        // if (year !== null) {
        //   const similarRes = await fetch(`http://${config.server_host}:${config.server_port}/similarProductions/${titleId}/${year}`);
        //   const similarJson = await similarRes.json();
        //   console.log('Similar Production Data:', similarJson);
        //   setSimilarProductionData(similarJson);
        // }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [titleId]);

// Define columns for the LazyTable component
const tableColumns = [
    { field: 'primaryTitle', headerName: 'Product Title' },
    { field: 'startYear', headerName: 'Start Year' },
    { field: 'averageRating', headerName: 'Rating' },
  ];

  return (
    <Container>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && productionData.length > 0 && (
        <Stack direction='row' justify='center'>
          <div>
            <h1 style={{ fontSize: 64 }}>{productionData[0].primaryTitle}</h1>
            <h2>Start Year: {productionData[0].startYear}</h2>
            <p>Rating: {productionData[0].averageRating}</p>
            <p>Duration: {productionData[0].runtimeMinutes}</p>
            <p>Genres: {productionData[0].genre}</p>
            <h2>Principals</h2>
            {productionData.slice(0, 5).map((prod, index) => (
              <p
                key={prod.personName + ": " + prod.role}
                component="li"
                variant="subtitle1"
              >
                {prod.personName + ": " + prod.role}
              </p>
            ))}
            <h2>Similar Product Recommendation:</h2>
            <SimpleTable
                route={`http://${config.server_host}:${config.server_port}/similarProductions/${titleId}/${thisYear}`}
                columns={tableColumns}
            />



            {/* {similarProductionData.slice(0, 5).map((simProd, index) => (
              <p
                key={simProd.personName + ": " + simProd.role}
                component="li"
                variant="subtitle1"
              >
                {"Product Title: " + simProd.primaryTitle}
                {"Start Year: " + simProd.startYear}
                {"Rating: " + simProd.averageRating}
              </p>
            ))} */}

          </div>
        </Stack>
      )}
    </Container>
  );
};

export default ProductionInfoPage;
