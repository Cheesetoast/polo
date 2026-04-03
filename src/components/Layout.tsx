import { type ReactNode } from 'react';
import styled from 'styled-components';
import GlobalStyle from '../styles/globalStyles';
import { mainCanvasSheenDrift } from '../styles/motion';
import { mainBackdrop } from '../styles/surfaceStyles';
import { rgba, theme } from '../styles/theme';
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
  ${mainBackdrop}
  padding-top: 100px;
  padding-bottom: ${theme.spacing.xl};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.42;
    background-image:
      radial-gradient(
        ellipse 92% 72% at 18% 28%,
        ${rgba.indigo(0.08)} 0%,
        transparent 56%
      ),
      radial-gradient(
        ellipse 88% 68% at 84% 72%,
        ${rgba.indigo(0.06)} 0%,
        transparent 54%
      ),
      radial-gradient(
        ellipse 75% 58% at 52% 48%,
        rgba(0, 0, 0, 0.03) 0%,
        transparent 48%
      );
    background-size: 165% 165%, 150% 150%, 190% 190%;
    background-repeat: no-repeat;
    background-position: 8% 24%, 92% 68%, 48% 88%;
    animation: ${mainCanvasSheenDrift} 68s ease-in-out infinite alternate;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
      opacity: 0.32;
    }
  }

  @media (min-width: 768px) {
    padding-top: 120px;
    padding-bottom: ${theme.spacing['2xl']};
  }
`;