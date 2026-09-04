import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { SettingsProvider } from '@/store/settings'
import { NotificationProvider } from '@/store/notifications'
import LoadingScreen from '@/components/common/LoadingScreen'
import MainLayout from '@/layouts/MainLayout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const DossierPage = lazy(() => import('@/pages/DossierPage'))
const MissionsPage = lazy(() => import('@/pages/MissionsPage'))
const MissionBriefingPage = lazy(() => import('@/pages/MissionBriefingPage'))
const InventoryPage = lazy(() => import('@/pages/InventoryPage'))
const LoadoutPage = lazy(() => import('@/pages/LoadoutPage'))
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage'))
const JourneyPage = lazy(() => import('@/pages/JourneyPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<DossierPage />} />
          <Route path="missions" element={<MissionsPage />} />
          <Route path="missions/:slug" element={<MissionBriefingPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="loadout" element={<LoadoutPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="journey" element={<JourneyPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function BootSequence() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2450)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>{booting && <LoadingScreen />}</AnimatePresence>
      {!booting && <AnimatedRoutes />}
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Suspense fallback={null}>
            <BootSequence />
          </Suspense>
        </BrowserRouter>
      </NotificationProvider>
    </SettingsProvider>
  )
}