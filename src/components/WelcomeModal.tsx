import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Text } from './Text';
import { Button } from './Button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Text variant="h3" align="center">
            Welcome to Graham's Demo Site 📚 (Work in progress)
          </Text>
        </ModalHeader>

        <ModalBody>
          <Text variant="p" align="center" color="secondary">
            Built with <strong>Gatsby</strong>, <strong>React</strong>, and <strong>TypeScript</strong>, with content managed through <strong>Contentful</strong> as a headless CMS. The project also includes unit tests written in <strong>Jest</strong> to ensure reliability and maintainable code. View on <StyledLink href="https://github.com/Cheesetoast/polo" target="_blank" rel="noopener noreferrer">GitHub</StyledLink>.
          </Text>

          <FeatureList>
            <FeatureItem>
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureText>
                <Text variant="h5">Search & Discover</Text>
                <Text variant="p" color="secondary" size="sm">
                  Find your next great read from our curated collection
                </Text>
              </FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureText>
                <Text variant="h5">Visual Organization</Text>
                <Text variant="p" color="secondary" size="sm">
                  Use our Kanban board to track your reading progress
                </Text>
              </FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>📈</FeatureIcon>
              <FeatureText>
                <Text variant="h5">Reading Insights</Text>
                <Text variant="p" color="secondary" size="sm">
                  Monitor your reading habits and discover your favorite genres
                </Text>
              </FeatureText>
            </FeatureItem>
          </FeatureList>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="primary" size="large">
            Get Started
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.sm};
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid ${theme.colors.muted};
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
    max-height: 95vh;
    margin: ${theme.spacing.sm};
  }
`;

const ModalHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    margin-bottom: ${theme.spacing.md};
    
    h2 {
      font-size: 1.5rem !important;
      line-height: 1.3 !important;
    }
  }
`;

const ModalBody = styled.div`
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    margin-bottom: ${theme.spacing.md};
    
    p {
      font-size: 0.9rem !important;
      line-height: 1.4 !important;
    }
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: #f9fafb;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.muted};
  
  @media (max-width: 768px) {
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm};
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    
    h5 {
      font-size: 1rem !important;
      line-height: 1.3 !important;
      margin-bottom: 0.25rem !important;
    }
    
    p {
      font-size: 0.8rem !important;
      line-height: 1.4 !important;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FeatureText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  
  @media (max-width: 768px) {
    align-items: flex-start;
    text-align: left;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.muted};
  
  @media (max-width: 768px) {
    padding-top: ${theme.spacing.md};
  }
`;

const StyledLink = styled.a`
  color: ${theme.colors.primary};
  text-decoration: none;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 4px;
  background: ${theme.colors.primary}10;
  transition: all 0.2s ease;
  
  &:hover {
    text-decoration: underline;
    background: ${theme.colors.primary}20;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;