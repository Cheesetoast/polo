import type { HeadFC } from "gatsby"
import styled from "styled-components"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { Button } from "../components/Button"
import { TextInput } from "../components/TextInput"
import { Eyebrow } from "../components/Eyebrow"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"
import { theme } from "../styles/theme"
import { styleguideIntro, styleguideSection } from "../styles/surfaceStyles"

type ColorLeaf = string | Record<string, string>

function flattenColors(
  node: Record<string, ColorLeaf>,
  prefix = ""
): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = []
  for (const [key, val] of Object.entries(node)) {
    const label = prefix ? `${prefix}.${key}` : key
    if (typeof val === "string") {
      rows.push({ label, value: val })
    } else {
      rows.push(...flattenColors(val, label))
    }
  }
  return rows
}

const StyleguidePage = () => {
  const colorSwatches = flattenColors(theme.colors as unknown as Record<string, ColorLeaf>)

  return (
    <Layout>
      <main>
        <ContentWrapper>
          <PageIntro>
            <Text variant="h1">Style guide</Text>
            <Text variant="p" color="secondary">
              Single source of truth: <code>src/styles/theme.ts</code> (Inter, cool neutrals, purple
              accent) plus shared surfaces in <code>surfaceStyles.ts</code>. Layout applies{" "}
              <code>mainBackdrop</code> to the page shell. Component variants and stories also live in{" "}
              <StorybookHint>Storybook</StorybookHint>.
            </Text>
          </PageIntro>

          <Section>
            <SectionTitle>
              <Text variant="h2">Typography</Text>
              <Text variant="p" color="secondary">
                <code>theme.fontFamily</code> is Inter with system fallbacks. Sizes and line heights
                pair via <code>theme.fontSizes</code> and <code>theme.lineHeights</code>. The{" "}
                <code>Text</code> component applies weights and tracking per variant (e.g. semibold
                headings, tight tracking on <code>h1</code> / <code>h2</code>).
              </Text>
            </SectionTitle>
            <TypeScale>
              {(Object.entries(theme.fontSizes) as Array<[string, string]>).map(
                ([name, size]) => (
                  <TypeRow key={name}>
                    <TypeMeta>
                      <Text variant="caption" weight="medium">
                        {name}
                      </Text>
                      <Text variant="caption" color="secondary">
                        {size}
                      </Text>
                      <Text variant="caption" color="secondary">
                        lh{" "}
                        {String(
                          theme.lineHeights[name as keyof typeof theme.lineHeights] ?? "n/a"
                        )}
                      </Text>
                    </TypeMeta>
                    <TypeSample $size={name}>
                      The quick brown fox jumps over the lazy dog
                    </TypeSample>
                  </TypeRow>
                )
              )}
            </TypeScale>
            <SubsectionLabel>
              <Text variant="h4">Text component variants</Text>
            </SubsectionLabel>
            <VariantStack>
              <Text variant="h1">Heading 1</Text>
              <Text variant="h2">Heading 2</Text>
              <Text variant="h3">Heading 3</Text>
              <Text variant="h4">Heading 4</Text>
              <Text variant="h5">Heading 5</Text>
              <Text variant="h6">Heading 6</Text>
              <Text variant="p">Body paragraph, default copy style.</Text>
              <Text variant="caption" color="secondary">
                Caption / secondary
              </Text>
            </VariantStack>
            <SubsectionLabel>
              <Text variant="h4">
                <code>Eyebrow</code> (marketing label)
              </Text>
            </SubsectionLabel>
            <Text variant="p" color="secondary" style={{ marginBottom: theme.spacing.sm }}>
              Uppercase labels for heroes and sections. Shared <code>Eyebrow</code> component in{" "}
              <code>src/components/Eyebrow.tsx</code> (<code>variant=&quot;accent&quot;</code> or{" "}
              <code>neutral</code>) so pages match the homepage.
            </Text>
            <PatternExamples>
              <div>
                <Eyebrow variant="accent">Accent eyebrow</Eyebrow>
                <Text variant="h3" style={{ marginBottom: theme.spacing.xs }}>
                  Section title
                </Text>
                <Text variant="p" color="secondary" style={{ margin: 0 }}>
                  Supporting line.
                </Text>
              </div>
              <div>
                <Eyebrow variant="neutral">Neutral eyebrow</Eyebrow>
                <Text variant="h3" style={{ marginBottom: theme.spacing.xs }}>
                  Another block
                </Text>
                <Text variant="p" color="secondary" style={{ margin: 0 }}>
                  Muted label + heading + body.
                </Text>
              </div>
            </PatternExamples>
          </Section>

          <Section>
            <SectionTitle>
              <Text variant="h2">Color</Text>
              <Text variant="p" color="secondary">
                Semantic UI colors from <code>theme.colors</code>: primary text, surfaces, border,
                and <code>blue[500-700]</code> for accent (buttons, links, focus). Tints in{" "}
                <code>surfaceStyles</code> use the same accent family.
              </Text>
            </SectionTitle>
            <SwatchGrid>
              {colorSwatches.map(({ label, value }) => (
                <Swatch key={label}>
                  <SwatchTile $color={value} title={value} />
                  <SwatchLabel>
                    <Text variant="caption" weight="medium">
                      {label}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {value}
                    </Text>
                  </SwatchLabel>
                </Swatch>
              ))}
            </SwatchGrid>
          </Section>

          <Section>
            <SectionTitle>
              <Text variant="h2">Spacing</Text>
              <Text variant="p" color="secondary">
                <code>theme.spacing</code> covers padding, gaps, and layout rhythm.
              </Text>
            </SectionTitle>
            <SpacingDemo>
              {(Object.entries(theme.spacing) as Array<[string, string]>).map(([name, val]) => (
                <SpacingRow key={name}>
                  <Text variant="caption" weight="medium" style={{ minWidth: 48 }}>
                    {name}
                  </Text>
                  <Text variant="caption" color="secondary" style={{ minWidth: 56 }}>
                    {val}
                  </Text>
                  <SpacingBar $width={val} />
                </SpacingRow>
              ))}
            </SpacingDemo>
          </Section>

          <Section>
            <SectionTitle>
              <Text variant="h2">Shadows</Text>
              <Text variant="p" color="secondary">
                <code>theme.shadows</code> backs cards, nav, and elevated panels.
              </Text>
            </SectionTitle>
            <ShadowRow>
              {(Object.entries(theme.shadows) as Array<[string, string]>).map(([name, val]) => (
                <ShadowCard key={name} $shadow={val}>
                  <Text variant="caption" weight="medium">
                    {name}
                  </Text>
                  <ShadowCode>{val}</ShadowCode>
                </ShadowCard>
              ))}
            </ShadowRow>
          </Section>

          <Section>
            <SectionTitle>
              <Text variant="h2">Border radius</Text>
            </SectionTitle>
            <RadiusRow>
              {(Object.entries(theme.borderRadius) as Array<[string, string]>).map(
                ([name, val]) => (
                  <RadiusCard key={name} $radius={val}>
                    <Text variant="caption" weight="medium">
                      {name}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {val}
                    </Text>
                  </RadiusCard>
                )
              )}
            </RadiusRow>
          </Section>

          <Section>
            <SectionTitle>
              <Text variant="h2">Buttons</Text>
              <Text variant="p" color="secondary">
                Shared <code>Button</code> variants: primary, secondary, outline, ghost, muted, and
                pagination. Sizes are small, medium, and large.
              </Text>
            </SectionTitle>
            <ButtonRow>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </ButtonRow>
            <ButtonRow>
              <Button variant="ghost">Ghost link</Button>
              <Button variant="muted" size="small">
                Muted chip
              </Button>
              <Button variant="pagination" type="button">
                Prev
              </Button>
              <Button variant="pagination" type="button" pageActive>
                1
              </Button>
              <Button variant="pagination" type="button">
                2
              </Button>
            </ButtonRow>
            <ButtonRow>
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </ButtonRow>
            <ButtonRow>
              <Button disabled>Disabled</Button>
            </ButtonRow>
          </Section>

          <Section>
            <SectionTitle>
              <Text variant="h2">Text input</Text>
              <Text variant="p" color="secondary">
                Shared <code>TextInput</code> uses the theme border, radius, and focus ring (accent).
                Pair with <code>Button</code> in a flex row for search-style UIs.
              </Text>
            </SectionTitle>
            <InputRow>
              <TextInput placeholder="Default width (full in this column)" />
            </InputRow>
            <InputRow>
              <SearchLikeRow>
                <TextInput inputWidth="flex" placeholder="Flex grow beside a button…" />
                <Button type="button" variant="primary">
                  Action
                </Button>
              </SearchLikeRow>
            </InputRow>
          </Section>
        </ContentWrapper>
      </main>
    </Layout>
  )
}

export default StyleguidePage

export const Head: HeadFC = () => (
  <SEO
    title={`Style guide | ${SITE_CONFIG.SITE_NAME}`}
    description="Design tokens, typography, color, spacing, and UI primitives for the Polo site."
    keywords={["design system", "style guide", "typography", "components"]}
  />
)

const PageIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing["2xl"]};
  ${styleguideIntro}
`

const StorybookHint = styled.span`
  font-weight: ${theme.fontWeights.semibold};
`

const Section = styled.section`
  margin-bottom: ${theme.spacing.xl};
  ${styleguideSection}
`

const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};

  code {
    font-size: ${theme.fontSizes.sm};
    background: ${theme.colors.surface};
    padding: 2px 6px;
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border};
  }
`

const TypeScale = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`

const TypeRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: ${theme.spacing.md};
  align-items: baseline;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const TypeMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const SubsectionLabel = styled.div`
  margin-bottom: ${theme.spacing.sm};
`

const VariantStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
`

const TypeSample = styled.span<{ $size: string }>`
  font-family: ${theme.fontFamily};
  font-size: ${({ $size }) => theme.fontSizes[$size as keyof typeof theme.fontSizes]};
  line-height: ${({ $size }) =>
    theme.lineHeights[$size as keyof typeof theme.lineHeights] ?? theme.lineHeights.base};
`

const PatternExamples = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
`

const ShadowRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${theme.spacing.md};
`

const ShadowCard = styled.div<{ $shadow: string }>`
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${({ $shadow }) => $shadow};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 100px;
`

const ShadowCode = styled.pre`
  margin: 0;
  font-size: 10px;
  line-height: 1.5;
  color: ${theme.colors.secondary};
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
`

const InputRow = styled.div`
  margin-bottom: ${theme.spacing.md};
  max-width: 560px;
`

const SearchLikeRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: stretch;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${theme.spacing.md};
`

const Swatch = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

const SwatchTile = styled.div<{ $color: string }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${theme.borderRadius.md};
  background: ${({ $color }) => $color};
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
`

const SwatchLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const SpacingDemo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

const SpacingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`

const SpacingBar = styled.div<{ $width: string }>`
  height: 12px;
  width: ${({ $width }) => $width};
  max-width: 100%;
  background: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  opacity: 0.85;
`

const RadiusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`

const RadiusCard = styled.div<{ $radius: string }>`
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${({ $radius }) => $radius};
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`
