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
  } else if (node.kind == "displayMath") {
    return <div dangerouslySetInnerHTML={{
      __html: katex.renderToString(originalText.slice(node.location.start.offset + 2, node.location.end.offset - 2))
    }}/>;
  } else if (node.kind == "parbreak" || (node.kind == "command" && node.name == "\\")) {
    return <br/>
  } else if (node.kind == "env" || node.kind == "command") {
    const componentOrArray = environments[node.name];

    if (componentOrArray == undefined) {
      return <b>Unknown environment: {JSON.stringify(node)}</b>;
    }

    let actualContent = [];
    if (node.kind == "env") {
      actualContent = node.content;
    } else {
      node.args.forEach((arg) => {
        if (arg.kind == "arg.group") {
          actualContent.push(...arg.content);
        }
      })
    }

    const transformedNode = {
      ...node,
      content: actualContent
    };

    if (Array.isArray(componentOrArray)) {
      const [ComponentToUse, callback] = componentOrArray;
      callback(node);
      return <ComponentToUse originalText={originalText} environments={environments} {...transformedNode}/>
    } else {
      const ComponentToUse = componentOrArray;
      return <ComponentToUse originalText={originalText} environments={environments} {...transformedNode}/>
    }
  } else {
    return <b>Cannot render node: {JSON.stringify(node)}</b>;
  }
}

export default function LatexContent({ code }) {
  return <div style={{
    fontFamily: "'Nunito', sans-serif",
    fontSize: "18px"
  }}>{renderToReact(code, builtinEnvironments, latexParser.parse(code))}</div>
}