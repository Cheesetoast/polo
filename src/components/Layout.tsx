import { type ReactNode } from "react"
import styled from "styled-components"
import GlobalStyle from "../styles/globalStyles"
import { theme } from "../styles/theme"
import { AppSidebar } from "./AppSidebar"
import Footer from "./Footer"

interface LayoutProps {
  children: ReactNode
  /** @deprecated No-op — site uses the dashboard shell. Kept for call-site compatibility. */
  transparentNavbar?: boolean
  /** @deprecated No-op — dashboard shell is always on. */
  variant?: "default" | "dashboard"
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <GlobalStyle />
    <Shell>
      <AppSidebar />
      <ContentColumn>
        <MainContent>{children}</MainContent>
        <Footer />
      </ContentColumn>
    </Shell>
  </>
)

export default Layout

const Shell = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 20% -10%, rgba(245, 192, 66, 0.08), transparent 50%),
    radial-gradient(ellipse 60% 40% at 90% 10%, rgba(232, 90, 79, 0.1), transparent 45%),
    ${theme.colors.background};
  color: ${theme.colors.primary};
  font-family: ${theme.fontFamily};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
`

const MainContent = styled.main`
  position: relative;
  isolation: isolate;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  max-width: 100%;
  overflow-x: clip;
  padding: 1.75rem 2rem 2rem;

  @media (max-width: 900px) {
    padding: 1.25rem 1rem 1.75rem;
  }
`
