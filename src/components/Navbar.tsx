import { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { SITE_CONFIG } from '../constants';
import { rgba, theme } from '../styles/theme';

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavbarProps {
  transparent?: boolean;
}

const MOBILE_NAV_MQ = '(max-width: 768px)';

const Navbar = ({ transparent = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /** Avoid animating menu open/opacity when crossing the mobile breakpoint (resize flash). */
  const [suppressMobileMenuTransition, setSuppressMobileMenuTransition] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: 'Bookshelf', href: '/bookshelf' },
    { label: 'Authors', href: '/authors' },
    { label: 'Genres', href: '/genres' },
    { label: 'Styleguide', href: '/styleguide' },
  ];

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 50;
          setScrolled(isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(MOBILE_NAV_MQ);
    if (typeof mq.addEventListener !== 'function') return;

    const onViewportChange = () => {
      setSuppressMobileMenuTransition(true);
      setIsOpen(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSuppressMobileMenuTransition(false));
      });
    };

    mq.addEventListener('change', onViewportChange);
    return () => mq.removeEventListener('change', onViewportChange);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <NavContainer transparent={transparent} scrolled={scrolled}>
      <NavContent>
        <LogoLink to="/" onClick={closeMenu}>
          {SITE_CONFIG.SITE_NAME}
        </LogoLink>

        <NavLinks isOpen={isOpen} suppressTransition={suppressMobileMenuTransition}>
          {navItems.map((item) => (
            <NavLink key={item.href}>
              {item.external ? (
                <NavLinkAnchor 
                  href={item.href} 
                  onClick={closeMenu}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </NavLinkAnchor>
              ) : (
                <NavLinkGatsby 
                  to={item.href} 
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLinkGatsby>
              )}
            </NavLink>
          ))}
        </NavLinks>

        <HamburgerButton onClick={toggleMenu} isOpen={isOpen}>
          <HamburgerLine />
          <HamburgerLine />
          <HamburgerLine />
        </HamburgerButton>
      </NavContent>
    </NavContainer>
  );
};

// Styled Components
const NavContainer = styled.nav.withConfig({
  shouldForwardProp: (prop) => !['transparent', 'scrolled'].includes(prop),
})<{ transparent: boolean; scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  background: ${({ transparent, scrolled }) =>
    transparent && !scrolled
      ? 'transparent'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 255, 0.88) 100%)'};
  backdrop-filter: ${({ transparent, scrolled }) =>
    transparent && !scrolled ? 'none' : 'blur(20px) saturate(180%)'};
  -webkit-backdrop-filter: ${({ transparent, scrolled }) =>
    transparent && !scrolled ? 'none' : 'blur(20px) saturate(180%)'};
  border-bottom: ${({ transparent, scrolled }) =>
    transparent && !scrolled ? 'none' : `1px solid ${rgba.indigo(0.14)}`};
  box-shadow: ${({ transparent, scrolled }) =>
    transparent && !scrolled
      ? 'none'
      : `0 1px 0 rgba(255, 255, 255, 0.65), 0 4px 24px ${rgba.indigo(0.08)}`};
`;

const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const LogoLink = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: ${theme.fontFamily};
  letter-spacing: -0.02em;
  color: ${theme.colors.primary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.blue[500]};
  }
`;

const NavLinks = styled.ul.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== 'suppressTransition',
})<{ isOpen: boolean; suppressTransition?: boolean }>`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.97) 0%,
      rgba(248, 248, 250, 0.94) 45%,
      rgba(245, 245, 247, 0.9) 100%
    );
    backdrop-filter: blur(20px) saturate(180%);
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    gap: 1.5rem;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-100%)')};
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transition: ${({ suppressTransition }) =>
      suppressTransition
        ? 'none'
        : 'transform 0.3s ease, opacity 0.3s ease, visibility 0s linear 0.3s'};

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    border-bottom: 1px solid ${theme.colors.border};
  }
`;

const NavLink = styled.li`
  margin: 0;
`;

const NavLinkAnchor = styled.a`
  color: ${theme.colors.secondary};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.01em;
  font-family: ${theme.fontFamily};
  transition: color 0.2s ease;
  position: relative;

  &:hover {
    color: ${theme.colors.primary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${theme.colors.blue[500]};
    border-radius: 2px;
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    
    &::after {
      display: none;
    }
  }
`;

const NavLinkGatsby = styled(Link)`
  color: ${theme.colors.secondary};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.01em;
  font-family: ${theme.fontFamily};
  transition: color 0.2s ease;
  position: relative;

  &:hover {
    color: ${theme.colors.primary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${theme.colors.blue[500]};
    border-radius: 2px;
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    
    &::after {
      display: none;
    }
  }
`;

const HamburgerButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  @media (max-width: 768px) {
    display: flex;
  }

  &:focus {
    outline: none;
  }
`;

const HamburgerLine = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen?: boolean }>`
  width: 2rem;
  height: 0.2rem;
  background: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.full};
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;

  &:first-child {
    transform: ${({ isOpen }) => 
      isOpen ? 'rotate(45deg)' : 'rotate(0)'};
  }

  &:nth-child(2) {
    opacity: ${({ isOpen }) => 
      isOpen ? '0' : '1'};
    transform: ${({ isOpen }) => 
      isOpen ? 'translateX(20px)' : 'translateX(0)'};
  }

  &:nth-child(3) {
    transform: ${({ isOpen }) => 
      isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
  }
`;

export default Navbar;
