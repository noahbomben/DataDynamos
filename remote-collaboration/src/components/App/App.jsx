import React from 'react'
import './App.css'
import {
  Routes,
  Route,
} from "react-router-dom"
import LoginPage from "../LoginPage/LoginPage"
import SignUpPage from "../SignUpPage/SignUpPage.jsx"

function App() {
  return (

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
      </Routes>

  )
}

export default App
