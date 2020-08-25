import { css } from "styled-components"

import csmLogo from "./csm_logo.svg";

export default function Sidebar() {
  return <div style={{
    width: "320px",
    height: "100vh",
    backgroundColor: "#103261",
    paddingTop: "10px",
    boxSizing: "border-box",
    flexShrink: 0
  }}>
    <img src={csmLogo} style={{
      display: "block",
      marginLeft: "auto",
      marginRight: "auto"
    }}/>
    <div style={{
      marginTop: "30px",
      borderTop: "1px solid white",
      padding: "10px"
    }}>
      <div style={{
        color: "#E0E0E0",
        fontSize: "24px",
        fontFamily: "'Roboto Slab', serif"
      }}>Discrete Math › Graph Theory › <span style={{
        fontWeight: 700
      }}>Hypercubes</span></div>
    </div>
  </div>
}