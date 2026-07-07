# 코드 품질 원칙

언어 무관 코딩 원칙. 항상 적용된다.

- **의도가 이름에 드러난다** — `data` / `temp` / `flag` 같은 의미 없는 이름 금지. 이름만 보고 무엇인지 알아야 한다.
- **매직 넘버·리터럴 금지** — 뜻 있는 숫자·문자열을 코드에 직접 박지 않는다. 이름 있는 상수로 뺀다. 특히 같은 리터럴이 여러 뜻으로 쓰이면(예: `-1` 이 "없음"이자 "역방향") 반드시 이름으로 구분한다. (아래 [매직 넘버](#매직-넘버--같은-리터럴을-여러-뜻으로-쓰지-않는다) 참조)
- **한 함수/컴포넌트는 한 가지 일을 한다** — 책임이 둘 이상이면 쪼갠다.
- **타입이 코드를 설명한다** — `any` 로 회피하지 않는다(절대 금지). 타입을 좁히지 못하겠으면 데이터 구조를 다시 본다.
- **에러는 명시적으로 처리한다** — `catch (e) {}` 같이 삼키지 않는다. 로깅·재던지기·사용자 알림 중 하나는 한다.
- **기존 코드를 재사용한다** — 비슷한 유틸을 매번 새로 만들지 않는다. 새 유틸 추가 전에 검색 먼저.
- **Boy Scout Rule** — 코드를 떠날 때 들어왔을 때보다 깔끔하게 둔다. 만지는 파일 안에 작은 정리 거리(애매한 이름, 데드 코드, 묵은 주석)가 보이면 같이 정리한다. 단, 무관한 대규모 리팩터까지 끌어들이지 말 것 — 같은 PR/커밋의 맥락 안에서만.

## 네이밍 (의도가 이름에 드러난다)

이름만 보고 무엇인지/무엇을 하는지 알 수 있어야 한다. (컴포넌트·이벤트 핸들러 네이밍은 `react.md` 참조)

### 함수 네이밍

동사 + 목적어 — "이 함수가 뭘 하는지" 바로 알 수 있어야 한다.

```ts
formatPrice(45000)        ✅  // "가격을 포맷하는구나"
getFilteredProducts()     ✅  // "필터된 상품을 가져오는구나"
doStuff()                 ❌  // "뭘 하는데?"
process()                 ❌  // "뭘 처리하는데?"
```

### boolean 네이밍

`is` / `has` / `should` / `can` 등 접두사로 참/거짓임이 드러나게. 이중 부정 금지.

```ts
isLoading          ✅  // is + 형용사
hasError           ✅  // has + 명사
shouldRefetch      ✅  // should + 동사
canSubmit          ✅  // can + 동사

loading            △  // 관례상 허용 (useState 이름으로 흔함)
notDisabled        ❌  // 이중 부정 — if (!notDisabled) → ???
```

### 상수 네이밍

재할당 없는 상수는 `UPPER_SNAKE_CASE`.

```ts
const MAX_RETRY_COUNT = 3          ✅  // UPPER_SNAKE_CASE
const ITEMS_PER_PAGE = 20          ✅
const defaultPageSize = 20         ❌  // 상수인데 camelCase
```

## 매직 넘버 — 같은 리터럴을 여러 뜻으로 쓰지 않는다

뜻 있는 리터럴을 코드에 직접 박으면 "이 숫자가 뭐지?"를 매번 되짚어야 한다. 이름 있는 상수로 뺀다. **한 리터럴이 문맥마다 다른 뜻으로 쓰이면 특히 위험** — 이름으로 갈라야 읽는 사람이 헷갈리지 않는다.

```ts
// ❌ 같은 -1 이 세 가지 뜻 — 읽는 사람이 매번 문맥을 되짚어야 한다
const [highlightedIndex, setHighlightedIndex] = useState(-1);   // "없음"?
stepEnabledIndex(indices, current, -1);                          // "역방향"?
if (indices.indexOf(current) === -1) { ... }                     // "못 찾음"?

// ✅ 뜻마다 이름을 준다
const NO_HIGHLIGHT = -1;                    // 하이라이트된 옵션 없음(sentinel)
const DIRECTION = { DOWN: 1, UP: -1 };      // 이동 방향
const [highlightedIndex, setHighlightedIndex] = useState(NO_HIGHLIGHT);
stepEnabledIndex(indices, current, DIRECTION.UP);
if (!indices.includes(current)) { ... }     // indexOf === -1 관례도 의도로 대체
```

예외: `0` / `1` / 빈 문자열처럼 그 자체로 자명하고 뜻이 하나뿐인 값(반복 시작 인덱스, 증분 등)은 상수화하지 않는다. 과잉 상수화도 노이즈다.

## 주석 — "왜"만 남기고, 코드가 말하는 건 반복하지 않는다

주석은 코드가 **스스로 설명하지 못하는 것**(왜 이렇게 했는지, 숨은 제약, 엣지케이스)만 남긴다. 이름·타입·구조가 이미 말하는 걸 다시 적으면 노이즈이고, 코드가 바뀔 때 같이 안 바뀌어 거짓말이 된다.

```ts
const NO_HIGHLIGHT = -1;  // 하이라이트 없음을 뜻하는 상수   ❌ 이름이 이미 말한다 — 주석 중복
const NO_HIGHLIGHT = -1;                                    ✅ 이름으로 충분

// 유효 인덱스는 0부터라 -1로 "가리키는 옵션 없음"을 표현     ✅ "왜 하필 -1인지"는 코드에 없는 정보
const NO_HIGHLIGHT = -1;

i = i + 1;  // i 를 1 증가                                  ❌ 코드를 그대로 읽은 것
```

기준: 주석을 지웠을 때 잃는 정보가 있으면 남기고, 코드만 봐도 아는 내용이면 지운다.
