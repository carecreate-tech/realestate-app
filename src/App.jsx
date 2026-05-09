// アプリケーションのルーティング設定
// 未ログイン時はログイン画面へリダイレクトする
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

// 認証が必要なページを保護するラッパー
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">読み込み中...</div>
  }

  // 未ログインの場合はログイン画面へリダイレクト
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <Properties />
            </PrivateRoute>
          }
        />
        {/* ルートパスはログイン画面へリダイレクト */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
