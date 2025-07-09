import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Progettone Finale React - Valerio Bottari</p>
    </footer>
  );
};

export default Footer;