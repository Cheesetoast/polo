import type { HeadFC, PageProps } from "gatsby"
import styled from "styled-components"
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
          <NotFoundContainer>
            <NotFoundTitle variant="h1">
              404
            </NotFoundTitle>
            <NotFoundSubtitle variant="h2">
              Page Not Found
            </NotFoundSubtitle>
            <NotFoundDescription variant="p">
              Oops! Looks like this page took a detour to the fiction section when it should have been in non-fiction. 
              Maybe it's playing hide and seek with the other missing pages? 📚🔍
            </NotFoundDescription>
            
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
            
            <NotFoundCaption variant="caption">
              If you believe this page should exist, please check the URL or try navigating from the homepage.
            </NotFoundCaption>
          </NotFoundContainer>
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

// Styled Components
const NotFoundContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NotFoundTitle = styled(Text)`
  font-size: 6rem;
  margin-bottom: 1rem;
  color: #e74c3c;
`;

const NotFoundSubtitle = styled(Text)`
  margin-bottom: 1rem;
`;

const NotFoundDescription = styled(Text)`
  margin-bottom: 2rem;
  max-width: 500px;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const NotFoundCaption = styled(Text)`
  margin-top: 3rem;
  color: #666;
  font-size: 0.9rem;
`;
