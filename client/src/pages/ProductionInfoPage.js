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
  const [personWithLink, setPersonWithLink] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productionRes = await fetch(`https://${config.server_host}:${config.server_port}/productionInfo/${titleId}`);
        const productionJson = await productionRes.json();

        const year = productionJson.length > 0 ? productionJson[0].startYear : null;
        setThisYear(year);

        const uniqueProductionData = Array.isArray(productionJson)
          ? Array.from(new Set(productionJson.map(prod => prod.personName)))
              .map(personName => productionJson.find(prod => prod.personName === personName))
          : [];

        const personSetWithLink = new Set();

        await Promise.all(uniqueProductionData.map(p => new Promise(async (resolve) => {
            const personRes = await fetch(`https://${config.server_host}:${config.server_port}/personInfo/${p.personId}`)
                .then(res => res.json());
            if (Array.isArray(personRes) && personRes.length !== 0) {
                personSetWithLink.add(p.personId);
            }
            resolve();
        })));

        setPersonWithLink(personSetWithLink);
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
        const similarRes = await fetch(`https://${config.server_host}:${config.server_port}/similarProductions/${titleId}/${type}/${thisYear}`);
        const similarJson = await similarRes.json();
        setSimilarProducts(similarJson);
      } catch (error) {
        setError(error);
      }
    };

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
      <style>
        {`
          .production-info-container {
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-left: 0;
            margin-right: auto;
            width: 100%;
          }
          .production-title {
            font-size: 64px;
            margin-bottom: 20px;
            color: #333;
          }
          .production-detail {
            font-size: 18px;
            margin-bottom: 10px;
            color: #666;
          }
          .production-principals, .production-similar {
            margin-top: 40px;
            margin-bottom: 20px;
          }
          .production-principals h2, .production-similar h2 {
            font-size: 24px;
            color: #333;
          }
          .production-principals p {
            font-size: 16px;
            color: #666;
          }
          .link {
            color: #007bff;
            text-decoration: none;
          }
          .link:hover {
            text-decoration: underline;
          }
        `}
      </style>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && productionData !== null && productionData.length > 0 && (
        <Stack direction='row' justifyContent='flex-start'>
          <div className="production-info-container">
            <h1 className="production-title">{productionData[0].primaryTitle}</h1>
            <p className="production-detail">Start Year: {productionData[0].startYear}</p>
            <p className="production-detail">Rating: {productionData[0].averageRating}</p>
            <p className="production-detail">Duration: {productionData[0].runtimeMinutes}</p>
            <p className="production-detail">Genres: {productionData[0].genre}</p>
            <div className="production-principals">
              <h2>Principals</h2>
              {productionData.length > 0 ? (
                productionData.slice(0, 5).map((prod, index) => (
                  <p key={prod.personName + ': ' + prod.role} component='li' variant='subtitle1'>
                    {personWithLink.has(prod.personId) ? (
                      <Link to={`/person_info/${prod.personId}`} className="link">{prod.personName}</Link>
                    ) : (
                      prod.personName
                    )}
                    {prod.role ? `: ${prod.role}` : ''}
                  </p>
                ))
              ) : (
                <p>No data available</p>
              )}
            </div>
            <div className="production-similar">
              <h2>Similar Product Recommendation:</h2>
              {similarProducts.length > 0 ? (
                <SimpleTable
                  route={`https://${config.server_host}:${config.server_port}/similarProductions/${titleId}/${type}/${thisYear}`}
                  columns={tableColumns}
                  filter={(simProd) => simProd.titleId !== titleId && simProd.primaryTitle !== productionData[0].primaryTitle}
                />
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </Stack>
      )}
      {!loading && !error && productionData === null && (
        <p>Production Info currently not available.</p>
      )}
    </Container>
  );
};

export default ProductionInfoPage;
