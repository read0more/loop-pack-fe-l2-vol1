export default function TermsAgreement({
  agreed,
  onChangeAgreed,
  onOpenTerms,
}: {
  agreed: boolean;
  onChangeAgreed: (agreed: boolean) => void;
  onOpenTerms: () => void;
}) {
  return (
    <div className="section">
      <label>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onChangeAgreed(e.target.checked)}
        />
        주문 내용 및 약관에 동의합니다
      </label>
      <button className="link" onClick={onOpenTerms}>
        약관 보기
      </button>
    </div>
  );
}
