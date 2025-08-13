import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const ProjectPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <main>
        <h1>Project Details</h1>
        <p>This is an example project page showing how to use the SEO component.</p>
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