import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { PrintLayout } from '@/layouts/PrintLayout'
import { RootLayout } from '@/layouts/RootLayout'

const OrdersPage = lazy(() =>
  import('@/pages/OrdersPage').then((module) => ({ default: module.OrdersPage })),
)
const CreateOrderRoute = lazy(() =>
  import('@/pages/CreateOrderRoute').then((module) => ({ default: module.CreateOrderRoute })),
)
const ViewOrderRoute = lazy(() =>
  import('@/pages/ViewOrderRoute').then((module) => ({ default: module.ViewOrderRoute })),
)
const EditOrderRoute = lazy(() =>
  import('@/pages/EditOrderRoute').then((module) => ({ default: module.EditOrderRoute })),
)
const QuotesPage = lazy(() =>
  import('@/pages/QuotesPage').then((module) => ({ default: module.QuotesPage })),
)
const CreateQuoteRoute = lazy(() =>
  import('@/pages/CreateQuoteRoute').then((module) => ({ default: module.CreateQuoteRoute })),
)
const ViewQuoteRoute = lazy(() =>
  import('@/pages/ViewQuoteRoute').then((module) => ({ default: module.ViewQuoteRoute })),
)
const EditQuoteRoute = lazy(() =>
  import('@/pages/EditQuoteRoute').then((module) => ({ default: module.EditQuoteRoute })),
)
const QuotePrintRoute = lazy(() =>
  import('@/pages/QuotePrintRoute').then((module) => ({ default: module.QuotePrintRoute })),
)
const LoginRoute = lazy(() =>
  import('@/pages/LoginRoute').then((module) => ({ default: module.LoginRoute })),
)
const ForgetPasswordRoute = lazy(() =>
  import('@/pages/ForgetPasswordRoute').then((module) => ({ default: module.ForgetPasswordRoute })),
)
const ProfileRoute = lazy(() =>
  import('@/pages/ProfileRoute').then((module) => ({ default: module.ProfileRoute })),
)
const NotFoundRoute = lazy(() =>
  import('@/pages/NotFoundRoute').then((module) => ({ default: module.NotFoundRoute })),
)

export const routes = [
  {
    element: <PrintLayout />,
    children: [
      { path: 'quotes/:id/print', element: <QuotePrintRoute /> },
    ],
  },
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <OrdersPage /> },
      { path: 'login', element: <LoginRoute /> },
      { path: 'forget-password', element: <ForgetPasswordRoute /> },
      {
        path: 'orders',
        children: [
          { index: true, element: <Navigate to="/" replace /> },
          { path: 'create', element: <CreateOrderRoute /> },
          { path: ':id', element: <ViewOrderRoute /> },
          { path: 'edit/:id', element: <EditOrderRoute /> },
        ],
      },
      {
        path: 'quotes',
        children: [
          { index: true, element: <QuotesPage /> },
          { path: 'create', element: <CreateQuoteRoute /> },
          { path: 'create/:id', element: <CreateQuoteRoute /> },
          { path: ':id', element: <ViewQuoteRoute /> },
          { path: 'edit/:id', element: <EditQuoteRoute /> },
        ],
      },
      { path: 'profile', element: <ProfileRoute /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
]
