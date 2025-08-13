import React from 'react';
import GlobalStyle from '../styles/globalStyles';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  transparentNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, transparentNavbar = false }) => (
  <>
    <GlobalStyle />
    <Navbar transparent={transparentNavbar} />
    <main style={{ paddingTop: '70px' }}>
      {children}
    </main>
  </>
);

export default Layout;