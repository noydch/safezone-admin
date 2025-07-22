import { useState } from 'react'
import './App.css'
import AppRoutes from './router/Router'
import NotificationListener from './notification/NotificationListener'

function App() {
  return (
    <>
      <NotificationListener />
      <AppRoutes />
    </>
  )
}

export default App

