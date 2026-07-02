import type { CartItem, Coupon, Member, PaymentAmounts } from "../market/types";

const FREE_SHIPPING_THRESHOLD = 50000;
const BASE_SHIPPING_FEE = 3000;
const REMOTE_SHIPPING_SURCHARGE = 3000;
const VIP_DISCOUNT_RATE = 0.1;

export function calculateItemTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateShippingFee(
  itemTotal: number,
  isRemote: boolean,
): number {
  const baseFee = itemTotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_FEE;

  return isRemote ? baseFee + REMOTE_SHIPPING_SURCHARGE : baseFee;
}

export function calculateCouponDiscount(coupon: Coupon | null): number {
  return coupon ? coupon.discount : 0;
}

export function calculatePointDiscount(
  pointInput: number,
  memberPoint: number,
  itemTotal: number,
): number {
  return Math.min(pointInput, memberPoint, itemTotal);
}

// VIP 할인은 상품 금액(itemTotal)에만 적용한다.
// 배송비·쿠폰·적립금에는 적용하지 않는다.
export function calculateMemberDiscount(
  itemTotal: number,
  member?: Member,
): number {
  return member?.grade === "VIP"
    ? Math.floor(itemTotal * VIP_DISCOUNT_RATE)
    : 0;
}

export function calculateFinalPrice(amounts: PaymentAmounts): number {
  const {
    itemTotal,
    shippingFee,
    couponDiscount,
    pointDiscount,
    memberDiscount,
  } = amounts;

  return (
    itemTotal + shippingFee - couponDiscount - pointDiscount - memberDiscount
  );
}
