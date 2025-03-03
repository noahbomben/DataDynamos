import React from 'react'
import './App.css'
import {
  Routes,
  Route,
} from "react-router-dom"
import LoginPage from "../LoginPage/LoginPage"
import SignUpPage from "../SignUpPage/SignUpPage.jsx"
import HomePage from "../HomePage/HomePage.jsx"
import ProjectView from '../ProjectView/ProjectView.jsx'
import Conatiner from '../Container/Container.jsx'

function App() {
  return (

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/ProjectView" element={<ProjectView />} />
        <Route path='/Whiteboard' element={<Conatiner />}></Route>
      </Routes>

  )
}

export default App
