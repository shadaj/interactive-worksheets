import { renderToReact } from "../latexContent";

export default function Question({ originalText, environments, content, args }) {
  return <div style={{
    width: "100%",
    border: "2px solid #2D9CDB",
    marginTop: "5px",
    borderRadius: "0px 0px 20px 20px"
  }}>
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
      {renderToReact(originalText, {...environments, solution: Solution}, content)}
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
