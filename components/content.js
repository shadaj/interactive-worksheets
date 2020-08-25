export default function Content({children}) {
  return <div style={{
    padding: "20px",
    maxHeight: "100vh",
    overflowY: "scroll",
    boxSizing: "border-box"
  }}>
    <h1 style={{
      fontSize: "64px",
      fontFamily: "'Roboto Slab', serif",
      fontWeight: 700,
      marginTop: "10px",
      marginBottom: "10px"
    }}>Introduction to Hypercubes</h1>
    {children}
  </div>
}