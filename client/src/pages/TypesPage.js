import { Box, Container, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function TypesPage() {
  const types = ['Movies', 'Shorts', 'TV Series'];

  const flexFormat = {
    display: 'flex',
    flexDirection: 'column', // Change to column to place subtitle and boxes vertically
    alignItems: 'center',
    minHeight: '90vh', // Adjust height to move content up
    justifyContent: 'flex-start', // Move content to the start of the container
    paddingTop: '150px', // Add some padding at the top
  };

  const boxContainerStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
  };

  const boxStyle = {
    background: 'grey', // Set the background color to grey
    borderRadius: '16px',
    border: '2px solid grey', // Set the border color to grey
    color: 'white', // Set the text color to white
    textAlign: 'center', // Center the text
    fontSize: '22px',
    margin: '20px', // Increase the spacing between boxes
    padding: '20px', // Add padding to make the boxes larger
    transition: 'transform 0.2s', // Add transition for hover effect
  };

  const boxHoverStyle = {
    transform: 'scale(1.1)', // Increase the size slightly on hover
  };

  const subtitleStyle = {
    marginBottom: '20px', // Adjust the spacing between subtitle and boxes
    textAlign: 'center',
    fontSize: '24px', // Add styling to the subtitle
    fontWeight: 'bold',
  };

  return (
    <Container style={flexFormat}>
      <Typography variant="h6" style={subtitleStyle}>
        Choose a Production Type to Search For
      </Typography>
      <Container style={boxContainerStyle}>
        {types.map((type) =>
          <Box
            key={type}
            p={3}
            m={2}
            style={boxStyle}
            sx={{
              '&:hover': boxHoverStyle, // Apply hover effect
            }}
          >
            <h4>
              <NavLink to={`/search_productions/${type}`} style={{ color: 'white' }}>
                {type}
              </NavLink>
            </h4>
          </Box>
        )}
      </Container>
    </Container>
  );
};
