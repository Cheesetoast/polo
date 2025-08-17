import React from 'react';
import styled from 'styled-components';
import GlobalStyle from '../styles/globalStyles';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  transparentNavbar?: boolean;
}

const MainContent = styled.main`
  padding-top: 100px;
  min-height: calc(100vh - 100px);
  
  @media (min-width: 768px) {
    padding-top: 120px;
    min-height: calc(100vh - 120px);
  }
`;

const Layout = ({ children, transparentNavbar = false }: LayoutProps) => (
  <>
    <GlobalStyle />
    <Navbar transparent={transparentNavbar} />
    <MainContent>
      {children}
    </MainContent>
  </>
);

export default Layout;