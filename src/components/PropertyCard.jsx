// 物件情報を表示するカードコンポーネント
// 物件名・家賃・エリア・間取りを表示し、編集・削除ボタンを提供する
export default function PropertyCard({ property, onEdit, onDelete }) {
  const { name, rent, area, layout } = property

  // 家賃を「円」表記にフォーマット
  const formattedRent = rent.toLocaleString('ja-JP')

  function handleDelete() {
    // 誤操作防止のため削除前に確認ダイアログを表示
    if (window.confirm(`「${name}」を削除しますか？\nこの操作は取り消せません。`)) {
      onDelete(property.id)
    }
  }

  return (
    <div className="property-card">
      <div className="property-card-header">
        <span className="property-type">{layout}</span>
        {/* 編集・削除ボタン */}
        <div className="property-card-actions">
          <button onClick={() => onEdit(property)} className="btn-card-edit" title="編集">
            編集
          </button>
          <button onClick={handleDelete} className="btn-card-delete" title="削除">
            削除
          </button>
        </div>
      </div>
      <div className="property-card-body">
        <h3 className="property-name">{name}</h3>
        <div className="property-details">
          <div className="property-detail-item">
            <span className="detail-label">エリア</span>
            <span className="detail-value">{area}</span>
          </div>
        </div>
      </div>
      <div className="property-card-footer">
        <span className="property-rent-label">月額家賃</span>
        <span className="property-rent">¥{formattedRent}</span>
      </div>
    </div>
  )
}
