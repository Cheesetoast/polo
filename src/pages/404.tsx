import type { HeadFC } from "gatsby"
import styled from "styled-components"
import { navigate } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { Button } from "../components/Button"
import { ButtonContainer } from "../components/ButtonContainer"
import { SITE_CONFIG } from "../constants"
import { theme } from "../styles/theme"
import { projectIntroCard } from "../styles/surfaceStyles"

const NotFoundPage = () => {
  return (
    <Layout>
      <main>
        <ContentWrapper>
          <NotFoundContainer>
            <NotFoundTitle variant="h1">404</NotFoundTitle>
            <NotFoundSubtitle variant="h2">Page Not Found</NotFoundSubtitle>
            <NotFoundDescription variant="p">
              Oops! Looks like this page took a detour to the fiction section when it should have
              been in non-fiction. Maybe it's playing hide and seek with the other missing pages?
            </NotFoundDescription>

            <ButtonContainer direction="row" spacing="md">
              <Button variant="primary" onClick={() => navigate("/")}>
                Go Home
              </Button>
              <Button variant="secondary" onClick={() => navigate("/search")}>
                Search Books
              </Button>
              <Button variant="outline" onClick={() => navigate("/bookshelf")}>
                View Bookshelf
              </Button>
            </ButtonContainer>

            <NotFoundCaption variant="caption" color="secondary">
              If you believe this page should exist, please check the URL or try navigating from the
              homepage.
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
    title={`Page Not Found - 404 | ${SITE_CONFIG.SITE_NAME}`}
    description="The page you're looking for doesn't exist. Navigate back to our book collection."
  />
)

const NotFoundContainer = styled.div`
  ${projectIntroCard}
  text-align: center;
  padding: ${theme.spacing["2xl"]};
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const NotFoundTitle = styled(Text)`
  font-size: clamp(4rem, 12vw, 6rem);
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.coral};
`

const NotFoundSubtitle = styled(Text)`
  margin-bottom: ${theme.spacing.md};
`

const NotFoundDescription = styled(Text)`
  margin-bottom: ${theme.spacing.xl};
  max-width: 500px;
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeights.lg};
`

const NotFoundCaption = styled(Text)`
  margin-top: ${theme.spacing["2xl"]};
  font-size: ${theme.fontSizes.sm};
`
