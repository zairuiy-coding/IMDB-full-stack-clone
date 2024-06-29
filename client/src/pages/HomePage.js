import { useEffect, useState, useRef} from 'react';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const typeRef = useRef(type);
    const imgGenre = type === 'Movie' ? '' : (type === 'Short' ? 's' : 't');
    //window.location.reload(false);
    //const typeMemo = useMemo(() => type, [type]);
    // The useEffect hook by default runs the provided callback after every render
    // The second (optional) argument, [], is the dependency array which signals
    // to the hook to only run the provided callback if the value of the dependency array
    // changes from the previous render. In this case, an empty array means the callback
    // will only run on the very first render.
    useEffect(() => {
        // Fetch request to get the song of the day. Fetch runs asynchronously.
        // The .then() method is called when the fetch request is complete
        // and proceeds to convert the result to a JSON which is finally placed in state.
        setLoading(true);
        setTop250([]);
        //window.location.reload(false);
        typeRef.current = type;
        fetch(`https://${config.server_host}:${config.server_port}/topProduction/${type}`)
            .then(res => res.json())
            .then(resJson => {if(typeRef.current === type)  setTop250(resJson)})
            .catch(error => setError(error))
            .finally(() => {if(typeRef.current === type) setLoading(false)});

    }, [type]);

    
    return (
        <Container component="main">
            <br></br>
            <Title> TOP 250 </Title>
            <Grid container spacing={5} alignItems="flex-end" >
                <Grid 
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    
                >
                    
                    <Card
                
                        //style ={{backgroundImage: "url(/1.png)"}}
                        style ={{backgroundImage:"linear-gradient(rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.6)) , url(/" + imgGenre + "1.png)"}}
                        sx={{
                            maxWidth: 400,
                            margin: 'auto',
                            boxShadow: 3,
                            borderRadius: 12,
                            // bgcolor: 'background.paper'
                          }}>
                        <CardHeader 
                            title={'TOP 250 ' + typeMap[type]}
                            titleTypographyProps={{ variant: 'h5', align: 'center' }}
                            subheaderTypographyProps={{
                                align: 'center',
                            }}
                            sx={{
                                color: 'white',
                                padding: 2,
                              }}
                        />
                        <CardContent 
                             sx={{
                                height: 280,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                //backgroundColor: '#bbff00',
                                // backgroundColor: '#bbff00',
                                // transition: 'background-color 0.3s ease',
                              }}
                        >
                            {loading && <Typography variant="subtitle1"  color="white">Loading...</Typography>}
                            {error && <Typography variant="subtitle1" color="white">
                                        Error: {error.message}
                                      </Typography>}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'baseline',
                                    mb: 2,
                                }}
                                
                            >
                            </Box>
                            {!loading && !error &&
                            <ol style={{ textDecoration: 'none', color: '#FFF'}}>
                                {top250.map((d, index) => (
                                    index < 5 &&
                                    <Typography
                                        component="li"
                                        variant="subtitle1"
                                        align="center"
                                        key={d.primaryTitle + ": " + d.averageRating}
                                    >
                                        <Link to={`/production_info/${d.titleId}?type=${type}`} style={{ textDecoration: 'none', color: '#FFF'}}>
                                            {d.primaryTitle + ": " + d.averageRating}
                                        </Link>
                                    </Typography>
                                ))}
                            </ol>
                            }
                        </CardContent>
                        <CardActions>
                            <Button fullWidth >
                                <Link to="/TopInfoPage" underline="none" state={{ data: top250 }} style={{ textDecoration: 'none', color: '#FFF'}}>
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
                {genres.map((genre, index) => (
                    <ProductionCard genre = {genre} type = {type} num = {index}/>
                ))}
            </Grid>

            <br></br>
            <Title> TOP 20 for Each Year </Title>
            <Grid container spacing={5} alignItems="flex-end">
                {years.map((year, index) => (
                    <ProductionCardYear year = {year} type = {type} num = {index}/>
                ))}
            </Grid>


        </Container>
    );
};
