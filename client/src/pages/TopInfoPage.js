
import { Box, Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";



export default function TopInfoPage() {
    const location = useLocation()
    const { data } = location.state;
    // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
    // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
    // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
    // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
    const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

    return (
        // TODO (TASK 22): replace the empty object {} in the Container's style property with flexFormat. Observe the change to the Albums page.
        // TODO (TASK 22): then uncomment the code to display the cover image and once again observe the change, i.e. what happens to the layout now that each album card has a fixed width?
        // This task is just to help you better understand formatting dynamically displayed data. No written explanation of the effects is necessary.

        <Container style={{ flexFormat }}>
            {data.map((prod, index) =>
                <Box
                    key={prod.titlleId}
                    p={8}
                    m={2}
                    style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', display:'flex'}}
                >
                    <div style={{ width:'50%'}}>
                    <Link to={`/ProductionInfo/${prod.titleId}`} style={{ textDecoration: 'underline', color: 'inherit' }}>
                        <h3>Title: {prod.primaryTitle}</h3>
                    </Link>
                        <h3>Year: {prod.startYear}</h3>
                        <h3>Rating: {prod.averageRating}</h3>
                    </div>
                    <div style={{ width:'50%', textAlign:'right'}}>
                        <br></br>
                        <h1>{index + 1}</h1>
                    </div>

                </Box>
            )}
        </Container>
    );
}