import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './redux/store.js'
import { SocketProvider } from './socket/SocketProvider.jsx'
import ErrorBoundary from './Routes/error-boundary.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ErrorBoundary>
    {/* <BrowserRouter> */}
      <Provider store={store}>
        <SocketProvider namespace={'message'}>
          <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
            <App />
          </PersistGate>
        </SocketProvider>
      </Provider>
  {/* </BrowserRouter> */}
  </ErrorBoundary>
  
  // {/* </StrictMode> */}
)
