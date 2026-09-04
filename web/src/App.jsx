import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireUsername } from './components/RequireUsername'
import { ToastProvider } from './components/ui/Toast'
import { AuthProvider } from './lib/AuthContext'
import { EditorForm, EditorList } from './pages/Editor'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Onboarding } from './pages/Onboarding'
import { Caderno, PageView } from './pages/PageView'
import { Signup } from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/u/:username" element={<Caderno />} />
            <Route path="/u/:username/:slug" element={<PageView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route
              path="/editor"
              element={
                <RequireUsername>
                  <EditorList />
                </RequireUsername>
              }
            />
            <Route
              path="/editor/nova"
              element={
                <RequireUsername>
                  <EditorForm />
                </RequireUsername>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <RequireUsername>
                  <EditorForm />
                </RequireUsername>
              }
            />
            <Route path="/p/:slug" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
