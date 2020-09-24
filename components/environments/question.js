import { renderToReact } from "../latexContent";
import { Fragment, useContext, useMemo, useState } from "react";

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
      {renderToReact(
        originalText,
        {...environments, solution: Solution},
        content
      )}
    </div>
  </div>;
}

const displayedStepsContext = React.createContext();
function Solution({ originalText, environments, content, args }) {
  const registeredSteps = useMemo(() => {
    const stepsToPopulate = [];
    renderToReact(originalText, {
      ...environments,
      "hint": [DummyComponent, (node) => {
        stepsToPopulate.push(node);
      }],
      "step": [DummyComponent, (node) => {
        stepsToPopulate.push(node);
      }]
    }, content);

    return stepsToPopulate;
  }, [originalText, environments, content]);

  const [nextProgress, setProgress] = useState(0);
  let nextHint;
  for (let i = nextProgress; i < registeredSteps.length; i++) {
    if (registeredSteps[i].name == "hint") {
      nextHint = i;
      break;
    }
  }

  let nextStep;
  for (let i = nextProgress; i < registeredSteps.length; i++) {
    if (registeredSteps[i].name == "step") {
      nextStep = i;
      break;
    }
  }

  const [displayedSteps, setDisplayedSteps] = useState([]);

  const hasControls = (nextHint != undefined || nextStep != undefined);

  return <div style={{
    marginTop: "5px",
    marginLeft: "-10px",
    marginRight: "-10px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "10px",
    borderTop: "1px solid black"
  }}>
    <displayedStepsContext.Provider value={displayedSteps}>
      {renderToReact(originalText, {
        ...environments,
        "hint": Hint,
        "step": Step
      }, content)}
    </displayedStepsContext.Provider>
    <div style={{
      display: hasControls ? "block" : "none",
      marginTop: "5px"
    }}>
      {nextHint != undefined && <button style={{
        border: "1px solid #9B51E0",
        fontFamily: "'Nunito', sans-serif",
        fontSize: "18px",
        backgroundColor: "transparent",
        borderRadius: "10px",
        padding: "5px",
        marginRight: "10px",
        cursor: "pointer"
      }} onClick={() => {
        setProgress(nextHint + 1);
        setDisplayedSteps([...displayedSteps, registeredSteps[nextHint]]);
      }}>get a hint</button>}

      {nextStep != undefined && <button style={{
        border: "1px solid #F2994A",
        fontFamily: "'Nunito', sans-serif",
        fontSize: "18px",
        backgroundColor: "transparent",
        borderRadius: "10px",
        padding: "5px",
        marginRight: "10px",
        cursor: "pointer"
      }} onClick={() => {
        setProgress(nextStep + 1);
        setDisplayedSteps([...displayedSteps, registeredSteps[nextStep]]);
      }}>show next step</button>}
    </div>
  </div>;
}

function DummyComponent(props) {
  return null;
}

function Hint({ originalText, environments, content, args, location }) {
  const displayedSteps = useContext(displayedStepsContext);
  const shouldDisplay = displayedSteps.some((e) => e.location == location);

  if (shouldDisplay) {
    return <div style={{fontStyle: "italic"}}>
      {renderToReact(originalText, environments, content)}
    </div>
  } else {
    return null;
  }
}

function Step({ originalText, environments, content, args, location }) {
  const displayedSteps = useContext(displayedStepsContext);
  const shouldDisplay = displayedSteps.some((e) => e.location == location);

  if (shouldDisplay) {
    return <div>{renderToReact(originalText, environments, content)}</div>
  } else {
    return null;
  }
}