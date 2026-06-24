import type { CartItem } from "../types";
import { OrderLineRow } from "./OrderLineRow";

export default function OrderItemList({ items }: { items: CartItem[] }) {
  return (
    <div className="section">
      <h2>주문 상품</h2>
      {items.map((it) => (
        <OrderLineRow
          key={it.id}
          type="product"
          label={it.name}
          amount={it.price * it.quantity}
          thumbnail={it.thumbnail}
          option={it.option}
          quantity={it.quantity}
        />
      ))}
    </div>
  );
}
