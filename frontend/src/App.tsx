import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Records from './pages/Records'
import RecordDetail from './pages/RecordDetail'
import Medications from './pages/Medications'
import Family from './pages/Family'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="records" element={<Records />} />
        <Route path="records/:id" element={<RecordDetail />} />
        <Route path="medications" element={<Medications />} />
        <Route path="family" element={<Family />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
