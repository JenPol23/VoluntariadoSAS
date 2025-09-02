import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import Principal from './Pages/Principal'
import LoginVol from './Pages/LoginVol'
import './App.css'

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<LoginVol />} />
      </Routes>
    </>
  )
}

export default App
