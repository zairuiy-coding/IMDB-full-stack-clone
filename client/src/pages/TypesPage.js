import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function TypesPage() {
  const types = ['Movies', 'Shorts', 'TV Series'];

  // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to be displayed 
  // side-by-side and wrap to the next line when the screen is too narrow.
  // Flexboxes are incredibly powerful. You can learn more on MDN web docs linked below (or many other online 
  // resources).
  // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Container style={flexFormat}>
      {types.map((type) =>
        <Box
          key={type}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          <h4><NavLink to={`/search_productions/${type}`}>{type}</NavLink></h4>
        </Box>
      )}
    </Container>
  );
};
