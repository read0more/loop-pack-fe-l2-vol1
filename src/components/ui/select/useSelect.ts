import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type RefCallback,
} from "react";

const OPEN_KEYS = [" ", "Enter", "ArrowDown", "ArrowUp"];

const NO_HIGHLIGHT = -1;

const NOT_FOUND = -1;

const KEYBOARD_DIRECTION = {
  DOWN: 1,
  UP: -1,
} as const;

type Direction = (typeof KEYBOARD_DIRECTION)[keyof typeof KEYBOARD_DIRECTION];

export interface UseSelectParams<T> {
  options: T[];
  initialOption?: T | null;
  onChange?: (option: T) => void;
  isOptionDisabled?: (option: T) => boolean;
  /**
   * 옵션의 "정체성" 키(필수). id 등 렌더 간 안정적인 값을 반환한다.
   * 같은 옵션이 새 객체로 와도 선택이 유지되도록, 참조 동일성(===) 대신 이 키로 비교한다.
   */
  optionToKey: (option: T) => unknown;
}

export interface OptionItem<T> {
  option: T;
  index: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isDisabled: boolean;
  getOptionProps: () => HTMLAttributes<HTMLElement>;
}

/**
 * 트리거/리스트에 spread 되는 props. `ref` 는 훅이 주입해 노드를 내부에서 추적한다
 * (바깥클릭 감지용). ref 를 콜백으로 두면 요소 타입과 무관하게 spread 가 통과한다.
 */
type ElementProps = HTMLAttributes<HTMLElement> & {
  ref: RefCallback<HTMLElement>;
};

export interface UseSelectReturn<T> {
  isOpen: boolean;
  selectedOption: T | null;
  highlightedIndex: number;
  disabledIndexes: number[];
  optionItems: OptionItem<T>[];
  getTriggerProps: () => ElementProps;
  getListProps: () => ElementProps;
}

function stepEnabledIndex(
  enabledIndexes: number[],
  currentOptionIndex: number,
  direction: Direction,
): number {
  if (enabledIndexes.length === 0) return NO_HIGHLIGHT;

  const currentEnabledPosition = enabledIndexes.indexOf(currentOptionIndex);
  const nextEnabledPosition = currentEnabledPosition + direction;

  if (nextEnabledPosition < 0 || nextEnabledPosition >= enabledIndexes.length) {
    return currentOptionIndex;
  }

  return enabledIndexes[nextEnabledPosition];
}

export function useSelect<T>({
  options,
  initialOption = null,
  onChange,
  isOptionDisabled,
  optionToKey,
}: UseSelectParams<T>): UseSelectReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(NO_HIGHLIGHT);
  const [selectedOption, setSelectedOption] = useState<T | null>(initialOption);

  // getter 는 소비자가 고른 임의의 요소(예: button, ul)에 spread 되니 ref 타입이 그 모든 요소에
  // 맞아야 한다. 객체 ref(RefObject<HTMLElement>)는 요소마다 담을 타입이 정해져 있어 button 자리엔
  // button ref 만 받아 대입이 막히고 as 를 부른다. 반면 콜백으로 HTMLElement를 받으면
  // button 이든 ul 이든 그 함수로 다 넘길 수 있다. 그래서 raw ref 대신 이 setter 를
  // 넘기고, 노드는 내부 ref 에 담아 effect 에서 읽는다.
  const triggerRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLElement | null>(null);
  const setTriggerNode: RefCallback<HTMLElement> = (node) => {
    triggerRef.current = node;
  };
  const setListNode: RefCallback<HTMLElement> = (node) => {
    listRef.current = node;
  };

  const disabledIndexes = Array.from(options.keys()).filter(
    (index) => isOptionDisabled?.(options[index]) ?? false,
  );
  const enabledIndexes = Array.from(options.keys()).filter(
    (index) => !disabledIndexes.includes(index),
  );

  const selectedIndex =
    selectedOption === null
      ? NOT_FOUND
      : options.findIndex(
          (option) => optionToKey(option) === optionToKey(selectedOption),
        );

  const handleClose = () => {
    setIsOpen(false);
    setHighlightedIndex(NO_HIGHLIGHT);
  };

  const handleOpen = () => {
    setIsOpen(true);

    const startIndex =
      selectedIndex >= 0 && !disabledIndexes.includes(selectedIndex)
        ? selectedIndex
        : (enabledIndexes[0] ?? NO_HIGHLIGHT);

    setHighlightedIndex(startIndex);
  };

  const handleSelect = (index: number) => {
    const option = options[index];

    if (option === undefined || disabledIndexes.includes(index)) return;

    setSelectedOption(option);
    onChange?.(option);
    handleClose();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) {
      if (OPEN_KEYS.includes(event.key)) {
        event.preventDefault(); // 스페이스 페이지 스크롤 / 화살표 스크롤 방지
        handleOpen();
      }

      return;
    }

    const moveHighlight = (direction: Direction) =>
      setHighlightedIndex((currentOptionIndex) =>
        stepEnabledIndex(enabledIndexes, currentOptionIndex, direction),
      );

    const keyActions: Record<string, (() => void) | undefined> = {
      ArrowDown: () => moveHighlight(KEYBOARD_DIRECTION.DOWN),
      ArrowUp: () => moveHighlight(KEYBOARD_DIRECTION.UP),
      Enter: () => {
        if (highlightedIndex !== NO_HIGHLIGHT) handleSelect(highlightedIndex);
      },
      Escape: handleClose,
    };

    const runKeyAction = keyActions[event.key];

    if (!runKeyAction) return;

    event.preventDefault(); // 처리 키의 기본동작(스크롤 등) 차단
    runKeyAction();
  };

  // handleClose 는 매 렌더 새로 만들어져 deps 에 직접 넣으면 effect 가 매 렌더 재구독한다. Effect Event 로
  // 감싸면 참조가 안정되면서 호출 시 최신 handleClose 를 부르므로, effect deps 는 [isOpen] 만 남는다.
  // (Effect Event 는 이렇게 effect 안에서 등록한 리스너에서 호출하는 게 정석 용법이다.)
  const closeOnOutside = useEffectEvent(handleClose);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideInteraction = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      const isInsideTrigger = triggerRef.current?.contains(target) ?? false;
      const isInsideList = listRef.current?.contains(target) ?? false;

      if (!isInsideTrigger && !isInsideList) closeOnOutside();
    };

    document.addEventListener("pointerdown", handleOutsideInteraction);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideInteraction);
    };
  }, [isOpen]);

  const optionItems: OptionItem<T>[] = options.map((option, index) => ({
    option,
    index,
    isSelected: index === selectedIndex,
    isHighlighted: index === highlightedIndex,
    isDisabled: disabledIndexes.includes(index),
    getOptionProps: () => ({
      onClick: () => handleSelect(index),
      onMouseEnter: () => {
        if (!disabledIndexes.includes(index)) setHighlightedIndex(index);
      },
    }),
  }));

  const getTriggerProps: UseSelectReturn<T>["getTriggerProps"] = () => ({
    ref: setTriggerNode,
    tabIndex: 0,
    onClick: (event) => {
      // event.detail 은 연속 클릭 횟수(click count)다: 실제 포인터 클릭은 1 이상, Enter/Space 로
      // 인한 합성 click 은 클릭 횟수가 없어 0 이다. <button> 트리거는 키 활성화 시 브라우저가 click 을
      // 합성하는데, 키 처리는 onKeyDown 이 전담하므로 걸러내지 않으면 닫힌 상태(isOpen===false)에서 else 로 빠져
      // handleOpen 이 불려 방금 닫은 드롭다운이 다시 열린다. 그래서 실제 포인터 클릭(detail>0)만 토글한다.
      if (event.detail === 0) return;

      if (isOpen) handleClose();
      else handleOpen();
    },
    onKeyDown: handleTriggerKeyDown,
  });

  const getListProps: UseSelectReturn<T>["getListProps"] = () => ({
    ref: setListNode,
    // 리스트 클릭이 트리거 포커스를 뺏지 않게, 마우스 다운 시 포커스 이동을 막는다. (onMouseDown 은 onClick 보다 먼저 발생한다)
    onMouseDown: (event) => event.preventDefault(),
  });

  return {
    isOpen,
    selectedOption,
    highlightedIndex,
    disabledIndexes,
    optionItems,
    getTriggerProps,
    getListProps,
  };
}
