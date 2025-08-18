import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"

const NotFoundPage = () => {
  return (
    <Layout>
      <main>
        <ContentWrapper>
          <Text variant="h1">Page Not Found</Text>
          <Text variant="p">
            Sorry, the page you're looking for doesn't exist.
          </Text>
        </ContentWrapper>
      </main>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
