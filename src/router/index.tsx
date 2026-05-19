import { useRoutes } from 'react-router-dom'
import { routes } from '@/routes/routeConfig'

export function Router() {
  return useRoutes(routes)
}
