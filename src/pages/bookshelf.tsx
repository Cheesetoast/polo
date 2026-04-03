import { useMemo } from "react"
import { navigate } from "gatsby"
import styled from "styled-components"
import Layout from "../components/Layout"
import { ContentWrapper } from "../components/ContentWrapper"
import { Text } from "../components/Text"
import { Eyebrow } from "../components/Eyebrow"
import { BookBoardClient } from "../components/BookBoardClient"
import { Button } from "../components/Button"
import { useBookStatus } from "../hooks/useBookStatus"
import booksData from "../data/books.json"
import { theme } from "../styles/theme"
import {
  sectionSurfaceProminent,
  sectionSurfaceSoft,
} from "../styles/surfaceStyles"

const BOOKS_DATA = booksData

const BookshelfPage = () => {
  const { booksWithStatus, updateBookStatus, resetStatuses, clearLocalStorage } =
    useBookStatus(BOOKS_DATA)

  const booksWithAssignedStatus = useMemo(
    () => booksWithStatus.filter((book) => book.status !== null),
    [booksWithStatus]
  )

  const counts = useMemo(() => {
    const list = booksWithAssignedStatus
    return {
      total: list.length,
      want: list.filter((b) => b.status === "want-to-read").length,
      reading: list.filter((b) => b.status === "currently-reading").length,
      finished: list.filter((b) => b.status === "finished").length,
    }
  }, [booksWithAssignedStatus])

  return (
    <Layout>
      <main>
        <ContentWrapper>
          <PageIntro>
            <Eyebrow variant="accent">Your shelf</Eyebrow>
            <Text variant="h1">My Bookshelf</Text>
            <IntroLead>
              Organize your reading journey with simple columns that match your home
              dashboard.
            </IntroLead>
          </PageIntro>

          <BoardSection>
            <BoardSectionLead>
              <Eyebrow variant="neutral">Board</Eyebrow>
              <Text variant="h2">Reading columns</Text>
              <Text variant="p" color="secondary">
                Set status per book. Changes stay in this browser until you reset.
              </Text>
            </BoardSectionLead>

            {booksWithAssignedStatus.length > 0 ? (
              <BoardMount>
                <BookBoardClient
                  booksWithStatus={booksWithStatus}
                  updateBookStatus={updateBookStatus}
                />
              </BoardMount>
            ) : (
              <EmptyState>
                <Text variant="h3">No books organized yet</Text>
                <Text variant="p" color="secondary">
                  Start from search. Assign want to read, reading, or finished and the
                  columns will fill in.
                </Text>
                <Button type="button" onClick={() => navigate("/search")} variant="primary">
                  Find your next book
                </Button>
              </EmptyState>
            )}

            <StatsGrid>
              <StatCard>
                <StatValue>{counts.total}</StatValue>
                <StatLabel>Organized</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{counts.want}</StatValue>
                <StatLabel>Want to read</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{counts.reading}</StatValue>
                <StatLabel>Reading</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{counts.finished}</StatValue>
                <StatLabel>Finished</StatLabel>
              </StatCard>
            </StatsGrid>

            <ActionRow>
              <Button type="button" onClick={() => navigate("/search")} variant="primary">
                Add more books
              </Button>
              <Button type="button" onClick={() => navigate("/")} variant="outline">
                Back to home
              </Button>
            </ActionRow>
          </BoardSection>

          <ManagementSection>
            <Eyebrow variant="neutral">Management</Eyebrow>
            <Text variant="h3">Bookshelf management</Text>
            <Text variant="p" color="secondary">
              Reset all statuses or clear stored data if you want a clean slate.
            </Text>
            <ManagementButtons>
              <Button type="button" onClick={resetStatuses} variant="outline">
                Reset all statuses
              </Button>
              <Button type="button" onClick={clearLocalStorage} variant="outline">
                Clear local storage
              </Button>
            </ManagementButtons>
          </ManagementSection>
        </ContentWrapper>
      </main>
    </Layout>
  )
}

export default BookshelfPage

const PageIntro = styled.div`
  width: 100%;
  max-width: 42rem;
  margin: 0 0 ${theme.spacing.lg};
  padding-top: ${theme.spacing.xs};
  text-align: left;

  @media (min-width: 900px) {
    max-width: 720px;
    margin: 0 0 ${theme.spacing.xl};
    padding-top: ${theme.spacing.sm};
  }
`

const IntroLead = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeights.lg};
  color: ${theme.colors.secondary};
  max-width: 52ch;
`

const BoardSection = styled.section`
  margin: ${theme.spacing.md} 0 ${theme.spacing.xl};
  padding: ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.lg};
  text-align: left;
  ${sectionSurfaceProminent}

  @media (min-width: 768px) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing.xl};
  }
`

const BoardSectionLead = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.md};
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.sm};
  margin: ${theme.spacing.lg} 0 ${theme.spacing.md};
  width: 100%;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

const StatCard = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
`

const StatValue = styled.div`
  font-size: ${theme.fontSizes["3xl"]};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary};
  line-height: 1.15;
`

const StatLabel = styled.div`
  margin-top: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.medium};
`

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-bottom: 0;

  @media (max-width: 899px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const BoardMount = styled.div`
  min-width: 0;
`

const EmptyState = styled.div`
  margin-top: 0;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  text-align: center;
  border-radius: ${theme.borderRadius.lg};
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid ${theme.colors.border};

  h3 {
    margin-bottom: ${theme.spacing.sm};
  }

  p {
    margin-bottom: ${theme.spacing.lg};
    max-width: 36rem;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 899px) {
    button {
      width: 100%;
    }
  }
`

const ManagementSection = styled.section`
  margin: ${theme.spacing.xl} 0;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  text-align: left;
  ${sectionSurfaceSoft}

  @media (min-width: 768px) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`

const ManagementButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};

  @media (max-width: 899px) {
    flex-direction: column;
    align-items: stretch;
  }
`
