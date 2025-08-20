import type { HeadFC, PageProps } from "gatsby"
import { navigate } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { Button } from "../components/Button"
import { ButtonContainer } from "../components/ButtonContainer"
import Navbar from "../components/Navbar"
import { SITE_CONFIG } from "../constants"

const NotFoundPage = () => {
  return (
    <Layout>
      <Navbar />
      <main>
        <ContentWrapper>
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 0',
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
              Oops! Looks like this page took a detour to the fiction section when it should have been in non-fiction. 
              Maybe it's playing hide and seek with the other missing pages? 📚🔍
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
              If you believe this page should exist, please check the URL or try navigating from the homepage.
            </Text>
          </div>
        </ContentWrapper>
      </main>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => (
  <SEO 
    title="Page Not Found - 404" 
    description="The page you're looking for doesn't exist. Navigate back to our book collection."
  />
)
