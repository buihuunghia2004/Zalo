import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './redux/store.js'
import { SocketProvider } from './socket/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
          {/* <SocketProvider namespace={""}> */}
            <App />
          {/* </SocketProvider> */}
        </PersistGate>
      </Provider>
    </BrowserRouter>
  // {/* </StrictMode> */}
)
