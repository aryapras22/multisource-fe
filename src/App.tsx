import { BrowserRouter, Routes, Route } from "react-router"
import HomePage from "./pages/HomePage"
import CreateProjectPage from "./pages/CreateProject"
import ConfigurePage from "./pages/ConfigurePage"
import DashboardPage from "./pages/DashboardPage"
import RequirementsPage from "./pages/RequirementsPage"
// import AIRequirementsPage from "./pages/AIRequirementsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-project" element={<CreateProjectPage />} />

        {/* Project routes with dynamic segments */}
        <Route path="/project/:id">
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="configure" element={<ConfigurePage />} />
          <Route path="requirements" element={<RequirementsPage />} />
          {/* <Route path="ai-requirements" element={<AIRequirementsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App