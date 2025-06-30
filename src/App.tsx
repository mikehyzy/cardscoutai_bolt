import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import AuthPage from './components/AuthPage'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'
import Deals from './components/Deals'
import Watchlist from './components/Watchlist'
import Analytics from './components/Analytics'
import Settings from './components/Settings'
import CardScanner from './components/CardScanner'
import { Toaster } from './components/Toaster'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
          <span className="text-white font-medium">Loading CardScout AI...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="deals" element={<Deals />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="scan" element={<CardScanner />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App