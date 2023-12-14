import React, { useEffect } from 'react';
import { Link } from "react-router-dom";


const StartPage = () => {
  useEffect(() => {
    // Replace 'your-image-url.jpg' with the actual URL of your background image
    document.body.style.backgroundImage = "url()";
  }, []);

//   const handleStartClick = () => {
//     // Add any functionality you want when the button is clicked
//     alert("Button clicked!");
//   };

  return (
    <div style={styles.container}>
      <Link to="/movie">
        <button style={styles.startButton} >
        {/* onClick={handleStartClick} */}
          Start Now
        </button>
      </Link>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
    padding: 0,
    backgroundImage: "url(/startbg.png)",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
  },
  startButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    fontSize: '20px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '42vh', // Adjust the margin as needed
  },
};

export default StartPage;