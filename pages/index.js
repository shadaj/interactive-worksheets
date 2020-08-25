import Head from 'next/head'

import Chrome from '../components/chrome';
import LatexContent from '../components/latexContent';

export async function getStaticProps() {
  const fs = require('fs').promises;
  const data = await fs.readFile("worksheets-repo/index.tex", "utf-8");
  
  return {
    props: {
      latex: data,
    },
  }
}

export default function IndexPage({ latex }) {
  return (
    <main>
      <Chrome path={[]} displayPath={[]} current={null}>
        <Head>
          <title>Home page</title>
        </Head>

        <LatexContent code={latex}/>
      </Chrome>
    </main>
  )
}
