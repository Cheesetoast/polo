import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { ContentWrapper } from "../components/ContentWrapper"
import styled from "styled-components"
import { projectIntroCard } from "../styles/surfaceStyles"

const ProjectPage = () => {
  return (
    <Layout>
      <main>
        <ContentWrapper>
          <ProjectCard>
            <Text variant="h1">Projects</Text>
            <Text variant="p">
              This is where I showcase my projects and work.
            </Text>
          </ProjectCard>
        </ContentWrapper>
      </main>
    </Layout>
  )
}

const ProjectCard = styled.div`
  ${projectIntroCard}
`

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