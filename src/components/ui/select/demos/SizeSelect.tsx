"use client";

// docs/images/select1.png 구현

import { useSelect } from "../useSelect";
import { SelectStateProbe } from "./SelectStateProbe";
import { SIZE_OPTIONS, type SizeOption } from "./sampleData";
import styles from "./demos.module.css";

const sizeToKey = (option: SizeOption) => option.id;
const isSizeSoldOut = (option: SizeOption) => option.soldOut;

export function SizeSelect({
  onChange,
}: {
  onChange?: (option: SizeOption) => void;
}) {
  const {
    isOpen,
    selectedOption,
    highlightedIndex,
    disabledIndexes,
    optionItems,
    getTriggerProps,
    getListProps,
  } = useSelect<SizeOption>({
    options: SIZE_OPTIONS,
    optionToKey: sizeToKey,
    isOptionDisabled: isSizeSoldOut,
    onChange,
  });

  return (
    <div className={styles.demo}>
      <div className={styles.card}>
        <button
          type="button"
          className={`${styles.header} ${isOpen ? styles.headerOpen : ""}`}
          {...getTriggerProps()}
        >
          <span
            className={
              selectedOption ? styles.headerValue : styles.headerPlaceholder
            }
          >
            {selectedOption?.size ?? "사이즈"}
          </span>
          <span
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          >
            ▾
          </span>
        </button>

        {isOpen && (
          <ul className={styles.list} {...getListProps()}>
            {optionItems.map(
              ({
                option,
                isSelected,
                isHighlighted,
                isDisabled,
                getOptionProps,
              }) => {
                const rowClass = [
                  styles.row,
                  styles.sizeRow,
                  isHighlighted && styles.highlighted,
                  isSelected && styles.selected,
                  isDisabled && styles.disabled,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <li
                    key={option.id}
                    className={rowClass}
                    {...getOptionProps()}
                  >
                    <span className={styles.sizeNumber}>{option.size}</span>
                    {option.soldOut ? (
                      <span className={styles.soldOutText}>품절</span>
                    ) : (
                      <span className={styles.deliveryBadge}>
                        🚚 내일(토) 도착보장
                      </span>
                    )}
                  </li>
                );
              },
            )}
          </ul>
        )}
      </div>

      <SelectStateProbe
        selectedLabel={selectedOption ? String(selectedOption.size) : null}
        highlightedIndex={highlightedIndex}
        disabledIndexes={disabledIndexes}
      />
    </div>
  );
}
