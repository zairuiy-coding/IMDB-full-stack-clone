import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { formatDuration, formatReleaseDate } from '../helpers/formatter';
const config = require('../config.json');

export default function PersonInfoPage() {
  const { album_id } = useParams();

  const [songData, setSongData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
  const [albumData, setAlbumData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/album/${album_id}`)
      .then(res => res.json())
      .then(resJson => setAlbumData(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/album_songs/${album_id}`)
      .then(res => res.json())
      .then(resJson => setSongData(resJson));
  }, [album_id]);

  return (
    <Container>
      <Stack direction='row' justify='center'>
        <img
          key={albumData.album_id}
          src={albumData.thumbnail_url}
          alt={`${albumData.title} album art`}
          style={{
            marginTop: '40px',
            marginRight: '40px',
            marginBottom: '40px'
          }}
        />
        <Stack>
          <h1 style={{ fontSize: 64 }}>{albumData.title}</h1>
          <h2>Released: {formatReleaseDate(albumData.release_date)}</h2>
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
              songData.map((song) => 
                <TableRow key={song.song_id}>
                    <TableCell key='#'>{song.number}</TableCell>
                    <TableCell key='Title'>{song.title}</TableCell>
                    <TableCell key='Plays'>{song.plays}</TableCell>
                    <TableCell key='Duration'>{formatDuration(song.duration)}</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
