<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby Minimal TypeScript Starter
</h1>

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the minimal TypeScript starter.

    ```shell
    # create a new Gatsby site using the minimal TypeScript starter
    npm init gatsby -- -ts
    ```

2.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-gatsby-site/
    npm run develop
    ```

3.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.tsx` to see your site update in real-time!

4.  **Learn more**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Tutorials](https://www.gatsbyjs.com/docs/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Guides](https://www.gatsbyjs.com/docs/how-to/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

## 🚀 Quick start (Netlify)

Deploy this starter with one click on [Netlify](https://app.netlify.com/signup):

[<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-minimal-ts)

# Polo - Book Management System

A modern book management system built with Gatsby, React, and TypeScript.

## Features

### Kanban Board with Drag and Drop
The bookshelf page features a Kanban-style board for organizing your reading journey:

- **Drag and Drop**: Use the drag handle (⋮⋮) on each book card to drag books between columns
- **Three Columns**: 
  - **Want to Read**: Books you plan to read
  - **Currently Reading**: Books you're actively reading
  - **Finished**: Books you've completed
- **Visual Feedback**: Columns highlight when you drag over them
- **Status Persistence**: Your reading status is automatically saved

### Book Navigation
- **Clickable Titles**: Click on any book title to navigate to the detailed book page
- **Clickable Authors**: Click on any author name to search for all books by that author
- **Book Details**: View comprehensive information about each book including ratings, progress, and reading dates
- **Seamless Navigation**: Easy navigation between the bookshelf and individual book pages

### How to Use Drag and Drop

1. **Navigate to Bookshelf**: Go to `/bookshelf` to access the Kanban board
2. **Find the Drag Handle**: Look for the vertical dots (⋮⋮) in the top-right corner of each book card
3. **Drag to Move**: Click and drag the handle to move books between columns
4. **Drop to Update**: Release the book in a new column to update its status

### How to Navigate to Book Details

1. **From Bookshelf**: Click on any book title to view detailed information
2. **From Search Results**: Click on book titles in search results
3. **Direct URL**: Navigate directly to `/book/[isbn]` for any book

### How to Search by Author

1. **From Bookshelf**: Click on any author name to see all books by that author
2. **From Search Results**: Click on author names in search results
3. **Direct URL**: Navigate to `/search-results?author=[author-name]` for any author

### Visual Indicators

- **Drag Handle**: The ⋮⋮ icon in the top-right of each book card
- **Clickable Titles**: Book titles are styled in primary color and show hover effects
- **Clickable Authors**: Author names are styled in secondary color and show hover effects
- **Hover Effects**: Both titles and authors highlight and show underline on hover
- **Column Highlighting**: Columns change color when you drag over them
- **Empty State**: Empty columns show "Drop books here" message

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd polo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run develop
```

4. Open your browser and navigate to `http://localhost:8000`

## Available Scripts

- `npm run develop` - Start the development server
- `npm run build` - Build the production version
- `npm run test` - Run tests
- `npm run storybook` - Start Storybook for component development

## Technology Stack

- **Gatsby** - Static site generator
- **React** - UI framework
- **TypeScript** - Type safety
- **Styled Components** - CSS-in-JS styling
- **@dnd-kit** - Drag and drop functionality
- **Jest** - Testing framework
- **Storybook** - Component development environment

## Project Structure

```
src/
├── components/          # React components
│   ├── Book.tsx        # Individual book card with clickable title and drag handle
│   ├── BookBoard.tsx   # Kanban board with drag and drop
│   └── ...
├── pages/              # Gatsby pages
│   ├── bookshelf.tsx   # Main bookshelf page
│   ├── book/[slug].tsx # Individual book detail page
│   └── ...
├── hooks/              # Custom React hooks
├── styles/             # Global styles and theme
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
