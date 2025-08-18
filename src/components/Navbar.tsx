import { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { SITE_CONFIG } from '../constants';

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: 'https://blog.example.com', external: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <NavContainer transparent={transparent} scrolled={scrolled}>
      <NavContent>
        <LogoLink to="/" onClick={closeMenu}>
          {SITE_CONFIG.SITE_NAME}
        </LogoLink>

        <NavLinks isOpen={isOpen}>
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
const NavContainer = styled.nav<{ transparent: boolean; scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  background: ${({ transparent, scrolled }) => 
    transparent && !scrolled 
      ? 'transparent' 
      : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: ${({ transparent, scrolled }) => 
    transparent && !scrolled 
      ? 'none' 
      : 'blur(10px)'};
  border-bottom: ${({ transparent, scrolled }) => 
    transparent && !scrolled 
      ? 'none' 
      : '1px solid rgba(0, 0, 0, 0.1)'};
  box-shadow: ${({ transparent, scrolled }) => 
    transparent && !scrolled 
      ? 'none' 
      : '0 2px 20px rgba(0, 0, 0, 0.1)'};
`;

const NavContent = styled.div`
  max-width: 1200px;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #663399;
  }
`;

const NavLinks = styled.ul<{ isOpen: boolean }>`
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
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    gap: 1.5rem;
    transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${({ isOpen }) => isOpen ? '1' : '0'};
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled.li`
  margin: 0;
`;

const NavLinkAnchor = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #663399;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #663399;
    transition: width 0.3s ease;
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
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #663399;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #663399;
    transition: width 0.3s ease;
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

const HamburgerButton = styled.button<{ isOpen: boolean }>`
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

const HamburgerLine = styled.span<{ isOpen?: boolean }>`
  width: 2rem;
  height: 0.25rem;
  background: #333;
  border-radius: 10px;
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
