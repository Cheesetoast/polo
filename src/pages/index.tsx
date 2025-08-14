import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Button } from "../components/Button"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"
import BooksContainer from "../components/BooksContainer"
import { ButtonContainer } from "../components/ButtonContainer"


interface HomepageData {
  allContentfulHomepage: {
    nodes: Array<{
      title: string;
    }>;
  };
  allContentfulBook: {
    nodes: Array<{
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
    }>;
  };
}

const IndexPage: React.FC<PageProps<HomepageData>> = ({ data }) => {
  const homepage = data?.allContentfulHomepage?.nodes?.[0];
  const books = data?.allContentfulBook?.nodes || [];

  return (
    <Layout>
      <main>
        <ContentWrapper>
          <div>
            <Text variant="h1">
              {homepage?.title}
            </Text>
          </div>

          <ButtonContainer alignment="start">
            <Button>Click me</Button>
          </ButtonContainer>

          {/* Books Section */}
          <BooksContainer books={books} />

        </ContentWrapper>

      </main>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <SEO
    title={SITE_CONFIG.TITLE}
    description="Welcome to my portfolio showcasing my work and projects."
    keywords={['portfolio', 'web development', 'design', 'react', 'gatsby']}
  />
)

export const query = graphql`
  query HomepageQuery {
    allContentfulHomepage {
      nodes {
        title
      }
    }
    allContentfulBook {
      nodes {
        title
        author
        isbn
        description {
          description
        }
        image {
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 300
          )
          title
        }
      }
    }
  }
`;