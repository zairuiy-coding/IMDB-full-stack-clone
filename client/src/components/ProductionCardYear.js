import { useEffect, useState, useRef } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { Link } from "react-router-dom";
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
const config = require('../config.json');


function ProductionCardYear({ year, type }) {
    const [top20, setTop20] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const typeRef = useRef(type);
    useEffect(() => {
        // Fetch request to get the song of the day. Fetch runs asynchronously.
        // The .then() method is called when the fetch request is complete
        // and proceeds to convert the result to a JSON which is finally placed in state.
        setLoading(true);
        setTop20([]);
        typeRef.current = type;
        fetch(`http://${config.server_host}:${config.server_port}/top20ForYear/${year}/${type}`)
            .then(res => res.json())
            .then(resJson => {if(typeRef.current === type)  setTop20(resJson)})
            .catch(error => setError(error))
            .finally(() => {if(typeRef.current === type) setLoading(false)});

    }, [year, type]);
    return (
        <Grid
            item
            xs={12}
            sm={12}
            md={4}
        >
            <Card>
                <CardHeader
                    title={year}
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
                <CardContent sx = {{height: 280, display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'}}>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
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
                    <ol>
                        {top20.map((d, index) => (
                            index < 5 &&
                            <Typography
                                component="li"
                                variant="subtitle1"
                                align="center"
                                key={d.primaryTitle + ": " + d.averageRating}
                            >
                                <Link to={`/production_info/${d.titleId}`} style={{ textDecoration: 'none' }}>
                                    {d.primaryTitle + ": " + d.averageRating}
                                </Link>
                            </Typography>
                        ))}
                    </ol>
                    }
                </CardContent>
                <CardActions>
                    <Button fullWidth>
                    <Link to="/TopInfoPage" underline="none" state={{ data: top20 }}>
                            Show more
                        </Link>
                    </Button>

                </CardActions>
            </Card>
        </Grid>
    );
}



export default ProductionCardYear;