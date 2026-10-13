import type { HeadFC } from "gatsby"
import { navigate } from "gatsby"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import styled from "styled-components"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { ContentWrapper } from "../components/ContentWrapper"
import { Text } from "../components/Text"
import { Button } from "../components/Button"
import { TextInput } from "../components/TextInput"
import { SITE_CONFIG } from "../constants"
import booksData from "../data/books.json"
import { useBookStatus } from "../hooks/useBookStatus"
import {
  DEFAULT_READING_GOAL,
  MAX_READING_GOAL,
  MIN_READING_GOAL,
  useReadingGoal,
} from "../hooks/useReadingGoal"
import { theme } from "../styles/theme"
import { panelElevated } from "../styles/surfaceStyles"
import { GoalProgressRing, getYearProgress } from "../components/GoalProgressRing"

const PRESETS = [12, 24, 36, 50, 75, 100] as const

const ReadingGoalPage = () => {
  const { goal, setGoal, ready } = useReadingGoal()
  const { booksWithStatus } = useBookStatus(booksData as any)
  const finishedBooks = booksWithStatus.filter((b) => b.status === "finished").length

  const [draft, setDraft] = useState(String(DEFAULT_READING_GOAL))
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    if (ready) setDraft(String(goal))
  }, [ready, goal])

  const draftNumber = Number(draft)
  const draftValid =
    Number.isFinite(draftNumber) &&
    draftNumber >= MIN_READING_GOAL &&
    draftNumber <= MAX_READING_GOAL

  const previewGoal = draftValid ? Math.round(draftNumber) : goal
  const progress = Math.min(1, finishedBooks / Math.max(previewGoal, 1))
  const remaining = Math.max(0, previewGoal - finishedBooks)
  const yearProgress = useMemo(() => getYearProgress(), [])
  const daysLeftInYear = useMemo(() => {
    const now = new Date()
    const end = new Date(now.getFullYear() + 1, 0, 1)
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
  }, [])

  const yearLabel = useMemo(() => new Date().getFullYear(), [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draftValid) return
    setGoal(draftNumber)
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1800)
  }

  return (
    <Layout>
      <ContentWrapper>
        <PageHeader>
          <Eyebrow>Goals</Eyebrow>
          <Text variant="h1">Reading goal</Text>
          <Lead>
            Set how many books you want to finish in {yearLabel}. Your home dashboard
            gauge updates from this number.
          </Lead>
        </PageHeader>

        <LayoutGrid>
          <FormCard onSubmit={onSubmit}>
            <Text variant="h2">Annual target</Text>
            <Hint>
              Choose a preset or enter any number between {MIN_READING_GOAL} and{" "}
              {MAX_READING_GOAL}.
            </Hint>

            <PresetRow>
              {PRESETS.map((value) => (
                <PresetButton
                  key={value}
                  type="button"
                  $active={draftValid && Math.round(draftNumber) === value}
                  onClick={() => setDraft(String(value))}
                >
                  {value}
                </PresetButton>
              ))}
            </PresetRow>

            <Field>
              <Label htmlFor="reading-goal-input">Books this year</Label>
              <TextInput
                id="reading-goal-input"
                type="number"
                min={MIN_READING_GOAL}
                max={MAX_READING_GOAL}
                step={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-describedby="reading-goal-help"
              />
              <Help id="reading-goal-help">
                Stored in this browser only. Default is {DEFAULT_READING_GOAL}.
              </Help>
            </Field>

            <Actions>
              <Button type="submit" variant="primary" disabled={!draftValid}>
                Save goal
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/")}>
                Back to home
              </Button>
            </Actions>
            {savedFlash && <SavedNote role="status">Goal saved</SavedNote>}
          </FormCard>

          <PreviewCard>
            <Text variant="h3">Preview</Text>
            <PreviewGaugeWrap>
              <GoalProgressRing
                progress={progress}
                yearProgress={yearProgress}
                year={yearLabel}
                gradientId="reading-goal-preview-grad"
              />
              <PreviewCenter>
                <PreviewValue>
                  {finishedBooks} / {previewGoal}
                </PreviewValue>
                <PreviewLabel>books finished</PreviewLabel>
              </PreviewCenter>
            </PreviewGaugeWrap>
            <PreviewMeta>
              {remaining === 0
                ? "You’ve hit this goal — nice work."
                : `${remaining} book${remaining === 1 ? "" : "s"} to go.`}{" "}
              {daysLeftInYear} day{daysLeftInYear === 1 ? "" : "s"} left in{" "}
              {yearLabel}.
            </PreviewMeta>
          </PreviewCard>
        </LayoutGrid>
      </ContentWrapper>
    </Layout>
  )
}

export default ReadingGoalPage

export const Head: HeadFC = () => (
  <SEO
    title={`Reading goal - ${SITE_CONFIG.SITE_NAME}`}
    description="Set your annual reading goal and track progress from the home dashboard."
    keywords={["reading goal", "books", "library", "progress"]}
  />
)

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
  max-width: 40rem;
`

const Eyebrow = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.accent};
  margin-bottom: ${theme.spacing.sm};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

const Lead = styled.p`
  margin: ${theme.spacing.md} 0 0;
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeights.lg};
`

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
  gap: ${theme.spacing.lg};
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

const FormCard = styled.form`
  ${panelElevated}
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

const Hint = styled.p`
  margin: 0;
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.sm};
`

const PresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`

const PresetButton = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 1px solid
    ${({ $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  background: ${({ $active }) =>
    $active ? theme.colors.accent : "rgba(255, 255, 255, 0.03)"};
  color: ${({ $active }) => ($active ? theme.colors.ink : theme.colors.primary)};
  border-radius: ${theme.borderRadius.full};
  padding: 0.55rem 0.95rem;
  font: inherit;
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${theme.colors.accent};
  }
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  max-width: 16rem;
`

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.secondary};
`

const Help = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.muted};
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`

const SavedNote = styled.p`
  margin: 0;
  color: ${theme.colors.accent};
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.sm};
`

const PreviewCard = styled.aside`
  ${panelElevated}
  padding: ${theme.spacing.xl};
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${theme.spacing.md};
`

const PreviewGaugeWrap = styled.div`
  position: relative;
  width: min(200px, 70%);
  aspect-ratio: 1;
`

const PreviewCenter = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
`

const PreviewValue = styled.div`
  font-size: 1.4rem;
  font-weight: ${theme.fontWeights.extrabold};
  letter-spacing: -0.02em;
`

const PreviewLabel = styled.div`
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.sm};
`

const PreviewMeta = styled.p`
  margin: auto 0 0;
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.sm};
`
