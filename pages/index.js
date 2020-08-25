import Head from 'next/head'

import Chrome from '../components/chrome';
import LatexContent from '../components/latexContent';

export async function getStaticProps() {
  const fs = require('fs').promises;
  const data = await fs.readFile("worksheets-repo/index.tex", "utf-8");
  const rootToc = JSON.parse(await fs.readFile("worksheets-repo/toc.json", "utf-8"));
  
  return {
    props: {
      latex: data,
      toc: rootToc,
    },
  }
}

export default function IndexPage({ latex, toc }) {
  return (
    <main>
      <Chrome path={[]} displayPath={[]} toc={toc} current={null}>
        <Head>
          <title>Home page</title>
        </Head>

        <LatexContent code={latex}/>
      </Chrome>
    </main>
  )
}
