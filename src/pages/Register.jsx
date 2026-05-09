// 会員登録画面
// メールアドレスとパスワードでSupabaseに新規ユーザーを作成する
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    // パスワードの一致確認
    if (password !== confirm) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError('登録に失敗しました。別のメールアドレスをお試しください')
    } else {
      // メール確認が不要な設定の場合はそのままログイン画面へ
      setMessage('登録が完了しました。ログイン画面からログインしてください')
      setTimeout(() => navigate('/login'), 2000)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">不動産管理アプリ</h1>
        <h2 className="auth-subtitle">会員登録</h2>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード（6文字以上）</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm">パスワード（確認）</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="パスワードを再入力"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '登録中...' : '会員登録'}
          </button>
        </form>

        <p className="auth-link">
          すでにアカウントをお持ちの方は
          <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
