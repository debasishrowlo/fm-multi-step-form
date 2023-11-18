import { createRoot } from "react-dom/client"

import "./index.css"

const App = () => {
  return (
    <h1>Code</h1>
  )
}

createRoot(document.getElementById("app")).render(<App />)