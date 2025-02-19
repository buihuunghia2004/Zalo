import {   BrowserRouter as Router, Route } from "react-router-dom"
import ErrorBoundaryRoutes from "./error-boundary-routes"
import { PageNotFound } from "./page-not-found"
import GoogleCallbackPage from "../pages/GoogleCallbackPage"
import HomeLayout from "../layouts/HomeLayout"
import ChatPage from "../pages/ChatPage"
import ContactPage from "../pages/ContactPage/ContactPage"
import { PublicRoute } from "./public-route"
import PrivateRoute from "./private-route"
import AuthPage from "../pages/AuthPage"
import { Toaster } from "sonner"
import ContactLayout from "../layouts/ContactLayout"
import FriendListTab from "../pages/ContactPage/FriendListTab"
import FriendInviteTab from "../pages/ContactPage/FriendInviteTab"

export const AppRoutes = () => {  
  return(
    <Router>
      <Toaster richColors/>
      <ErrorBoundaryRoutes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<AuthPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomeLayout />}>
            <Route path="messages" element={<ChatPage />} />
            <Route path="contacts" element={<ContactLayout/>}>
              <Route path="friends" element={<FriendListTab/>}/>
              <Route path="invites" element={<FriendInviteTab/>}/>
            </Route>
          </Route>
        </Route>

        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </Router>
  )
}