import React from 'react'
import ReactDOM from 'react-dom/client'
import {ThemeProvider} from "@ui5/webcomponents-react"
import DocumentTable from './components/AnalyticalTable'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
  <React.StrictMode>
    <DocumentTable />
  </React.StrictMode>
  </ThemeProvider>
)
