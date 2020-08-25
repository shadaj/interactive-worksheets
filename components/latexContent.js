import { latexParser } from "latex-utensils";
import katex from 'katex';
import { Fragment } from "react";
import Question from "./environments/question";

const builtinEnvironments = {
  "question": Question
}

export function renderToReact(originalText, environments, node) {
  if (Array.isArray(node)) {
    const out = [];
    let toCoalesce = [];
    const checkCoalesce = () => {
      if (toCoalesce.length > 0) {
        out.push(toCoalesce.map((e, i) => {
          return <Fragment key={i} children={[
            i > 0 && " ",
            <Fragment key={1}>{e}</Fragment>
          ]}/>
        }))

        toCoalesce = []
      }
    };

    node.forEach((elem, elemI) => {
      if (elem.kind == "text.string" || elem.kind == "inlineMath") {
        toCoalesce.push(renderToReact(originalText, environments, elem));
      } else {
        checkCoalesce();
        out.push(<Fragment key={elemI}>{renderToReact(originalText, environments, elem)}</Fragment>);
      }
    });

    checkCoalesce();
    
    return <Fragment children={out}/>;
  } else if (node.kind == "ast.root") {
    return renderToReact(originalText, environments, node.content);
  } else if (node.kind == "text.string") {
    return node.content
  } else if (node.kind == "inlineMath") {
    return <span dangerouslySetInnerHTML={{
      __html: katex.renderToString(originalText.slice(node.location.start.offset + 1, node.location.end.offset - 1))
    }}/>;
  } else if (node.kind == "parbreak") {
    return <br/>
  } else if (node.kind == "env") {
    const ComponentToUse = environments[node.name];
    return <ComponentToUse originalText={originalText} environments={environments} {...node}/>
  } else {
    throw new Error("Cannot render node: " + JSON.stringify(node))
  }
}

export default function LatexContent({ code }) {
  return <div style={{
    fontFamily: "'Nunito', sans-serif",
    fontSize: "18px"
  }}>{renderToReact(code, builtinEnvironments, latexParser.parse(code))}</div>
}