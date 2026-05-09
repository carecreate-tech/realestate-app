// 物件情報を表示するカードコンポーネント
// 物件名・家賃・エリア・広さ・間取りを表示する
export default function PropertyCard({ property }) {
  const { name, rent, area, size, type } = property

  // 家賃を「円」表記にフォーマット
  const formattedRent = rent.toLocaleString('ja-JP')

  return (
    <div className="property-card">
      <div className="property-card-header">
        <span className="property-type">{type}</span>
      </div>
      <div className="property-card-body">
        <h3 className="property-name">{name}</h3>
        <div className="property-details">
          <div className="property-detail-item">
            <span className="detail-label">エリア</span>
            <span className="detail-value">{area}</span>
          </div>
          <div className="property-detail-item">
            <span className="detail-label">広さ</span>
            <span className="detail-value">{size}</span>
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
