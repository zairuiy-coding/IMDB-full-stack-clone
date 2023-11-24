import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Link } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import Title from '../components/Title';
import ProductionCard from '../components/ProductionCard';
import ProductionCardYear from '../components/ProductionCardYear';


const config = require('../config.json');

export default function HomePage({ type }) {
    // We use the setState hook to persist information across renders (such as the result of our API calls)
    const [top250, setTop250] = useState([]);
    const genres = ['Comedy', 'Romance', 'Fantasy', 'Music', 'Animation', 'Documentary', 'Horror', 'Sport', 'Drama'];
    const years = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];
    const typeMap = {
        Movie: 'Movies',
        Short: 'Shorts',
        TVSeries: 'TVSeries',
    }
    // The useEffect hook by default runs the provided callback after every render
    // The second (optional) argument, [], is the dependency array which signals
    // to the hook to only run the provided callback if the value of the dependency array
    // changes from the previous render. In this case, an empty array means the callback
    // will only run on the very first render.
    useEffect(() => {
        // Fetch request to get the song of the day. Fetch runs asynchronously.
        // The .then() method is called when the fetch request is complete
        // and proceeds to convert the result to a JSON which is finally placed in state.
        fetch(`http://${config.server_host}:${config.server_port}/topProduction/${type}`)
            .then(res => res.json())
            .then(resJson => setTop250(resJson));

    }, [type]);


    return (
        <Container component="main">
            <br></br>
            <Title> TOP 250 </Title>
            <Grid container spacing={5} alignItems="flex-end">
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                >
                    <Card>
                        <CardHeader
                            title={'TOP 250 ' + typeMap[type]}
                            titleTypographyProps={{ align: 'center' }}
                            subheaderTypographyProps={{
                                align: 'center',
                            }}
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? theme.palette.grey[200]
                                        : theme.palette.grey[700],
                            }}
                        />
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'baseline',
                                    mb: 2,
                                }}
                            >
                            </Box>
                            <ol>
                                {top250.map((d, index) => (
                                    index < 5 &&
                                    <Typography
                                        component="li"
                                        variant="subtitle1"
                                        align="center"
                                        key={d.primaryTitle + ":" + d.averageRating}
                                    >
                                        {d.primaryTitle + ":" + d.averageRating}
                                    </Typography>
                                ))}
                            </ol>
                        </CardContent>
                        <CardActions>
                            <Button fullWidth>
                                <Link to="/TopInfoPage" underline="none" state={{ data: top250 }}>
                                    Show more
                                </Link>
                            </Button>

                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <br></br>
            <Title> TOP 20 for Each Genre </Title>
            <Grid container spacing={5} alignItems="flex-end">
                {genres.map((genre) => (
                    <ProductionCard genre = {genre} type = {type}/>
                ))}
            </Grid>

            <br></br>
            <Title> TOP 20 for Each Year </Title>
            <Grid container spacing={5} alignItems="flex-end">
                {years.map((year) => (
                    <ProductionCardYear year = {year} type = {type}/>
                ))}
            </Grid>


        </Container>
    );
};