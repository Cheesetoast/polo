import { useEffect, useState } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { rgba, theme } from "../styles/theme"
import { Eyebrow } from "./Eyebrow"
import { ModuleInsetPanel } from "./ModuleInsetPanel"
import { Text } from "./Text"
import quotesData from "../data/literaryQuotes.json"

export interface LiteraryQuote {
  quote: string
  author: string
  authorId?: string
}

const QUOTES = quotesData as LiteraryQuote[]

export function HomepageAuthorQuote() {
  const [entry, setEntry] = useState<LiteraryQuote | null>(null)

  useEffect(() => {
    const i = Math.floor(Math.random() * QUOTES.length)
    setEntry(QUOTES[i] ?? null)
  }, [])

  return (
    <QuoteSurface>
      <Eyebrow variant="neutral">Literature</Eyebrow>
      <Text variant="h2">A line worth keeping</Text>
      <QuoteFigure aria-live="polite">
        {entry ? (
          <>
            <Blockquote cite={entry.authorId ? `/author/${entry.authorId}` : undefined}>
              <QuoteBody>“{entry.quote}”</QuoteBody>
            </Blockquote>
            <Attribution>
              {entry.authorId ? (
                <AuthorLink to={`/author/${entry.authorId}`}>{entry.author}</AuthorLink>
              ) : (
                <AuthorName>{entry.author}</AuthorName>
              )}
            </Attribution>
          </>
        ) : (
          <QuotePlaceholder>…</QuotePlaceholder>
        )}
      </QuoteFigure>
    </QuoteSurface>
  )
}

const QuoteSurface = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  & > h2 {
    margin-bottom: ${theme.spacing.lg};
  }
`

const QuoteFigure = styled(ModuleInsetPanel).attrs({
  as: "figure" as const,
  $tone: "neutral" as const,
  $size: "well" as const,
})`
  margin: 0;
  width: 100%;
  min-width: 0;
`

const Blockquote = styled.blockquote`
  margin: 0;
  padding: 0 0 0 ${theme.spacing.md};
  border-left: 3px solid ${rgba.indigo(0.4)};
`

const QuoteBody = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeights.lg};
  color: ${theme.colors.primary};
  font-style: italic;
`

const Attribution = styled.figcaption`
  margin: ${theme.spacing.md} 0 0 ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.secondary};
`

const AuthorLink = styled(Link)`
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.blue[500]};
  text-decoration: none;

  &::before {
    content: "— ";
    font-weight: ${theme.fontWeights.normal};
    color: ${theme.colors.muted};
  }

  &:hover {
    color: ${theme.colors.blue[600]};
    text-decoration: underline;
  }
`

const AuthorName = styled.span`
  font-weight: ${theme.fontWeights.semibold};

  &::before {
    content: "— ";
    font-weight: ${theme.fontWeights.normal};
    color: ${theme.colors.muted};
  }
`

const QuotePlaceholder = styled.p`
  margin: 0;
  min-height: 4.5rem;
  font-size: ${theme.fontSizes["2xl"]};
  line-height: 1;
  color: ${theme.colors.border};
  letter-spacing: 0.2em;
`
