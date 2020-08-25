import Sidebar from "./sidebar";

import { createGlobalStyle } from 'styled-components'
import Head from "next/head";
import Content from "./content";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    overflow-y: hidden;
  }
`;

export default function Chrome({ path, displayPath, toc, current, children }) {
  const title = current ? Object.entries(toc).find(e => e[1] == current)[0] : displayPath[displayPath.length - 1];

  return <div style={{
    maxHeight: "100vh"
  }}>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;1,300&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossOrigin="anonymous" />
    </Head>
    <GlobalStyle/>
    <div style={{
      display: "flex",
      flexDirection: "row"
    }}>
      <Sidebar path={path} displayPath={displayPath} current={current} toc={toc}></Sidebar>
      <Content title={title}>
        {children}
      </Content>
    </div>
  </div>
}