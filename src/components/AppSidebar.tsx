import { Link } from "gatsby"
import { useLocation } from "@gatsbyjs/reach-router"
import styled from "styled-components"
import { theme } from "../styles/theme"

const NAV_ITEMS = [
  { to: "/", label: "Home", match: (path: string) => path === "/", Icon: HomeIcon },
  {
    to: "/search-results",
    label: "Browse",
    match: (path: string) =>
      path.startsWith("/search") || path.startsWith("/book/"),
    Icon: SearchIcon,
  },
  {
    to: "/bookshelf",
    label: "Bookshelf",
    match: (path: string) => path.startsWith("/bookshelf"),
    Icon: BookshelfIcon,
  },
  {
    to: "/authors",
    label: "Authors",
    match: (path: string) =>
      path.startsWith("/authors") || path.startsWith("/author/"),
    Icon: PersonIcon,
  },
  {
    to: "/genres",
    label: "Genres",
    match: (path: string) =>
      path.startsWith("/genres") || path.startsWith("/genre/"),
    Icon: GenresIcon,
  },
  {
    to: "/styleguide",
    label: "Styleguide",
    match: (path: string) =>
      path.startsWith("/styleguide") || path.startsWith("/project"),
    Icon: StyleguideIcon,
  },
] as const

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar aria-label="Primary">
      <NavCluster>
        {NAV_ITEMS.map(({ to, label, match, Icon }) => (
          <NavIcon
            key={to}
            to={to}
            $active={match(pathname)}
            aria-label={label}
            title={label}
            aria-current={match(pathname) ? "page" : undefined}
          >
            <Icon />
          </NavIcon>
        ))}
      </NavCluster>
    </Sidebar>
  )
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}
function BookshelfIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Shelf */}
      <path d="M3 19h18" />
      {/* Books standing on the shelf */}
      <path d="M5 19V8h3v11" />
      <path d="M9 19V5h3.5v14" />
      <path d="M13.5 19V9h3v10" />
      <path d="M17.5 19v-7H20v7" />
    </svg>
  )
}
function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19.5c1.2-3.2 3.5-4.8 6.5-4.8s5.3 1.6 6.5 4.8" />
    </svg>
  )
}
function GenresIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3Z" />
      <path d="M12 12 4.5 7.5" />
      <path d="M12 12v9" />
      <path d="M12 12 19.5 7.5" />
    </svg>
  )
}
function StyleguideIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="2.5" />
      <circle cx="16" cy="9" r="2.5" />
      <circle cx="12" cy="15.5" r="2.5" />
    </svg>
  )
}

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0.75rem;
  border-right: 1px solid ${theme.colors.border};
  background: rgba(26, 18, 16, 0.65);

  @media (max-width: 900px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-right: none;
    border-bottom: 1px solid ${theme.colors.border};
    position: sticky;
    top: 0;
    z-index: 20;
    background: rgba(26, 18, 16, 0.92);
    backdrop-filter: blur(12px);
  }
`

const NavCluster = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`

const NavIcon = styled(Link)<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: ${({ $active }) => ($active ? theme.colors.ink : theme.colors.muted)};
  background: ${({ $active }) => ($active ? theme.colors.accent : "transparent")};
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${({ $active }) => ($active ? theme.colors.ink : theme.colors.primary)};
    background: ${({ $active }) => ($active ? theme.colors.accent : theme.colors.surface)};
    transform: translateY(-1px);
  }
`

export default AppSidebar
