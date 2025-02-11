import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import LoginPage from "../LoginPage/LoginPage.jsx"
import SignUpPage from "../SignUpPage/SignUpPage.jsx"
import HomePage from "../HomePage/HomePage.jsx"
import ProjectView from '../ProjectView/ProjectView.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/ProjectView" element={<ProjectView />} />
      </Routes>
    </Router>
  )
}

export default App
