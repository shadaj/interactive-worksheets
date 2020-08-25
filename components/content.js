export default function Content({children}) {
  return <div style={{
    padding: "20px"
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