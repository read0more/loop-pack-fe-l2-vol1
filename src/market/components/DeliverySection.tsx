import { useState } from "react";
import type { Address } from "../types";

// 배송지 — 접기/펼치기와 선택 요약은 스스로 책임진다.
// 단, 실제 선택 동작(onSelectAddress)은 AddressForm → AddressField 로 통과시킨다.
export default function DeliverySection({
  addresses,
  selectedAddress,
  onSelectAddress,
}: {
  addresses: Address[];
  selectedAddress: Address;
  onSelectAddress: (address: Address) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="section">
      <div className="row between">
        <h2>배송지</h2>
        <button className="link" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "접기" : "변경"}
        </button>
      </div>
      {expanded ? (
        <AddressForm
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={onSelectAddress}
        />
      ) : (
        <p className="addr-summary">
          {selectedAddress.label} · {selectedAddress.recipient} (
          {selectedAddress.detail})
        </p>
      )}
    </div>
  );
}

// '도서산간 제외' 필터는 스스로 책임진다.
// 선택 동작(onSelectAddress)은 그대로 AddressField 로 통과시킨다.
function AddressForm({
  addresses,
  selectedAddress,
  onSelectAddress,
}: {
  addresses: Address[];
  selectedAddress: Address;
  onSelectAddress: (address: Address) => void;
}) {
  const [onlyNear, setOnlyNear] = useState(false);
  const nonRemoteAddresses = onlyNear
    ? addresses.filter((a) => !a.isRemote)
    : addresses;
  return (
    <>
      <label className="filter">
        <input
          type="checkbox"
          checked={onlyNear}
          onChange={(e) => setOnlyNear(e.target.checked)}
        />
        도서산간 제외
      </label>
      {nonRemoteAddresses.map((a) => (
        <AddressField
          key={a.id}
          address={a}
          selected={a.id === selectedAddress.id}
          onSelect={onSelectAddress}
        />
      ))}
    </>
  );
}

function AddressField({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected: boolean;
  onSelect: (address: Address) => void;
}) {
  return (
    <label className="addr">
      <input
        type="radio"
        checked={selected}
        onChange={() => onSelect(address)}
      />
      <span>
        {address.label} · {address.recipient} ({address.detail})
        {address.isRemote ? " · 도서산간" : ""}
      </span>
    </label>
  );
}
