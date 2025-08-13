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
`;

export default GlobalStyle;