// 物件一覧画面
// Supabaseから自分の物件を取得し、CRUD操作（登録・編集・削除）を提供する
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'
import PropertyCard from '../components/PropertyCard'
import PropertyForm from '../components/PropertyForm'

export default function Properties() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  // モーダルの表示状態: null=非表示, 'new'=新規, property object=編集
  const [formMode, setFormMode] = useState(null)

  // =====================================================
  // SELECT: Supabaseから自分の物件一覧を取得する
  // RLSにより自分のuser_idの物件のみ返される
  // =====================================================
  const fetchProperties = useCallback(async () => {
    setFetchLoading(true)
    setFetchError('')

    const { data, error } = await supabase
      .from('properties')
      .select('id, name, rent, area, layout, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setFetchError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setFetchLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // =====================================================
  // INSERT: 新規物件をSupabaseに登録する
  // user_idはRLSポリシーで検証されるため必ず付与する
  // =====================================================
  async function handleCreate(formData) {
    setFormLoading(true)

    const { error } = await supabase
      .from('properties')
      .insert({ ...formData, user_id: user.id })

    if (error) {
      alert('登録に失敗しました: ' + error.message)
    } else {
      setFormMode(null)
      await fetchProperties()
    }
    setFormLoading(false)
  }

  // =====================================================
  // UPDATE: 既存物件の情報を更新する
  // RLSにより自分の物件のみ更新可能
  // =====================================================
  async function handleUpdate(formData) {
    setFormLoading(true)

    const { error } = await supabase
      .from('properties')
      .update(formData)
      .eq('id', formMode.id)

    if (error) {
      alert('更新に失敗しました: ' + error.message)
    } else {
      setFormMode(null)
      await fetchProperties()
    }
    setFormLoading(false)
  }

  // =====================================================
  // DELETE: 指定した物件を削除する
  // RLSにより自分の物件のみ削除可能
  // =====================================================
  async function handleDelete(id) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      alert('削除に失敗しました: ' + error.message)
    } else {
      // ローカルのstateからも即時削除（再フェッチ不要）
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // フォームのsubmitを新規・編集で振り分ける
  function handleFormSubmit(formData) {
    if (formMode === 'new') {
      handleCreate(formData)
    } else {
      handleUpdate(formData)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
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

      {/* ツールバー: 物件数 + 新規登録ボタン */}
      <div className="properties-toolbar">
        <p className="properties-count">
          {fetchLoading ? '読み込み中...' : `全 ${properties.length} 件`}
        </p>
        <button onClick={() => setFormMode('new')} className="btn-add">
          + 物件を登録
        </button>
      </div>

      {/* エラー表示 */}
      {fetchError && (
        <div className="fetch-error">
          <p>{fetchError}</p>
          <button onClick={fetchProperties} className="btn-retry">再読み込み</button>
        </div>
      )}

      {/* ローディング中 */}
      {fetchLoading && (
        <div className="loading-inline">読み込み中...</div>
      )}

      {/* 物件が0件のとき */}
      {!fetchLoading && !fetchError && properties.length === 0 && (
        <div className="empty-state">
          <p>登録された物件はありません</p>
          <button onClick={() => setFormMode('new')} className="btn-primary">
            最初の物件を登録する
          </button>
        </div>
      )}

      {/* 物件カード一覧 */}
      {!fetchLoading && properties.length > 0 && (
        <div className="properties-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={(p) => setFormMode(p)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 登録・編集モーダル */}
      {formMode !== null && (
        <PropertyForm
          initialData={formMode === 'new' ? null : formMode}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormMode(null)}
          loading={formLoading}
        />
      )}
    </div>
  )
}
