import csmLogo from "./csm_logo.svg";

import Link from "next/link"
import { Fragment } from "react";

export default function Sidebar({ path, displayPath, toc, current }) {
  let displayedPath = displayPath.map((elem, i) => {
    let text = (i == displayPath.length - 1) ? <span style={{
      fontWeight: 700,
      cursor: "pointer"
    }}>{ elem }</span> : <span style={{
      cursor: "pointer"
    }}>{elem}</span>;

    return <Link href={"/" + path.slice(0, i + 1).join("/")}>{text}</Link>
  });

  const joinedDisplay = displayedPath.map((e, i) => {
    return <Fragment key={i} children={[
      i > 0 && " › ",
      <Fragment key={1}>{e}</Fragment>
    ]}/>
  });

  const pathBeforeToc = current ? path.slice(0, -1) : path;

  const tocDisplay = Object.entries(toc).map((elem, i) => {
    const linkContents = current == elem[1] ? <span style={{
      fontWeight: 700,
      cursor: "Pointer"
    }}>{elem[0]}</span> : <span style={{
      cursor: "Pointer"
    }}>{elem[0]}</span>;

    return <li key={i}><Link href={"/" + [...pathBeforeToc, elem[1]].join("/")}>{linkContents}</Link></li>
  });

  return <div style={{
    width: "320px",
    height: "100vh",
    backgroundColor: "#103261",
    paddingTop: "10px",
    boxSizing: "border-box",
    flexShrink: 0
  }}>
    <Link href={"/"}>
      <img src={csmLogo} style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        cursor: "pointer"
      }}/>
    </Link>
    <div style={{
      marginTop: "30px",
      borderTop: displayedPath.length > 0 ? "1px solid white" : "none",
      padding: displayedPath.length > 0 ? "10px" : "none"
    }}>
      <div style={{
        color: "#E0E0E0",
        fontSize: "24px",
        fontFamily: "'Roboto Slab', serif"
      }}>
        {joinedDisplay}
      </div>
    </div>
    <div style={{
      borderTop: "1px solid white",
      padding: "10px"
    }}>
      <div style={{
        color: "#E0E0E0",
        fontSize: "18px",
        fontFamily: "'Roboto Slab', serif"
      }}>
        <ul style={{
          paddingInlineStart: "20px"
        }}>
          {tocDisplay}
        </ul>
      </div>
    </div>
  </div>
}