import { type ReactNode } from 'react';
import styled from 'styled-components';
import GlobalStyle from '../styles/globalStyles';
import { mainBackdrop } from '../styles/surfaceStyles';
import { theme } from '../styles/theme';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  transparentNavbar?: boolean;
}

const Layout = ({ children, transparentNavbar = false }: LayoutProps) => (
  <>
    <GlobalStyle />
    <Navbar transparent={transparentNavbar} />
    <LayoutBody>
      <MainContent>{children}</MainContent>
      <Footer />
    </LayoutBody>
  </>
);

export default Layout;

// Styled Components — flex column so footer sits under content without a bogus min-height gap
const LayoutBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  position: relative;
  isolation: isolate;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  max-width: 100%;
  overflow-x: clip;
  ${mainBackdrop}
  padding-top: 100px;
  padding-bottom: ${theme.spacing.xl};

  @media (min-width: 768px) {
    padding-top: 120px;
    padding-bottom: ${theme.spacing['2xl']};
  }
`;