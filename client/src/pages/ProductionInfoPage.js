import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
import SimpleTable from '../components/SimpleTable';
import { Link } from 'react-router-dom';

const config = require('../config.json');

const ProductionInfoPage = ({ type }) => {
  const { titleId } = useParams();

  const [productionData, setProductionData] = useState([]);
  const [thisYear, setThisYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productionRes = await fetch(`http://${config.server_host}:${config.server_port}/productionInfo/${titleId}`);
        const productionJson = await productionRes.json();

        const year = productionJson.length > 0 ? productionJson[0].startYear : null;
        setThisYear(year);

        // Filter unique "personName" values
        const uniqueProductionData = Array.isArray(productionJson)
          ? Array.from(new Set(productionJson.map(prod => prod.personName)))
              .map(personName => productionJson.find(prod => prod.personName === personName))
          : [];

        setProductionData(uniqueProductionData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [titleId]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const similarRes = await fetch(`http://${config.server_host}:${config.server_port}/similarProductions/${titleId}/${type}/${thisYear}`);
        const similarJson = await similarRes.json();
        setSimilarProducts(similarJson);
      } catch (error) {
        setError(error);
      }
    };

    // Fetch similar products only when thisYear is available
    if (thisYear !== null) {
      fetchSimilarProducts();
    }
  }, [titleId, thisYear, type]);

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
                key={prod.personName + ': ' + prod.role}
                component='li'
                variant='subtitle1'
              >
                <Link to={`/person_info/${prod.personId}`}>{prod.personName}</Link>
                {': ' + prod.role}
              </p>
            ))}
            <h2>Similar Product Recommendation:</h2>
            {similarProducts.length > 0 ? (
              <SimpleTable
                route={`http://${config.server_host}:${config.server_port}/similarProductions/${titleId}/${type}/${thisYear}`}
                columns={tableColumns}
                filter={(simProd) => simProd.titleId !== titleId && simProd.primaryTitle !== productionData[0].primaryTitle}
              />
            ) : (
              <p>No similar products found.</p>
            )}
          </div>
        </Stack>
      )}
    </Container>
  );
};

export default ProductionInfoPage;
