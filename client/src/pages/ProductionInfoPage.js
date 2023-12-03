import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import ProductionCard from '../components/ProductionCard';
import { formatDuration, formatReleaseDate } from '../helpers/formatter';
const config = require('../config.json');

export default function ProductionInfoPage() {
  const { titleId } = useParams();

  const [productionData, setProductionData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code


  const [selectedTitleId, setSelectedTitleId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/productionInfo/${titleId}`)
      .then(res => res.json())
      .then(resJson => setProductionData(resJson));
  }, [titleId]);

  return (
    <Container>
      {selectedTitleId && <ProductionCard songId={selectedTitleId} handleClose={() => setSelectedTitleId(null)} />}
      <Stack direction='row' justify='center'>
        <img
          key={productionData.album_id}
          src={productionData.thumbnail_url}
          alt={`${productionData.title} album art`}
          style={{
            marginTop: '40px',
            marginRight: '40px',
            marginBottom: '40px'
          }}
        />
        <Stack>
          <h1 style={{ fontSize: 64 }}>{productionData.title}</h1>
          <h2>Released: {formatReleaseDate(productionData.release_date)}</h2>
        </Stack>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key='#'>#</TableCell>
              <TableCell key='Title'>Title</TableCell>
              <TableCell key='Plays'>Plays</TableCell>
              <TableCell key='Duration'>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // TODO (TASK 23): render the table content by mapping the songData array to <TableRow> elements
              // Hint: the skeleton code for the very first row is provided for you. Fill out the missing information and then use a map function to render the rest of the rows.
              // Hint: it may be useful to refer back to LazyTable.js
              productionData.map((title) => 
                <TableRow key={title.song_id}>
                    <TableCell key='#'>{title.number}</TableCell>
                    <TableCell key='Title'>
                        <Link onClick={() => setSelectedTitleId(title.song_id)}>
                            {title.title}
                        </Link>
                    </TableCell>
                    <TableCell key='Plays'>{title.plays}</TableCell>
                    <TableCell key='Duration'>{formatDuration(title.duration)}</TableCell>
                </TableRow>
              )
              
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}