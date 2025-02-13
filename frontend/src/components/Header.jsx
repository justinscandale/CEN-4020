import React from 'react';
//import { Link } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Add your logout logic here
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Add your login logic here
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>CEN-4020</div>
      <div style={styles.buttons}>
        <button style={styles.button}>Home</button>
        {isLoggedIn ? (
          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#282c34',
    color: 'white',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#61dafb',
    color: '#282c34',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default Header;