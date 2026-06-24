import type { Coupon } from "../types";

export default function CouponSection({
  couponCode,
  onChangeCouponCode,
  onApplyCoupon,
  appliedCoupon,
}: {
  couponCode: string;
  onChangeCouponCode: (code: string) => void;
  onApplyCoupon: () => void;
  appliedCoupon: Coupon | null;
}) {
  return (
    <div className="section">
      <h2>쿠폰</h2>
      <div className="row">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onChangeCouponCode(e.target.value)}
          placeholder="쿠폰 코드 (예: WELCOME5000)"
        />
        <button onClick={onApplyCoupon}>적용</button>
      </div>
      {appliedCoupon ? <small>{appliedCoupon.label} 적용됨</small> : null}
    </div>
  );
}
