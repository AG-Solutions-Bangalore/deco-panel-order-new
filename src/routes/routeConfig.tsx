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
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const FormPage = lazy(() =>
  import('@/pages/FormPage').then((module) => ({ default: module.FormPage })),
)
const ForgetPasswordRoute = lazy(() =>
  import('@/pages/ForgetPasswordRoute').then((module) => ({ default: module.ForgetPasswordRoute })),
)
const ProfileRoute = lazy(() =>
  import('@/pages/ProfileRoute').then((module) => ({ default: module.ProfileRoute })),
)
const AppUsersRoute = lazy(() =>
  import('@/pages/UsersRoute').then((module) => ({ default: module.AppUsersRoute })),
)
const TeamUsersRoute = lazy(() =>
  import('@/pages/UsersRoute').then((module) => ({ default: module.TeamUsersRoute })),
)
const NotFoundRoute = lazy(() =>
  import('@/pages/NotFoundRoute').then((module) => ({ default: module.NotFoundRoute })),
)
const ProductReportRoute = lazy(() =>
  import('@/pages/ProductReportRoute').then((module) => ({ default: module.ProductReportRoute })),
)
const OrderReportRoute = lazy(() =>
  import('@/pages/OrderReportRoute').then((module) => ({ default: module.OrderReportRoute })),
)
const QuotationReportRoute = lazy(() =>
  import('@/pages/QuotationReportRoute').then((module) => ({ default: module.QuotationReportRoute })),
)
const OrderViewReportRoute = lazy(() =>
  import('@/pages/OrderViewReportRoute').then((module) => ({ default: module.OrderViewReportRoute })),
)
const QuotationViewReportRoute = lazy(() =>
  import('@/pages/QuotationViewReportRoute').then((module) => ({ default: module.QuotationViewReportRoute })),
)

// Master Routes
const ProductsListPage = lazy(() =>
  import('@/pages/ProductsListPage').then((module) => ({ default: module.ProductsListPage })),
)
const AddProductPage = lazy(() =>
  import('@/pages/AddProductPage').then((module) => ({ default: module.AddProductPage })),
)
const EditProductPage = lazy(() =>
  import('@/pages/EditProductPage').then((module) => ({ default: module.EditProductPage })),
)
const CategoriesListPage = lazy(() =>
  import('@/pages/CategoriesListPage').then((module) => ({ default: module.CategoriesListPage })),
)
const AddCategoryPage = lazy(() =>
  import('@/pages/AddCategoryPage').then((module) => ({ default: module.AddCategoryPage })),
)
const EditCategoryPage = lazy(() =>
  import('@/pages/EditCategoryPage').then((module) => ({ default: module.EditCategoryPage })),
)
const SubCategoriesListPage = lazy(() =>
  import('@/pages/SubCategoriesListPage').then((module) => ({ default: module.SubCategoriesListPage })),
)
const AddSubCategoryPage = lazy(() =>
  import('@/pages/AddSubCategoryPage').then((module) => ({ default: module.AddSubCategoryPage })),
)
const EditSubCategoryPage = lazy(() =>
  import('@/pages/EditSubCategoryPage').then((module) => ({ default: module.EditSubCategoryPage })),
)
const BrandListPage = lazy(() =>
  import('@/pages/BrandListPage').then((module) => ({ default: module.BrandListPage })),
)
const AddBrandPage = lazy(() =>
  import('@/pages/AddBrandPage').then((module) => ({ default: module.AddBrandPage })),
)
const EditBrandPage = lazy(() =>
  import('@/pages/EditBrandPage').then((module) => ({ default: module.EditBrandPage })),
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
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'form', element: <FormPage /> },
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
      {
        path: 'users',
        children: [
          { index: true, element: <AppUsersRoute /> },
          { path: 'team', element: <TeamUsersRoute /> },
        ],
      },
      
      // Master Paths
      { path: 'products', element: <ProductsListPage /> },
      { path: 'add-product', element: <AddProductPage /> },
      { path: 'edit-product/:id', element: <EditProductPage /> },
      { path: 'categories', element: <CategoriesListPage /> },
      { path: 'add-categories', element: <AddCategoryPage /> },
      { path: 'edit-categories/:id', element: <EditCategoryPage /> },
      { path: 'sub-categories', element: <SubCategoriesListPage /> },
      { path: 'add-sub-categories', element: <AddSubCategoryPage /> },
      { path: 'edit-sub-categories/:id', element: <EditSubCategoryPage /> },
      { path: 'brand', element: <BrandListPage /> },
      { path: 'add-brand', element: <AddBrandPage /> },
      { path: 'edit-brand/:id', element: <EditBrandPage /> },

      { path: 'product-report', element: <ProductReportRoute /> },
      { path: 'order-report', element: <OrderReportRoute /> },
      { path: 'quotation-report', element: <QuotationReportRoute /> },
      { path: 'order-view-report', element: <OrderViewReportRoute /> },
      { path: 'quotation-view-report', element: <QuotationViewReportRoute /> },
      { path: 'profile', element: <ProfileRoute /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
]
