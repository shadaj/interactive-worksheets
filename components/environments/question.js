import { renderToReact } from "../latexContent";
import { Fragment } from "react";

function groupCommands(content) {
  let groupedOut = [];
  
  let currentGroup = [];

  content.forEach(elem => {
    if (elem.kind == "command" || elem.kind == "parbreak") {
      if (currentGroup.length > 0) {
        groupedOut.push(currentGroup);
        currentGroup = [];
      }
    }

    currentGroup.push(elem);
  });

  if (currentGroup.length > 0) {
    groupedOut.push(currentGroup);
    currentGroup = [];
  }

  return groupedOut;
}

export default function Question({ originalText, environments, content, args }) {
  const grouped = groupCommands(content);
  const renderedGrouped = grouped.map((group, i) => {
    const contentToRender = group[0].kind == "command" ? group.slice(1) : group;
    const isHint = group[0].kind == "command" && group[0].name == "hint";

    if (isHint) {
      return <span style={{
        fontStyle: "italic"
      }} key={i}>
        {renderToReact(
          originalText,
          i == grouped.length - 1 ?
            {...environments, solution: Solution} :
            environments,
          contentToRender
        )}
      </span>
    } else {
      return <Fragment key={i}>
        {renderToReact(
          originalText,
          i == grouped.length - 1 ?
            {...environments, solution: Solution} :
            environments,
          contentToRender
        )}
      </Fragment>
    }
  })

  return <div style={{
    width: "100%",
    border: "2px solid #2D9CDB",
    marginTop: "20px",
    borderRadius: "0px 0px 20px 20px"
  }} className={"question"}>
    <p style={{
      margin: 0,
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingTop: "5px",
      paddingBottom: "5px",
      fontFamily: "'Roboto Slab', serif",
      fontWeight: 700,
      borderBottom: "1px solid black"
    }}>QUESTION</p>
    <div style={{
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingTop: "10px",
      paddingBottom: "10px"
    }}>
      {renderedGrouped}
    </div>
  </div>;
}

function Solution({ originalText, environments, content, args }) {
  return <div style={{
    marginTop: "5px",
    marginLeft: "-10px",
    marginRight: "-10px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "10px",
    borderTop: "1px solid black"
  }}>
    {renderToReact(originalText, {...environments}, content)}
  </div>;
}
