import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    const search = location.search ? location.search : ''
    return <Navigate to={`/login${search}`} replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
