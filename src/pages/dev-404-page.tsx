import React from 'react';
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
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
      <Text variant="h1" style={{ fontSize: '6rem', marginBottom: '1rem', color: '#e74c3c' }}>
        404
      </Text>
      <Text variant="h2" style={{ marginBottom: '1rem' }}>
        Page Not Found
      </Text>
      <Text variant="p" style={{ 
        marginBottom: '2rem', 
        maxWidth: '500px',
        fontSize: '1.1rem',
        lineHeight: '1.6'
      }}>
        Well, this is awkward... The page you're looking for seems to have gone on a coffee break 
        and never came back. Maybe it's debugging somewhere else? ☕🐛
      </Text>
      
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
      
            <Text variant="caption" style={{ 
              marginTop: '3rem',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              This is the development 404 page. In production, you'll see a much fancier version! 🚀
            </Text>
          </div>
        </ContentWrapper>
      </main>
    </Layout>
  );
};

export default Dev404Page;
