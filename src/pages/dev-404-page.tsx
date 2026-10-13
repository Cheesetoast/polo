import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ButtonContainer } from '../components/ButtonContainer';
import Layout from '../components/Layout';
import { ContentWrapper } from '../components/ContentWrapper';
import { theme } from '../styles/theme';
import { projectIntroCard } from '../styles/surfaceStyles';

const Dev404Page = () => {
  return (
    <Layout>
      <main>
        <ContentWrapper>
          <Dev404Container>
            <Dev404Title variant="h1">404</Dev404Title>
            <Dev404Subtitle variant="h2">Page Not Found</Dev404Subtitle>
            <Dev404Description variant="p">
              Well, this is awkward... The page you're looking for seems to have gone on a coffee
              break and never came back. Maybe it's debugging somewhere else?
            </Dev404Description>

            <ButtonContainer direction="row" spacing="md">
              <Button variant="primary" onClick={() => navigate('/')}>
                Go Home
              </Button>
              <Button variant="secondary" onClick={() => navigate('/search')}>
                Search Books
              </Button>
              <Button variant="outline" onClick={() => navigate('/bookshelf')}>
                View Bookshelf
              </Button>
            </ButtonContainer>

            <Dev404Caption variant="caption" color="secondary">
              This is the development 404 page. In production, you'll see a much fancier version!
            </Dev404Caption>
          </Dev404Container>
        </ContentWrapper>
      </main>
    </Layout>
  );
};

export default Dev404Page;

const Dev404Container = styled.div`
  ${projectIntroCard}
  padding: ${theme.spacing["2xl"]};
  text-align: center;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Dev404Title = styled(Text)`
  font-size: clamp(4rem, 12vw, 6rem);
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.coral};
`;

const Dev404Subtitle = styled(Text)`
  margin-bottom: ${theme.spacing.md};
`;

const Dev404Description = styled(Text)`
  margin-bottom: ${theme.spacing.xl};
  max-width: 500px;
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeights.lg};
`;

const Dev404Caption = styled(Text)`
  margin-top: ${theme.spacing["2xl"]};
  font-size: ${theme.fontSizes.sm};
`;
