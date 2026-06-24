import { useState } from "react";
import type { Coupon, PaymentMethod } from "./types";
import { ADDRESSES, CART, COUPONS, MEMBER, PAST_ORDERS } from "./data";
import {
  calculateItemTotal,
  calculateShippingFee,
  calculateCouponDiscount,
  calculatePointDiscount,
  calculateFinalPrice,
} from "../utils";
import "./market.css";
import OrderComplete from "./components/OrderComplete";
import DeliverySection from "./components/DeliverySection";
import DeliveryMemoSection from "./components/DeliveryMemoSection";
import OrderItemList from "./components/OrderItemList";
import CouponSection from "./components/CouponSection";
import PointSection from "./components/PointSection";
import PaymentMethodSection from "./components/PaymentMethodSection";
import PaymentSummary from "./components/PaymentSummary";
import TermsAgreement from "./components/TermsAgreement";
import CheckoutTerms from "./components/CheckoutTerms";
import RecentOrders from "./components/RecentOrders";

export function CheckoutPage() {
  const member = MEMBER;
  const cart = CART;

  const [selectedAddressId, setSelectedAddressId] = useState(ADDRESSES[0].id);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [usePoint, setUsePoint] = useState(false);
  const [pointInput, setPointInput] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [placed, setPlaced] = useState(false);

  const address = ADDRESSES.find((a) => a.id === selectedAddressId)!;

  const itemTotal = calculateItemTotal(cart);
  const shippingFee = calculateShippingFee(itemTotal, address.isRemote);
  const couponDiscount = calculateCouponDiscount(appliedCoupon);
  const pointDiscount = calculatePointDiscount(
    usePoint,
    pointInput,
    member.point,
    itemTotal,
  );

  // 최종 금액을 state 에 담아둔다.
  const [finalPrice] = useState(
    calculateFinalPrice(itemTotal, shippingFee, couponDiscount, pointDiscount),
  );

  const applyCoupon = () => {
    const found = COUPONS.find((c) => c.code === couponCode.trim());
    setAppliedCoupon(found ?? null);
    if (!found) alert("존재하지 않는 쿠폰이에요");
  };

  if (placed) {
    return (
      <OrderComplete
        finalPrice={finalPrice}
        onBackToCheckout={() => setPlaced(false)}
      />
    );
  }

  return (
    <div className="checkout">
      <h1>주문/결제</h1>

      <DeliverySection
        addresses={ADDRESSES}
        selectedAddressId={selectedAddressId}
        onSelectAddress={setSelectedAddressId}
      />

      <DeliveryMemoSection />

      <OrderItemList items={cart} />

      <CouponSection
        couponCode={couponCode}
        onChangeCouponCode={setCouponCode}
        onApplyCoupon={applyCoupon}
        appliedCoupon={appliedCoupon}
      />

      <PointSection
        usePoint={usePoint}
        onToggleUsePoint={setUsePoint}
        pointInput={pointInput}
        onChangePointInput={setPointInput}
        memberPoint={member.point}
      />

      <PaymentMethodSection payment={payment} onChangePayment={setPayment} />

      <PaymentSummary
        itemTotal={itemTotal}
        shippingFee={shippingFee}
        couponDiscount={couponDiscount}
        pointDiscount={pointDiscount}
        finalPrice={finalPrice}
        appliedCoupon={appliedCoupon}
        usePoint={usePoint}
        member={member}
      />

      <TermsAgreement
        agreed={agreed}
        onChangeAgreed={setAgreed}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      <button
        className="pay"
        disabled={!agreed}
        onClick={() => setPlaced(true)}
      >
        {finalPrice.toLocaleString()}원 결제하기
      </button>

      {isTermsOpen ? (
        <CheckoutTerms onClose={() => setIsTermsOpen(false)} />
      ) : null}

      <RecentOrders orders={PAST_ORDERS} />
    </div>
  );
}
