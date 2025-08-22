import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ButtonContainer } from '../components/ButtonContainer';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';
import { ContentWrapper } from '../components/ContentWrapper';

const Dev404Page = () => {
  return (
    <Layout>
      <Navbar />
      <main>
        <ContentWrapper>
          <Dev404Container>
      <Dev404Title variant="h1">
        404
      </Dev404Title>
      <Dev404Subtitle variant="h2">
        Page Not Found
      </Dev404Subtitle>
      <Dev404Description variant="p">
        Well, this is awkward... The page you're looking for seems to have gone on a coffee break 
        and never came back. Maybe it's debugging somewhere else? ☕🐛
      </Dev404Description>
      
      <ButtonContainer direction="row" spacing="md">
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/search')}
        >
          Search Books
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/bookshelf')}
        >
          View Bookshelf
        </Button>
      </ButtonContainer>
      
            <Dev404Caption variant="caption">
              This is the development 404 page. In production, you'll see a much fancier version! 🚀
            </Dev404Caption>
          </Dev404Container>
        </ContentWrapper>
      </main>
    </Layout>
  );
};

export default Dev404Page;

// Styled Components
const Dev404Container = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Dev404Title = styled(Text)`
  font-size: 6rem;
  margin-bottom: 1rem;
  color: #e74c3c;
`;

const Dev404Subtitle = styled(Text)`
  margin-bottom: 1rem;
`;

const Dev404Description = styled(Text)`
  margin-bottom: 2rem;
  max-width: 500px;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Dev404Caption = styled(Text)`
  margin-top: 3rem;
  color: #666;
  font-size: 0.9rem;
`;
