## 프로젝트를 구동하기 위하여

### 패키지 설치

패키지들을 다운받습니다.
```bash
npm install
```

### json-server 실행

mock Data JSON으로부터 값을 가져오기 위해 json server를 실행시킵니다.
3000번 포트에서 실행됩니다.
```bash
npm run json
```

혹은 3001번 포트에서 실행시키고 싶다면 하단의 명령어를 입력합니다.
```bash
npm run test-json
```

### dev 서버 실행

development 서버를 실행시킵니다.
80번 포트에서 실행됩니다.
```bash
npm run dev
```



## 이 부분을 신경써보았어요!

### 코드의 유지보수

최대한 type과 interface를 이용해서 만들었기 때문에
내부 함수의 유지보수가 용이합니다.
```typescript
type typeBrandName = "Nike" | "Louis Vuitton" | "Chanel" | "Gucci" | "Adidas" | "Rolex" | "Dior" | "Zara"; . . .

interface filterOptionProps {
  name: typeFilterOptionName;
  isClicked?: boolean;
  isToggled: boolean;
} . . .

const [brandList, setBrandList] = useState<Array<brandProps>>([ . . . ]) . . .
```

### 서버 사이드 렌더링

필터가 적용될 경우 router로 push하여 서버 사이드에서 렌더링 하게끔 만들었습니다.
```typescript
const query: string = makeQueryString(toggledFilterList, checkedBrandList, startPrice, endPrice, checkedSortingMethod); . . .
router.push(`/shop?${query}`, undefined, { shallow: false }); . . .

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // URL의 쿼리가 변경될 경우 (router.push될 경우)
    // 해당 쿼리를 바탕으로 서버로부터 데이터를 새롭게 조회합니다.
    // 조회되는 데이터는 최대 51개입니다. (pc 환경에서 상품을 한 줄에 3개씩 보여주기 때문)

    const query = context.resolvedUrl.replace("/shop?", "");
    const productList = await fetch([`http://localhost:3000/products`,
    `?_start=0`,
    `&_end=51`,
    `&${query}`].join("")).then((res) => res.json());
  
    return {
      props: { productList }
    };
  }
  catch (error) { . . .
```

### 무한 스크롤링

자동 스크롤이 되지 않는 때를 대비하여 더보기 버튼을 만들어두었습니다.
만약 observer에 의해 더보기 버튼이 화면에 보이면 추가로 데이터를 조회해 리스트에 추가함으로써
무한 스크롤링이 되도록 만들었습니다.
```typescript
const intersect = useCallback(async ([entry]: IntersectionObserverEntry[]) => {
  // more 버튼이 화면에 보이는지를 기다립니다.

  if (entry.isIntersecting) {
    onClickShowMoreProductListButton();
    // more 버튼이 화면에 보이면 해당 버튼을 클릭합니다.
    // 이를 통해 스크롤만으로도 모든 아이템을 조회할 수 있도록 합니다.
  }
}, [productList]); . . .

const onClickShowMoreProductListButton = async () => {
  // 상품 리스트에서 더보기 버튼을 클릭했을 경우

  const query: string = makeQueryString(toggledFilterList, checkedBrandList, startPrice, endPrice, checkedSortingMethod);

  await fetch(["http://localhost:3000/products?",
  `_start=${searchingProductQuantity * (searchingProductListPage + 1)}`,
  `&_end=${searchingProductQuantity * (searchingProductListPage + 2)}`,
  `${query}`].join("")).then((res) => res.json()).then((data) => {
    setProductList([...productList, ...data]);
  });
  // 현재까지 조회된 데이터 이후의 값을
  // 필터에 맞춰 최대 51개까지 요청한 뒤
  // productList에 추가합니다.

  setSearchingProductListPage(searchingProductListPage + 1);
} . . .
```

### 반응형 웹

유저가 어떤 환경에서든 동일한 경험을 할 수 있도록
반응형 웹으로 제작했습니다.
```css
@media screen and (max-width: 800px) {
  .shop {
    -webkit-tap-highlight-color: transparent !important;
  } . . .

@media screen and (max-width: 650px) {
  .productsList {
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: 110vw;
  } . . .

@media (hover:hover) {
  .state > *:hover {
    filter: invert(0.8);
  } . . .
```

### transition과 animation

hover되거나 css가 변경될 경우
transition과 animation을 지정해두어 부드럽게 연출했습니다.
```css
.filter {
  position: fixed;
  left: calc(50% - min(50% - 30px, 700px));
  bottom: 30px;
  width: 92px;
  height: 41px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: black;
  transition: 300ms;
  user-select: none;
} . . .

.fadeIn {
  animation: fadeIn;
  animation-duration: 300ms;
  animation-fill-mode: backwards;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
} . . .
```



## Todo List

01. 각 필터에서 렌더링 할 템플릿을 별개의 컴포넌트로 분리
02. sass와 sass-loader를 설치하여 scss 파일로 CSS 정의
03. className을 보다 더 직관적이게 변경, 혹은 flex, justify-center 등이 정의된 CSS파일을 생성
04. input과 button 등의 자주 사용하는 요소 컴포넌트화
