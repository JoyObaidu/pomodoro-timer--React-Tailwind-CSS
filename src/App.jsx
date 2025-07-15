import React from 'react'
import PomodoroTimer from './components/PomodoroTimer'
import './App.css'

function App() {
 
  return (
    <>
      <div className="h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col md:justify-center pt-8">
        <h1 className='text-4xl font-extrabold text-blue-900'>Manage Your Time Effectively</h1>
        <PomodoroTimer/>
      </div>
    </>
  )
}

export default App
