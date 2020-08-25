import Head from 'next/head'

import Chrome from '../components/chrome';
import LatexContent from '../components/latexContent';

function getAllPaths(pathSoFar, pushInto) {
  const fs = require('fs');
  const tocPath = `worksheets-repo/${pathSoFar.length > 0 ? pathSoFar.join('/') + "/" : ""}toc.json`;

  if (fs.existsSync(tocPath)) {
    const fileContent = fs.readFileSync(`worksheets-repo/${pathSoFar.length > 0 ? pathSoFar.join('/') + "/" : ""}toc.json`, "utf-8");
    let tocContent = JSON.parse(fileContent);

    Object.values(tocContent).forEach((nextPath) => {
      pushInto.push(
        {
          params: {
            path: [...pathSoFar, nextPath],
          },
        }
      )

      getAllPaths([...pathSoFar, nextPath], pushInto);
    });
  }
}

export async function getStaticPaths() {
  let outPaths = []
  getAllPaths([], outPaths);

  return {
    paths: outPaths,
    fallback: false,
  }
}

async function getDisplayPathToPage(path) {
  const fs = require('fs').promises;
  if (path.length == 0) {
    return []
  } else {
    const tocArray = path.slice(0, -1);

    const tocPath = `worksheets-repo/${tocArray.length > 0 ? (tocArray.join('/') + "/") : ""}toc.json`;

    const parentToc = JSON.parse(await fs.readFile(tocPath, "utf-8"));
    
    const lastDisplay = Object.entries(parentToc).find((v) => v[1] == path[path.length - 1])[0];
    return [...(await getDisplayPathToPage(tocArray)), lastDisplay];
  }
}

export async function getStaticProps({ params }) {
  const fs = require('fs').promises;
  const fsSync = require('fs');
  const data = await fs.readFile(`worksheets-repo/${params.path.join('/')}.tex`, "utf-8");
  
  const tocArray = params.path.slice(0, -1);
  const tocPath = `worksheets-repo/${tocArray.length > 0 ? tocArray.join('/') + "/" : ""}toc.json`;
  const parentToc = JSON.parse(await fs.readFile(tocPath, "utf-8"));

  const displayPath = await getDisplayPathToPage(params.path);

  const selfTocPath = `worksheets-repo/${params.path.length > 0 ? params.path.join('/') + "/" : ""}toc.json`;
  if (fsSync.existsSync(selfTocPath)) {
    const selfToc = JSON.parse(await fs.readFile(selfTocPath, "utf-8"));
    return {
      props: {
        latex: data,
        currentPage: null,
        toc: selfToc,
        path: params.path,
        displayPath
      },
    }
  } else {
    return {
      props: {
        latex: data,
        currentPage: params.path[params.path.length - 1],
        toc: parentToc,
        path: params.path,
        displayPath: displayPath.slice(0, -1)
      },
    }
  }
}

export default function ContentPage({ latex, currentPage, toc, path, displayPath }) {
  return (
    <main>
      <Chrome path={path} displayPath={displayPath} current={currentPage}>
        <Head>
          <title>Home page</title>
        </Head>

        <LatexContent code={latex}/>
      </Chrome>
    </main>
  )
}
