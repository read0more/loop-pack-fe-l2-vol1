import { useState } from "react";
import type { Coupon, PaymentMethod, PaymentAmounts, Address } from "./types";
import { ADDRESSES, CART, MEMBER, PAST_ORDERS } from "./data";
import {
  calculateItemTotal,
  calculateShippingFee,
  calculateCouponDiscount,
  calculatePointDiscount,
  calculateMemberDiscount,
  calculateFinalPrice,
} from "../utils";
import "./market.css";
import OrderComplete from "./components/order/OrderComplete";
import DeliverySection from "./components/delivery/DeliverySection";
import DeliveryMemoSection from "./components/delivery/DeliveryMemoSection";
import OrderItemList from "./components/order/OrderItemList";
import CouponSection from "./components/benefit/CouponSection";
import PointSection from "./components/benefit/PointSection";
import PaymentMethodSection from "./components/payment/PaymentMethodSection";
import PaymentSummary from "./components/payment/PaymentSummary";
import TermsAgreement from "./components/terms/TermsAgreement";
import PlaceOrderButton from "./components/payment/PlaceOrderButton";
import RecentOrders from "./components/order/RecentOrders";

export function CheckoutPage() {
  const member = MEMBER;
  const cart = CART;

  const [selectedAddress, setSelectedAddress] = useState<Address>(ADDRESSES[0]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [pointInput, setPointInput] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [agreed, setAgreed] = useState(false);
  const [placed, setPlaced] = useState(false);

  const itemTotal = calculateItemTotal(cart);
  const amounts: PaymentAmounts = {
    itemTotal,
    shippingFee: calculateShippingFee(itemTotal, selectedAddress.isRemote),
    couponDiscount: calculateCouponDiscount(appliedCoupon),
    pointDiscount: calculatePointDiscount(pointInput, member.point, itemTotal),
    memberDiscount: calculateMemberDiscount(itemTotal, member),
  };

  const finalPrice = calculateFinalPrice(amounts);

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
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
      />

      <DeliveryMemoSection />

      <OrderItemList items={cart} />

      <CouponSection appliedCoupon={appliedCoupon} onApply={setAppliedCoupon} />

      <PointSection
        memberPoint={member.point}
        pointInput={pointInput}
        onChangePointInput={setPointInput}
      />

      <PaymentMethodSection payment={payment} onChangePayment={setPayment} />

      <PaymentSummary
        amounts={amounts}
        finalPrice={finalPrice}
        appliedCoupon={appliedCoupon}
      />

      <TermsAgreement agreed={agreed} onChangeAgreed={setAgreed} />

      <PlaceOrderButton
        finalPrice={finalPrice}
        disabled={!agreed}
        onPlaceOrder={() => setPlaced(true)}
      />

      <RecentOrders orders={PAST_ORDERS} />
    </div>
  );
}
