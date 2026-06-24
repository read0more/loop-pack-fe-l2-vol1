export default function PointSection({
  usePoint,
  onToggleUsePoint,
  pointInput,
  onChangePointInput,
  memberPoint,
}: {
  usePoint: boolean;
  onToggleUsePoint: (use: boolean) => void;
  pointInput: number;
  onChangePointInput: (input: number) => void;
  memberPoint: number;
}) {
  return (
    <div className="section">
      <h2>적립금</h2>
      <label>
        <input
          type="checkbox"
          checked={usePoint}
          onChange={(e) => onToggleUsePoint(e.target.checked)}
        />
        적립금 사용 (보유 {memberPoint.toLocaleString()}P)
      </label>
      {usePoint ? (
        <input
          type="number"
          value={pointInput}
          onChange={(e) => onChangePointInput(Number(e.target.value))}
        />
      ) : null}
    </div>
  );
}
