import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

// function Title(props) {
//   return (
//     <Typography component="h2" variant="h4" color="primary" gutterBottom>
//       {props.children}
//     </Typography>
//   );
// }
function Title(props) {
    return (
      <Typography
        component="h2"
        variant="h4"
        color="primary" // Change to your desired text color
        fontWeight="bold"
        letterSpacing="0.1em"
        mt={4} // Adjust the margin-top for spacing
        gutterBottom
      >
        {props.children}
      </Typography>
    );
  }

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;