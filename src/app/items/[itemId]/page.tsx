import { useParams } from 'next/navigation';

function ItemDetailPage() {
  const params = useParams();
  const { itemId } = params;

  return (
    <div>
      <h1>Item Detail Page</h1>
      <p>아이템 ID: {itemId}</p>
      {/* 아이템 상세 정보 컴포넌트 추가 */}
    </div>
  );
}

export default ItemDetailPage;
