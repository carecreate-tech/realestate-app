// 物件一覧画面
// ログイン済みユーザーのみ表示される。ダミーデータを使用。
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'
import PropertyCard from '../components/PropertyCard'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'サンシャインマンション 301', rent: 85000, area: '東京都新宿区', size: '25㎡', type: '1K' },
  { id: 2, name: 'グリーンヒルズ 102', rent: 120000, area: '東京都渋谷区', size: '40㎡', type: '1LDK' },
  { id: 3, name: 'リバーサイドアパート 205', rent: 65000, area: '東京都江東区', size: '20㎡', type: '1R' },
  { id: 4, name: 'パークビューレジデンス 504', rent: 180000, area: '東京都港区', size: '60㎡', type: '2LDK' },
  { id: 5, name: 'コージーネスト 401', rent: 95000, area: '東京都目黒区', size: '30㎡', type: '1K' },
  { id: 6, name: 'シティライフ池袋 203', rent: 75000, area: '東京都豊島区', size: '22㎡', type: '1K' },
]

export default function Properties() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    // ログアウト後はログイン画面へリダイレクト
    navigate('/login')
  }

  return (
    <div className="properties-container">
      {/* ヘッダー */}
      <header className="properties-header">
        <h1 className="properties-title">物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>

      {/* 物件数サマリー */}
      <div className="properties-summary">
        <p>全 {DUMMY_PROPERTIES.length} 件の物件</p>
      </div>

      {/* 物件カード一覧 */}
      <div className="properties-grid">
        {DUMMY_PROPERTIES.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}
