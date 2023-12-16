import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import ErrorPage from './routes/error-page.tsx'
import BarcodeSearchPage from './routes/barcode-search-page.tsx'
import AddDealsPage from './routes/add-deals-page.tsx'
import './index.scss'
import AddCategoriesPage from './routes/add-categories-page.tsx'

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: '/',
      element: <BarcodeSearchPage />
    },
    {
      path: 'add-deals',
      element: <AddDealsPage />
    },
    {
      path: 'add-categories',
      element: <AddCategoriesPage />
    }
  ]
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
