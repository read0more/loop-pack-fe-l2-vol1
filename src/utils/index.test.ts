import { describe, it, expect } from "vitest";
import type { Member, PaymentAmounts } from "../market/types";
import { calculateMemberDiscount, calculateFinalPrice } from "./index";

const VIP_MEMBER: Member = { name: "VIP회원", grade: "VIP", point: 0 };
const NORMAL_MEMBER: Member = { name: "일반회원", grade: "NORMAL", point: 0 };

describe("calculateMemberDiscount", () => {
  it("VIP 회원은 상품 금액의 10%를 할인한다", () => {
    expect(calculateMemberDiscount(45000, VIP_MEMBER)).toBe(4500);
  });

  it("소수점 발생 시 내림 처리해 사용자가 1원 손해본다고 느끼지 않게 한다.", () => {
    expect(calculateMemberDiscount(45055, VIP_MEMBER)).toBe(4505);
  });

  it("일반 회원은 할인이 없다", () => {
    expect(calculateMemberDiscount(45000, NORMAL_MEMBER)).toBe(0);
  });
});

describe("calculateFinalPrice", () => {
  const baseAmounts: PaymentAmounts = {
    itemTotal: 45000,
    shippingFee: 3000,
    couponDiscount: 5000,
    pointDiscount: 1000,
    memberDiscount: 0,
  };

  it("상품 금액 + 배송비 - 쿠폰 - 적립금 - 회원할인을 합산한다", () => {
    expect(calculateFinalPrice(baseAmounts)).toBe(42000);
  });

  it("VIP 회원 할인은 배송비·쿠폰·적립금이 아닌 상품 금액에만 적용된다", () => {
    const vipMemberDiscount = calculateMemberDiscount(
      baseAmounts.itemTotal,
      VIP_MEMBER,
    );
    const amounts: PaymentAmounts = {
      ...baseAmounts,
      memberDiscount: vipMemberDiscount,
    };

    expect(calculateFinalPrice(amounts)).toBe(42000 - vipMemberDiscount);
  });
});
