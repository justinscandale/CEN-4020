import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>CEN-4020</div>
      <div style={styles.buttons}>
        <Link to="/dashboard" style={styles.link}>
          <button style={styles.button}>Dashboard</button>
        </Link>
        <Link to="/login" style={styles.link}>
          <button style={styles.button}>Login</button>
        </Link>
        <Link to="/register" style={styles.link}>
          <button style={styles.button}>Register</button>
        </Link>
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
  link: {
    textDecoration: 'none',
  }
};

export default Header;