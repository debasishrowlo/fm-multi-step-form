import { createRoot } from "react-dom/client"

import bgSidebarMobile from "./assets/bg-sidebar-mobile.svg"
import bgSidebarDesktop from "./assets/bg-sidebar-desktop.svg"
import advancedIcon from "./assets/icon-advanced.svg"
import arcadeIcon from "./assets/icon-arcade.svg"
import proIcon from "./assets/icon-pro.svg"
import checkMarkIcon from "./assets/icon-checkmark.svg"
import thankYouIcon from "./assets/icon-thank-you.svg"

import "./index.css"

const App = () => {
  return (
    <h1>Code</h1>
  )
}

createRoot(document.getElementById("app")).render(<App />)