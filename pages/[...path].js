import Head from 'next/head'

import Chrome from '../components/chrome';
import LatexContent from '../components/latexContent';

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          path: ["test"],
        },
      }
    ],
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const fs = require('fs').promises;
  const data = await fs.readFile(`worksheets-repo/${params.path.join('/')}.tex`, "utf-8");
  
  return {
    props: {
      latex: data,
    },
  }
}

export default function ContentPage({ latex }) {
  return (
    <main>
      <Chrome>
        <Head>
          <title>Home page</title>
        </Head>

        <LatexContent code={latex}/>
      </Chrome>
    </main>
  )
}
