import { createGlobalStyle } from "styled-components";
import "../asset/style.css";

const GlobalStyles = createGlobalStyle` 
  body{
    font-size: 16px;
    letter-spacing: .025rem;
    line-height: 1.5rem;
    font-weight: 300;
    font-family: "Louis Vuitton Web", "Helvetica Neue", "Helvetica", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    margin: 0;
  }

  a{
      text-decoration: none;
      color: inherit;
  }
  *{
      box-sizing: border-box;
  }
  input, textarea { 
    -moz-user-select: auto;
    -webkit-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
  }
  input:focus {
    outline: none;
  }

  button {
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
  }
  code {
    font-family: Consolas,"courier new";
    color: crimson;
    background-color: #f1f1f1;
    padding: 2px;
    font-size: 105%;
  }
    
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
