import type { HeadFC } from "gatsby"
import styled from "styled-components"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { Text } from "../components/Text"
import { Button } from "../components/Button"
import { ContentWrapper } from "../components/ContentWrapper"
import { SITE_CONFIG } from "../constants"
import { theme } from "../styles/theme"

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
              Design tokens and UI primitives for Polo. Component variants and states live in{" "}
              <StorybookHint>Storybook</StorybookHint> — run{" "}
              <code>npm run storybook</code>.
            </Text>
          </PageIntro>

          <Section>
            <SectionTitle>
              <Text variant="h2">Typography</Text>
              <Text variant="p" color="secondary">
                System UI stack via <code>theme.fontFamily</code> (Apple / Google–style). Scale from{" "}
                <code>theme.fontSizes</code>.
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
                    </TypeMeta>
                    <Text style={{ fontSize: size }}>The quick brown fox jumps over the lazy dog</Text>
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
              <Text variant="p">Body paragraph — default copy style.</Text>
              <Text variant="caption" color="secondary">
                Caption / secondary
              </Text>
            </VariantStack>
          </Section>

          <Section>
            <SectionTitle>
              <Text variant="h2">Color</Text>
              <Text variant="p" color="secondary">
                Semantic and UI colors from <code>theme.colors</code>.
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
                <code>theme.spacing</code> — used for padding, gaps, and layout rhythm.
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
                Shared <code>Button</code> — primary, secondary, outline, ghost, muted, pagination; sizes
                small / medium / large.
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
        </ContentWrapper>
      </main>
    </Layout>
  )
}

export default StyleguidePage

export const Head: HeadFC = () => (
  <SEO
    title={`Style guide — ${SITE_CONFIG.SITE_NAME}`}
    description="Design tokens, typography, color, spacing, and UI primitives for the Polo site."
    keywords={["design system", "style guide", "typography", "components"]}
  />
)

const PageIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.muted};
`

const StorybookHint = styled.span`
  font-weight: ${theme.fontWeights.semibold};
`

const Section = styled.section`
  margin-bottom: ${theme.spacing.xl};
`

const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};

  code {
    font-size: ${theme.fontSizes.sm};
    background: ${theme.colors.white};
    padding: 2px 6px;
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.muted};
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
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.muted};
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
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.muted};
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
