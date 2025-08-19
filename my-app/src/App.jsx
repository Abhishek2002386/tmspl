import { BrowserRouter} from "react-router-dom"
import React from "react";
import AppRoute from "./Routes/AppRoutes"
function App() {
  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  )
}
export default App