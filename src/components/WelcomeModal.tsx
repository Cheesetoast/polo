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
            Welcome to Graham's Demo Site 📚
          </Text>
        </ModalHeader>
        
        <ModalBody>
          <Text variant="p" align="center" color="secondary">
          This site is built with <b>Gatsby</b>, <b>React</b>, and <b>TypeScript</b>, with content managed through <b>Contentful</b>   as a headless CMS. The bookshelf section is an interactive Kanban board that saves your reading progress locally using browser storage.
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
  padding: ${theme.spacing.md};
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid ${theme.colors.muted};
`;

const ModalHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const ModalBody = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: #f9fafb;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.muted};
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.muted};
`;
