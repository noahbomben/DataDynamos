import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import LoginPage from "../LoginPage/LoginPage.jsx"
import SignUpPage from "../SignUpPage/SignUpPage.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
      </Routes>
    </Router>
  )
}

export default App
