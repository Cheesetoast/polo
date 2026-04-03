import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"
import { rgba, theme } from "../styles/theme"
import { sectionSurfaceProminent } from "../styles/surfaceStyles"
import { Text } from "./Text"
import { Button } from "./Button"
import { Eyebrow } from "./Eyebrow"

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

/** Above Navbar (1000) and any in-page overlays; portal target avoids MainContent `isolation` stacking. */
const MODAL_OVERLAY_Z = 10000

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMountNode(document.body)
  }, [])

  if (!isOpen || !mountNode) return null

  return createPortal(
    <ModalOverlay $z={MODAL_OVERLAY_Z} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="welcome-modal-title">
        <ModalHeader>
          <Eyebrow variant="neutral" align="center">
            About this project
          </Eyebrow>
          <Text id="welcome-modal-title" variant="h2" align="center">
            Welcome
          </Text>
        </ModalHeader>

        <ModalBody>
          <Text variant="p" color="secondary">
            This is a demo project showcasing my work as a frontend design engineer.
          </Text>
          <Text variant="p" color="secondary">
            It’s actively evolving, so you may notice unfinished areas or rough edges. That’s intentional. I treat this as a living system rather than a static portfolio.
          </Text>
          <Text variant="p" color="secondary">
            The focus here is on how I think: building thoughtful interactions, clear structure, and scalable components.
          </Text>
          <Text variant="p" color="secondary">
            Feel free to explore.
          </Text>

          <ModalSeparator role="presentation" aria-hidden />

          <ModalBodyMeta>
            <Text variant="p" color="secondary">
              Built with <strong>Gatsby</strong>, <strong>React</strong>, and{" "}
              <strong>TypeScript</strong>, with content managed through{" "}
              <strong>Contentful</strong> as a headless CMS. The project also includes
              unit tests in <strong>Jest</strong>. View on{" "}
              <StyledLink
                href="https://github.com/Cheesetoast/polo"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </StyledLink>
              .
            </Text>
          </ModalBodyMeta>

          <ModalSeparator role="presentation" aria-hidden />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="primary" type="button">
            Get started
          </Button>
          <FooterTagline variant="p" size="sm" align="center" color="secondary">
            Built iteratively, like any good product.
          </FooterTagline>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>,
    mountNode
  )
}

const ModalOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "$z",
})<{ $z: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0;
  padding: ${theme.spacing.md};
  padding-top: max(${theme.spacing.md}, env(safe-area-inset-top, 0px));
  padding-right: max(${theme.spacing.md}, env(safe-area-inset-right, 0px));
  padding-bottom: max(${theme.spacing.md}, env(safe-area-inset-bottom, 0px));
  padding-left: max(${theme.spacing.md}, env(safe-area-inset-left, 0px));
  z-index: ${(p) => p.$z};
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
    padding-top: max(${theme.spacing.sm}, env(safe-area-inset-top, 0px));
    padding-right: max(${theme.spacing.sm}, env(safe-area-inset-right, 0px));
    padding-bottom: max(${theme.spacing.md}, env(safe-area-inset-bottom, 0px));
    padding-left: max(${theme.spacing.sm}, env(safe-area-inset-left, 0px));
  }
`

const ModalContent = styled.div`
  box-sizing: border-box;
  ${sectionSurfaceProminent}
  width: 100%;
  max-width: min(36rem, 100%);
  max-height: min(90vh, 100% - ${theme.spacing.lg});
  overflow-x: hidden;
  overflow-y: auto;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.xl};
  box-shadow:
    ${theme.shadows.lg},
    0 24px 64px -24px ${rgba.indigo(0.2)};

  @media (min-width: 768px) {
    max-height: 90vh;
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`

const ModalHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  text-align: center;

  & > h2 {
    margin: 0;
    max-width: 22ch;
    text-wrap: balance;

    @media (min-width: 480px) {
      max-width: none;
    }
  }
`

const ModalBody = styled.div`
  margin-bottom: 0;

  & > p {
    max-width: 52ch;
    margin-left: auto;
    margin-right: auto;
  }

  & > hr:first-of-type {
    margin-top: ${theme.spacing.lg};
  }
`

const ModalSeparator = styled.hr`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid ${theme.colors.border};
`

const ModalBodyMeta = styled.div`
  padding: ${theme.spacing.xl} 0;

  & p {
    max-width: 52ch;
    margin: 0 auto;
  }
`

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`

const FooterTagline = styled(Text)`
  margin: 0;
  max-width: 28rem;
`

const StyledLink = styled.a`
  color: ${theme.colors.blue[500]};
  font-weight: ${theme.fontWeights.semibold};
  text-decoration: none;
  border-radius: ${theme.borderRadius.sm};
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: ${theme.colors.blue[600]};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${rgba.indigo(0.35)};
    text-decoration: underline;
  }
`
