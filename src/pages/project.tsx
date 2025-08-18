import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"

const ProjectPage = () => {
  return (
    <Layout>
      <main>
        <ContentWrapper>
          <Text variant="h1">Projects</Text>
          <Text variant="p">
            This is where I showcase my projects and work.
          </Text>
        </ContentWrapper>
      </main>
    </Layout>
  )
}

export default ProjectPage

export const Head: HeadFC = () => (
  <SEO 
    title="Project Name"
    description="Detailed description of this amazing project with all the technical details and outcomes."
    keywords={['project', 'web development', 'react', 'typescript', 'case study']}
    type="article"
    author="Your Name"
    publishedTime="2024-01-15T00:00:00.000Z"
    modifiedTime="2024-01-20T00:00:00.000Z"
  />
) 