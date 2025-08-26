import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Helvetica Neue', sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* Mobile text size adjustments */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
      line-height: 1.4;
    }

    h1 {
      font-size: 1.75rem !important;
      line-height: 1.2 !important;
    }

    h2 {
      font-size: 1.5rem !important;
      line-height: 1.3 !important;
    }

    h3 {
      font-size: 1.25rem !important;
      line-height: 1.3 !important;
    }

    h4 {
      font-size: 1.125rem !important;
      line-height: 1.3 !important;
    }

    h5 {
      font-size: 1rem !important;
      line-height: 1.3 !important;
    }

    h6 {
      font-size: 0.875rem !important;
      line-height: 1.3 !important;
    }

    p {
      font-size: 0.875rem !important;
      line-height: 1.4 !important;
    }

    span, div {
      font-size: 0.875rem !important;
    }

    button {
      font-size: 0.875rem !important;
    }

    input, select, textarea {
      font-size: 0.875rem !important;
    }
  }

  /* Extra small mobile devices */
  @media (max-width: 480px) {
    body {
      font-size: 13px;
    }

    h1 {
      font-size: 1.5rem !important;
    }

    h2 {
      font-size: 1.25rem !important;
    }

    h3 {
      font-size: 1.125rem !important;
    }

    p, span, div, button, input, select, textarea {
      font-size: 0.8rem !important;
    }
  }
`;

export default GlobalStyle;