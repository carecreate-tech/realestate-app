// 物件登録・編集フォームのモーダルコンポーネント
// initialData が null のとき新規登録、値があるとき編集モードとして動作する
import { useState } from 'react'

const LAYOUT_OPTIONS = ['1R', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK', '4LDK以上']

const EMPTY_FORM = { name: '', rent: '', area: '', layout: '1K' }

export default function PropertyForm({ initialData, onSubmit, onCancel, loading }) {
  // 編集時は既存データ、新規時は空フォームで初期化
  const [form, setForm] = useState(
    initialData
      ? { name: initialData.name, rent: String(initialData.rent), area: initialData.area, layout: initialData.layout }
      : EMPTY_FORM
  )
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // バリデーション
    if (!form.name.trim()) { setError('物件名を入力してください'); return }
    if (!form.area.trim()) { setError('エリア名を入力してください'); return }
    const rent = parseInt(form.rent, 10)
    if (isNaN(rent) || rent < 0) { setError('家賃は0以上の整数を入力してください'); return }

    onSubmit({ name: form.name.trim(), rent, area: form.area.trim(), layout: form.layout })
  }

  const isEdit = !!initialData

  return (
    // モーダルの背景（クリックで閉じない設計：誤操作防止）
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">{isEdit ? '物件を編集' : '物件を登録'}</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="例: サンシャインマンション 301"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">エリア名</label>
            <input
              id="area"
              name="area"
              type="text"
              value={form.area}
              onChange={handleChange}
              placeholder="例: 東京都新宿区"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rent">家賃（円）</label>
              <input
                id="rent"
                name="rent"
                type="number"
                value={form.rent}
                onChange={handleChange}
                placeholder="例: 85000"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="layout">間取り</label>
              <select
                id="layout"
                name="layout"
                value={form.layout}
                onChange={handleChange}
                className="form-select"
              >
                {LAYOUT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
              キャンセル
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
