import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Button } from "../components/Button"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"
import { BookBoardContainer } from "../components/BookBoardContainer"
import { ButtonContainer } from "../components/ButtonContainer"
import booksData from "../data/books.json"

interface Book {
  title: string;
  author: string;
  description: {
    description: string;
  };
  image?: {
    gatsbyImageData: any;
    title?: string;
  } | null;
  isbn: string;
  rating?: number;
  genre?: string;
  progress?: number;
  dateStarted?: string | null;
  dateFinished?: string | null;
  type?: string;
}

const IndexPage = () => {
  const books: Book[] = booksData;

  return (
    <Layout>
      <main>
        <ContentWrapper>
          <div>
            <Text variant="h1">
              {SITE_CONFIG.SITE_NAME}
            </Text>
          </div>

          <ButtonContainer alignment="start">
            <Button>Click me</Button>
          </ButtonContainer>

          <BookBoardContainer books={books} title="My Reading List" />

        </ContentWrapper>

      </main>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <SEO
    title={SITE_CONFIG.SITE_NAME}
    description="Welcome to my portfolio showcasing my work and projects."
    keywords={['portfolio', 'web development', 'design', 'react', 'gatsby']}
  />
)