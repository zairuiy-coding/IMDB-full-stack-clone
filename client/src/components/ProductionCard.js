import { useEffect, useState } from 'react';
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


function ProductionCard({ genre, type }) {
    const [top20, setTop20] = useState([]);
    useEffect(() => {
        // Fetch request to get the song of the day. Fetch runs asynchronously.
        // The .then() method is called when the fetch request is complete
        // and proceeds to convert the result to a JSON which is finally placed in state.
        setTop20([]);
        fetch(`http://${config.server_host}:${config.server_port}/top20ForGenre/${genre}/${type}`)
            .then(res => res.json())
            .then(resJson => setTop20(resJson));

    }, [genre, type]);
    return (
        <Grid
            item
            xs={12}
            sm={12}
            md={4}
        >
            <Card>
                <CardHeader
                    title={genre}
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
                        {top20.map((d, index) => (
                            index < 5 &&
                            <Typography
                                component="li"
                                variant="subtitle1"
                                align="center"
                                key={d.primaryTitle + ":" + d.averageRating}
                            >
                                <Link to={`/ProductionInfo/${d.titleId}`} style={{ textDecoration: 'none' }}>
                                    {d.primaryTitle + ":" + d.averageRating}
                                </Link>
                            </Typography>
                        ))}
                    </ol>
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



export default ProductionCard;