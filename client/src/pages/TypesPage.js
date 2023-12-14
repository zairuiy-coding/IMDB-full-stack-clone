import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function TypesPage() {
  const types = ['Movies', 'Shorts', 'TV Series'];

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to be displayed 
  // side-by-side and wrap to the next line when the screen is too narrow.
  // Flexboxes are incredibly powerful. You can learn more on MDN web docs linked below (or many other online 
  // resources).
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  // const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', height: '15vh'};

  const flexFormat = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    // justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // Use minHeight to center vertically
  };

  return (
    <Container style={flexFormat}>
      {types.map((type) =>
        <Box
          key={type}
          p={3}
          m={2}
          // style={{ background: 'black', borderRadius: '16px', border: '2px solid #000' }}
          style={{
            background: 'black',
            borderRadius: '16px',
            border: '2px solid #000',
            color: 'red', // Set the text color to red
            textAlign: 'center', // Center the text
            fontSize: '22px',
          }}
        >
          {/* <h4><NavLink to={`/search_productions/${type}`}>{type}</NavLink></h4> */}
          <h4>
              <NavLink to={`/search_productions/${type}`} style={{ color: 'red' }}>
                {type}
              </NavLink>
          </h4>
        </Box>
      )}
    </Container>
  );


};
