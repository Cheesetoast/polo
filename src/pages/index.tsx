import type { HeadFC } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { WelcomeModal } from "../components/WelcomeModal"
import { HomeDashboard } from "../components/HomeDashboard"
import { SITE_CONFIG, MODAL_CONFIG } from "../constants"

const IndexPage = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => {
    if (MODAL_CONFIG.ENABLE_MODAL_DISMISS) {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true)
      }
    } else {
      setShowWelcomeModal(true)
    }
  }, [])

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false)
    if (MODAL_CONFIG.ENABLE_MODAL_DISMISS) {
      localStorage.setItem("hasSeenWelcome", "true")
    }
  }

  const data = useStaticQuery(graphql`
    query HomepageQuery {
      contentfulHomepage {
        title
      }
    }
  `)

  const homepageTitle = data?.contentfulHomepage?.title

  return (
    <Layout>
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
      />
      <HomeDashboard homepageTitle={homepageTitle} />
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <SEO
    title={SITE_CONFIG.SITE_NAME}
    description="Welcome to my portfolio showcasing my work and projects."
    keywords={["portfolio", "web development", "design", "react", "gatsby"]}
  />
)
