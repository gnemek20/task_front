import Image from "next/image"
import style from "@/styles/shop.module.css"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { ChangeEvent, MouseEvent, useEffect, useState, useRef, memo, useCallback, forwardRef } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

const shop = (serverSideProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // type
  type typeImage = StaticImport;
  type typeImageIcons = string | StaticImport;
  type typeStartOrEnd = "start" | "end";
  type typeBrandName = "Nike" | "Louis Vuitton" | "Chanel" | "Gucci" | "Adidas" | "Rolex" | "Dior" | "Zara";
  type typeFilterOptionName = "신상" | "품절" | "할인중" | "브랜드" | "가격" | "검색어";
  type typeSortingMethodName = "기본순" | "높은 가격순" | "낮은 가격순" | "높은 할인순" | "낮은 할인순";

  // interface
  interface imageProps {
    name: string;
    image: typeImage;
  }
  interface iconProps {
    name: string;
    image: typeImageIcons;
  }
  interface filterOptionProps {
    name: typeFilterOptionName;
    isClicked?: boolean;
    isToggled: boolean;
  }
  interface brandProps {
    name: typeBrandName;
    isChecked: boolean;
  }
  interface productProps {
    id: number;
    name: string;
    brand: typeBrandName;
    price: number;
    promotion: number;
    promotionalPrice: number;
    isNew: boolean;
    isOut: boolean;
  }

  // router
  const router = useRouter();

  // ref
  const shopPageRef = useRef<HTMLDivElement>(null);
  const showMoreButtonRef = useRef<HTMLDivElement>(null);

  // const
  const [isExpandedFilter, setIsExpandedFilter] = useState<boolean>(false);
  const [showingFilter, setShowingFilter] = useState<typeFilterOptionName>("브랜드");
  const [toggledFilterList, setToggledFilterList] = useState<Array<typeFilterOptionName>>([]);
  const haventIsClickedFilterOptionList: Array<typeFilterOptionName> = ["신상", "품절", "할인중"];
  const [filterOptionList, setFilterOptionList] = useState<Array<filterOptionProps>>([
    {
      name: "품절",
      isToggled: false,
    },
    {
      name: "신상",
      isToggled: false,
    },
    {
      name: "할인중",
      isToggled: false,
    },
    {
      name: "브랜드",
      isClicked: true,
      isToggled: false,
    },
    {
      name: "가격",
      isClicked: false,
      isToggled: false,
    },
    {
      name: "검색어",
      isClicked: false,
      isToggled: false,
    }
  ]);

  const [isShowingCheckedBrandList, setIsShowingCheckedBrandList] = useState<boolean>(false);
  const [searchingBrandName, setSearchingBrandName] = useState<string>("");
  const [checkedBrandList, setCheckedBrandList] = useState<Array<typeBrandName>>([]);
  const [brandList, setBrandList] = useState<Array<brandProps>>([
    {
      name: "Nike",
      isChecked: false,
    },
    {
      name: "Louis Vuitton",
      isChecked: false,
    },
    {
      name: "Chanel",
      isChecked: false,
    },
    {
      name: "Gucci",
      isChecked: false,
    },
    {
      name: "Adidas",
      isChecked: false,
    },
    {
      name: "Rolex",
      isChecked: false,
    },
    {
      name: "Dior",
      isChecked: false,
    },
    {
      name: "Zara",
      isChecked: false,
    },
  ]);

  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);

  const [searchingWord, setSearchingWord] = useState<string>("");

  const [isExpandedSortingMethod, setIsExpandedSortingMethod] = useState<boolean>(false);
  const [checkedSortingMethod, setCheckedSortingMethod] = useState<typeSortingMethodName>("기본순");
  const sortingMethodList: Array<typeSortingMethodName> = [
    "기본순",
    "낮은 가격순",
    "높은 가격순",
    "낮은 할인순",
    "높은 할인순",
  ];

  const [productList, setProductList] = useState<Array<productProps>>([]);
  const [showingProductList, setShowingProductList] = useState<Array<productProps>>([]);
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const [searchingProductListPage, setSearchingProductListPage] = useState<number>(0);
  const searchingProductQuantity: number = 51;

  const [isMouseOveredFilterCondition, setIsMouseOveredFilterCondition] = useState<boolean>(false);

  // image
  const fetchingLogoImage: imageProps = {
    name: "fetching",
    image: require("@/public/images/fetching.jpg"),
  }

  const filterIcon: iconProps = {
    name: "filter",
    image: require("@/public/icons/filterIcon.svg"),
  }

  const searchIcon: iconProps = {
    name: "search",
    image: require("@/public/icons/searchIcon.svg"),
  }

  const refreshIcon: iconProps = {
    name: "refresh",
    image: require("@/public/icons/refreshIcon.svg"),
  }

  const scrollTopIcon: iconProps = {
    name: "scrollTop",
    image: require("@/public/icons/scrollTopIcon.svg"),
  }

  const xIcon: iconProps = {
    name: "x",
    image: require("@/public/icons/xIcon.svg"),
  }

  const stateIcons: Array<iconProps> = [
    {
      name: "search",
      image: require("@/public/icons/searchIcon.svg"),
    },
    {
      name: "basket",
      image: require("@/public/icons/basketIcon.svg"),
    },
    {
      name: "user",
      image: require("@/public/icons/userIcon.svg"),
    },
  ]


  
  // method
  const reload = () => {
    // 현재 페이지를 다시 불러옵니다.

    window.location.reload();
  }

  const intersect = useCallback(async ([entry]: IntersectionObserverEntry[]) => {
    // more 버튼이 화면에 보이는지를 기다립니다.

    if (entry.isIntersecting) {
      onClickShowMoreProductListButton();
      // more 버튼이 화면에 보이면 해당 버튼을 클릭합니다.
      // 이를 통해 스크롤만으로도 모든 아이템을 조회할 수 있도록 합니다.
    }
  }, [productList]);

  const addToToggledFilterList = (filterName: typeFilterOptionName) => {
    // toggledFilterList에 filterName이 없을 경우 filterName을 추가합니다.

    if (!toggledFilterList.includes(filterName)) setToggledFilterList([...toggledFilterList, filterName]);
  }
  const deleteFromToggledFilterList = (filterName: typeFilterOptionName) => {
    // toggledFilterList에 filterName이 있을 경우 filterName을 제외하여 리스트를 재정의 합니다.

    if (toggledFilterList.includes(filterName)) setToggledFilterList(toggledFilterList.filter((toggledFilter) => toggledFilter !== filterName));
  }

  const addToCheckedBrandList = (brandName: typeBrandName) => {
    // checkedBrandList에 brandName이 없을 경우 brandName을 추가합니다.

    if (!checkedBrandList.includes(brandName)) setCheckedBrandList([...checkedBrandList, brandName]);
  }
  const deleteFromCheckedBrandList = (brandName: typeBrandName) => {
    // checkedBrandList에 brandName이 있을 경우 brandName을 제외하여 리스트를 재정의 합니다.

    if (checkedBrandList.includes(brandName)) setCheckedBrandList(checkedBrandList.filter((checkedBrand) => checkedBrand !== brandName));
  }

  const makeQueryString = (tFilterList: Array<typeFilterOptionName>, cBrandList: Array<typeBrandName>, sPrice: number, ePrice: number, sortingMethod: typeSortingMethodName) => {
    // 각 조건에 따라 json에 요청할 query를 만듭니다.

    let query: string = "";
    const priceScale: number = 10000;

    tFilterList.map((filter) => {
      if (filter === "신상") {
        query = [query, "isNew=true"].join("&");
      }
      else if (filter === "할인중") {
        // promotion이 0이 아닌 값들만 검색합니다.

        query = [query, "promotion_ne=0"].join("&");
      }
      else if (filter === "브랜드") {
        cBrandList.map((brandName) => {
          query = [query, `brand=${brandName}`].join("&");
        });
      }
      else if (filter === "가격") {
        if (sPrice == 0) {
          // lte는 최솟값입니다.

          query = [query, `promotionalPrice_lte=${ePrice * priceScale}`].join("&");
        }
        else if (ePrice == 0) {
          // gte는 최댓값입니다.

          query = [query, `promotionalPrice_gte=${sPrice * priceScale}`].join("&");
        }
        else if (sPrice > ePrice) {
          // 만약 두 값이 모두 입력된 상태라면
          // 작은 값을 최솟값으로, 큰 값을 최댓값으로 하여 범위를 지정합니다.

          query = [query, `promotionalPrice_gte=${ePrice * priceScale}`].join("&");
          query = [query, `promotionalPrice_lte=${sPrice * priceScale}`].join("&");
        }
        else {
          // 작은 값을 최솟값으로, 큰 값을 최댓값으로 하여 범위를 지정합니다.

          query = [query, `promotionalPrice_gte=${sPrice * priceScale}`].join("&");
          query = [query, `promotionalPrice_lte=${ePrice * priceScale}`].join("&");
        }
      }
    });

    if (!tFilterList.includes("품절")) query = [query, "isOut=false"].join("&");
    // 기본적으로 품절 상품을 제외하여 가져오기 위해
    // 품절이 토글되어있지 않으면 isOut(품절)이 false인 값만 가져옵니다.

    if (sortingMethod === "높은 가격순") query = [query, "_sort=promotionalPrice&_order=desc"].join("&");
    else if (sortingMethod === "낮은 가격순") query = [query, "_sort=promotionalPrice&_order=asc"].join("&");
    else if (sortingMethod === "높은 할인순") query = [query, "_sort=promotion&_order=desc"].join("&");
    else if (sortingMethod === "낮은 할인순") query = [query, "_sort=promotion&_order=asc"].join("&");
    // checked(선택)된 sortingMethod에 따라 값을 정렬합니다.
    // 기본순일 경우 아무런 조건이 없습니다.

    return query;
  }



  // onClick method
  const onClickFilterButton = () => {
    // 필터 버튼을 클릭하면 필터를 펼치거나 축소합니다.

    setIsExpandedFilter(!isExpandedFilter);
  }

  const onclickFilterOption = (filterName: typeFilterOptionName) => {
    // 필터의 옵션(품절, 브랜드 등)이 클릭됐을 경우

    if (haventIsClickedFilterOptionList.includes(filterName)) {
      // filterOptionList에서 isClicked가 없는 필터일 경우 ([품절, 신상, 할인중])

      filterOptionList.map((filter) => {
        if (filter.name == filterName) {
          // 클릭된 필터가 무엇인지 찾습니다.

          filter.isToggled = !filter.isToggled;
          setFilterOptionList([...filterOptionList]);
          // 해당 필터의 토글 상태를 뒤집습니다. (true to false || false to true)

          if (filter.isToggled) addToToggledFilterList(filterName);
          else deleteFromToggledFilterList(filterName);
          // 만약 토글되었다면 toggledFilterList에 해당 필터를 추가하고
          // 토글이 해제되었다면 toggledFilterList로부터 해당 필터를 제거합니다.
        }
      });

      return;
    }
    else {
      // filterOptionList에서 isClicked가 있는 필터일 경우 ([브랜드, 가격, 검색어])

      filterOptionList.map((filter) => {
        if (filter.name == filterName) {
          filter.isClicked = true;
          setFilterOptionList([...filterOptionList]);
          setShowingFilter(filterName);
          // 클릭된 필터의 isClicked를 true 상태로 변환하고
          // 클릭된 필터의 컴포넌트를 보여줍니다.
        }
        else if (filter.name) {
          // 클릭된 필터가 아니고, isClicked 옵션이 있는 필터일 경우

          filter.isClicked = false;
          setFilterOptionList([...filterOptionList]);
          // 필터의 isClicked를 false 상태로 변환합니다.
        }
      });
    }
  }

  const onclickBrand = (brandName: typeBrandName) => {
    // 브랜드 중 하나가 클릭됐을 경우

    let checked = false;
    // 체크된 브랜드가 하나라도 존재 하는지 파악하기 위한 변수입니다.

    brandList.map((brand) => {
      if (brand.name == brandName) {
        // 클릭된 브랜드가 무엇인지 찾습니다.

        brand.isChecked = !brand.isChecked;
        setBrandList([...brandList]);
        // 해당 브랜드의 isChecked를 뒤집습니다.

        if (brand.isChecked) {
          // 체크된 브랜드의 경우

          addToCheckedBrandList(brandName);
          checked = true;
          // checkedBrandList에 해당 브랜드를 추가합니다.
        }
        else {
          // 체크되지 않은 브랜드의 경우

          deleteFromCheckedBrandList(brandName);
          // checkedBrandList로부터 해당 브랜드를 제거합니다.
        }
      }
      else if (!checked && brand.isChecked) {
        // 만약 클릭된 브랜드가 아님에도 isChecked의 값이 true인 경우 (체크된 브랜드의 경우)

        checked = true;
      }
    });

    if (checked) {
      // 만약 체크된 브랜드가 하나라도 존재한다면

      filterOptionList.map((filter) => {
        if (filter.name == "브랜드") {
          addToToggledFilterList(filter.name);
          filter.isToggled = true;
          // 브랜드 필터를 토글 상태로 만듭니다.
        }
      });
    }
    else {
      // 만약 체크된 브랜드가 하나도 없다면

      filterOptionList.map((filter) => {
        if (filter.name == "브랜드") {
          deleteFromToggledFilterList(filter.name);
          filter.isToggled = false;
          // 브랜드 필터의 토글 상태를 해제합니다.
        }
      });
    }

    setFilterOptionList([...filterOptionList]);
  }

  const onClickShowingCheckedBrandList = () => {
    // 체크된 브랜드만을 보여줄지 결정합니다.

    setIsShowingCheckedBrandList(!isShowingCheckedBrandList);
  }

  const onClickPrices = (event: MouseEvent<HTMLInputElement>, startEnd: typeStartOrEnd) => {
    // 클릭한 가격 필터의 입력란을 공백으로 만듭니다.

    (event.target as HTMLInputElement).value = "";
    // 클릭한 input의 값을 공백으로 만듭니다.

    if (startEnd == "start") setStartPrice(0);
    else if (startEnd == "end") setEndPrice(0);
    // 이후 어떤 가격을 클릭했는지에 따라 (~만원부터 혹은 ~만원까지)
    // 클릭한 가격의 값을 0으로 바꿉니다.

    if ((startEnd == "start" ? endPrice : startPrice) > 0) {
      // 선택되지 않은 가격의 값이 0보다 클 경우
      // 가격의 범위를 지정해둔 것으로 판단하여 토글 상태로 변환합니다.
      // (ex. ~만원부터의 input을 클릭했을 경우) ~까지의 가격이 0보다 큰가?
      // (ex. ~만원까지의 input을 클릭했을 경우) ~부터의 가격이 0보다 큰가?

      filterOptionList.map((filter) => {
        if (filter.name == "가격") {
          filter.isToggled = true;
          addToToggledFilterList(filter.name);
          // 가격 필터를 토글 상태로 만듭니다.
        }
      });
    }
    else {
      // 두 가격의 값 모두 1보다 작을 경우 (입력되지 않았을 경우)

      filterOptionList.map((filter) => {
        if (filter.name == "가격") {
          filter.isToggled = false;
          deleteFromToggledFilterList(filter.name);
          // 가격 필터의 토글 상태를 해제합니다.
        }
      });
    }

    setFilterOptionList([...filterOptionList]);
  }

  const onClickResetPrices = () => {
    // 가격의 초기화 버튼을 눌렀을 경우

    setStartPrice(0);
    setEndPrice(0);
    // 두 가격의 값을 0으로 초기화합니다.

    filterOptionList.map((filter) => {
      if (filter.name == "가격") {
        filter.isToggled = false;
        deleteFromToggledFilterList(filter.name);
        // 가격 필터의 토글 상태를 해제합니다.
      }
    });

    setFilterOptionList([...filterOptionList]);
  }

  const onClickEraseSearchingWord = () => {
    // 필터의 검색어 탭에서 x 버튼을 눌렀을 경우

    setSearchingWord("");
    // 검색어를 공백으로 만듭니다.

    filterOptionList.map((filter) => {
      if (filter.name === "검색어") {
        filter.isToggled = false;
        // 검색어 필터의 토글 상태를 해제합니다.
      }
    });
    setFilterOptionList(filterOptionList);
  }

  const onClickRefreshFilterButton = () => {
    // 모든 필터 해제 버튼을 눌렀을 경우 (필터 버튼 옆에 생기는 버튼)
    // 필터에서 설정 가능한 모든 값을 초기화합니다.

    setIsMouseOveredFilterCondition(false);
    setIsShowingCheckedBrandList(false);
    setSearchingBrandName("");
    setCheckedBrandList([]);
    setBrandList([
      {
        name: "Nike",
        isChecked: false,
      },
      {
        name: "Louis Vuitton",
        isChecked: false,
      },
      {
        name: "Chanel",
        isChecked: false,
      },
      {
        name: "Gucci",
        isChecked: false,
      },
      {
        name: "Adidas",
        isChecked: false,
      },
      {
        name: "Rolex",
        isChecked: false,
      },
      {
        name: "Dior",
        isChecked: false,
      },
      {
        name: "Zara",
        isChecked: false,
      },
    ]);
    setStartPrice(0);
    setEndPrice(0);
    setSearchingWord("");
    setShowingFilter("브랜드");
    setToggledFilterList([]);
    setFilterOptionList([
      {
        name: "품절",
        isToggled: false,
      },
      {
        name: "신상",
        isToggled: false,
      },
      {
        name: "할인중",
        isToggled: false,
      },
      {
        name: "브랜드",
        isClicked: true,
        isToggled: false,
      },
      {
        name: "가격",
        isClicked: false,
        isToggled: false,
      },
      {
        name: "검색어",
        isClicked: false,
        isToggled: false,
      }
    ]);
  }

  const onClickScrollToTop = () => {
    // 클릭시 스크롤을 최상단으로 스크롤합니다.

    shopPageRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const onClickSortingMethodButton = () => {
    // 우상단의 정렬 방법을 클릭했을 경우

    setIsExpandedSortingMethod(!isExpandedSortingMethod);
    // 새로운 element를 띄워 정렬 방법의 리스트를 보여주거나
    // 해당 element를 닫습니다.
  }

  const onClickChangeSortingMethodButton = (sortingMethodName: typeSortingMethodName) => {
    // 정렬 방법을 선택했을 경우

    setCheckedSortingMethod(sortingMethodName);
    // 선택한 방법으로 변경합니다.
  }

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
  }



  // onChange method
  const onChangeSearchingBrandName = (event: ChangeEvent<HTMLInputElement>) => {
    // 브랜드 필터의 검색창에 브랜드명을 입력할 경우

    setSearchingBrandName(event.target.value);
  }

  const onChangePrice = (event: ChangeEvent<HTMLInputElement>, startEnd: typeStartOrEnd) => {
    // 가격에 값을 입력했을 경우

    const value: string = event.target.value.replace(/[^0-9]/g, '');
    const clarifiedValue: string = value[0] == "0" ? value.replace("0", '') : value;
    const price: number = clarifiedValue.length > 0 ? parseInt(clarifiedValue) : 0;
    event.target.value = clarifiedValue;
    // 숫자를 제외한 문자 혹은 0으로 시작하는 값일 경우 공백으로 바꿉니다.

    if (startEnd == "start") {
      setStartPrice(clarifiedValue == "" ? 0 : price);
    }
    else if (startEnd == "end") {
      setEndPrice(clarifiedValue == "" ? 0 : price);
    }
    // 어떤 가격에 입력했는지에 따라 다르게 저장합니다.
    // stratPrice는 ~만원부터에 입력했을 경우
    // endPrice는 ~만원까지에 입력했을 경우

    if (price + (startEnd == "start" ? endPrice : startPrice) > 0) {
      // 현재 입력한 값과 선택되지 않은 값의 합이 0보다 클 경우
      // 가격의 범주가 입력된 것으로 판단하여 토글 상태로 바꿉니다.

      filterOptionList.map((filter) => {
        if (filter.name == "가격") {
          filter.isToggled = true;
          addToToggledFilterList(filter.name);
        }
      });
    }
    else {
      // 현재 입력한 값과 선택되지 않은 값의 합이 0보다 작을 경우 (입력되지 않은 경우)
      // 범주가 지정되지 않은 것으로 판단하여 토글 상태를 해제합니다.

      filterOptionList.map((filter) => {
        if (filter.name == "가격") {
          filter.isToggled = false;
          deleteFromToggledFilterList(filter.name);
        }
      });
    }

    setFilterOptionList([...filterOptionList]);
  }

  const onChangeSearchingWord = (event: ChangeEvent<HTMLInputElement>) => {
    // 검색어 필터의 검색창에 검색어를 입력할 경우
    setSearchingWord(event.target.value);

    if (event.target.value.length > 0) {
      // 검색어가 한 글자라도 입력되어있다면 토글 상태로 바꿉니다.

      filterOptionList.map((filter) => {
        if (filter.name === "검색어") {
          filter.isToggled = true;
          // addToToggledFilterList(filter.name);
          // 현재 조회된 데이터 범위 내에서 검색하므로
          // toggledFilterList에는 넣지 않습니다. (toggledFilterList에 값이 들어가면 serverSide에 의해 데이터가 재조회됩니다.)
        }
      });
    }
    else {
      filterOptionList.map((filter) => {
        if (filter.name === "검색어") {
          filter.isToggled = false;
          // deleteFromToggledFilterList(filter.name);
          // toggledFilterList에 검색어 필터가 있을 리 없으므로
          // toggledFilterList로부터 값을 제거하지 않습니다.
        }
      });
    }
  }



  // onMouseEnter method
  const onMouseEnterFilterCondition = () => {
    // 필터 바로 옆 토글된 필터의 수를 표시하는 요소에 마우스가 들어왔을 경우

    setIsMouseOveredFilterCondition(true);
    // mouseOver 상태를 true로 바꿉니다.
  }

  // onMouseLeave method
  const onMouseLeaveFilterCondition = () => {
    // 필터 바로 옆 토글된 필터의 수를 표시하는 요소로부터 마우스가 나갔을 경우

    setIsMouseOveredFilterCondition(false);
    // mouseOver 상태를 false로 바꿉니다.
  }



  // useEffect
  useEffect(() => {
    // 필터의 조건이 검색되면 이를 바탕으로 쿼리를 만들어 페이지의 쿼리를 변경합니다.
    // 이를 통해 serverSide에서 데이터를 새롭게 조회하도록 합니다.

    const query: string = makeQueryString(toggledFilterList, checkedBrandList, startPrice, endPrice, checkedSortingMethod);
    
    fetch(`http://localhost:3000/products?${query}`).then((res) => res.json()).then((data) => {
      setProductQuantity(data.length);
    });
    // json-server는 조회된 데이터의 수를 제공해주지 않습니다.
    // 따라서 부득이하게 같은 쿼리로 전체 데이터를 불러와 그 수를 저장합니다.

    setSearchingProductListPage(0);
    router.push(`/shop?${query}`, undefined, { shallow: false });
  }, [toggledFilterList, checkedBrandList, startPrice, endPrice, checkedSortingMethod]);

  useEffect(() => {
    // productList가 변경되거나 검색어가 변경되었을 때
    // 검색어에 따라 현재 조회된 데이터 범위 내에서 상품을 출력합니다.

    let mappedProductList: Array<productProps> = productList;

    if (searchingWord.length > 0) {
      mappedProductList = mappedProductList.filter((product) => product.name.toUpperCase().includes(searchingWord.toUpperCase()));
      shopPageRef.current?.scrollIntoView();
    }
    
    setShowingProductList(mappedProductList);
  }, [productList, searchingWord]);

  useEffect(() => {
    // 리스트 하단의 더보기 버튼이 보일 경우
    // 이후의 데이터를 조회하여 무한 스크롤링 할 수 있도록
    // observer로 감지합니다.

    const observer: IntersectionObserver = new IntersectionObserver(intersect, {
      threshold: 0.3,
      root: null,
    });

    if (showMoreButtonRef.current) observer.observe(showMoreButtonRef.current);

    return () => {
      // life cycle에서 destroy될 때
      // observer를 종료합니다.
      
      observer.disconnect();
    }
  }, [intersect, showMoreButtonRef.current]);

  useEffect(() => {
    // SSR을 위하여 서버 사이드로부터 데이터가 조회될 경우
    // 조회된 데이터를 productList에 추가합니다.

    setProductList(serverSideProps.productList);
  }, [serverSideProps]);



  // component
  const filterBrand = () => {
    return (
      <div className={`${style.select} ${style.fadeIn}`}>
        <div className={style.condition}>
          <div className={style.section}>
            <div className={style.search}>
              <div className={style.image}>
                <Image src={searchIcon.image} alt={searchIcon.name} />
              </div>
              <div className={style.input}>
                <input id="searchBrands" type="text" value={searchingBrandName} onChange={(event) => onChangeSearchingBrandName(event)} autoComplete="off" />
              </div>
            </div>
            <div className={`${style.status} ${isShowingCheckedBrandList && style.toggledStatus}`} onClick={onClickShowingCheckedBrandList}>
              <h4>체크된 것만 보기</h4>
            </div>
          </div>
        </div>
        <div className={style.brands}>
          {
            brandList.map((brand, index) => (
              brand.name.toUpperCase().includes(searchingBrandName.toUpperCase()) ? (
                !isShowingCheckedBrandList || brand.isChecked ? (
                  <div className={style.brand} key={index}>
                    <label>
                      <input id={`brandsCheckbox${index}`} type="checkbox" checked={brand.isChecked} onChange={() => onclickBrand(brand.name)} autoComplete="off" />
                      <h4>{brand.name}</h4>
                    </label>
                  </div>
                )
                : ''
              )
              : ''
            ))
          }
        </div>
      </div>
    )
  }

  const filterPrice = () => {
    return (
      <div className={`${style.select} ${style.fadeIn}`}>
        <div className={style.section}>
          <div className={style.setPrice}>
            <div className={style.input}>
              <div>
                <input id="startPrice" type="text" value={(startPrice > 0 ? startPrice : "") || ""} onClick={(event) => onClickPrices(event, "start")} onChange={(event) => onChangePrice(event, "start")} autoComplete="off" />
                <h4>만원부터</h4>
              </div>
              <div className="none">
                {/* 2번째 태그에 value가 포함된 input 태그를 작성하면 에러가 나요. */}
                {/* 발생 이유는 모르겠어요 😢 */}
                {/* Error: A component is changing an uncontrolled input to be controlled. */}
                {/* <input type="text" value={123} /> */}
              </div>
              <div>
                <input id="endPrice" type="text" value={(endPrice > 0 ? endPrice : "") || ""} onClick={(event) => onClickPrices(event, "end")} onChange={(event) => onChangePrice(event, "end")} autoComplete="off" />
                <h4>만원까지</h4>
              </div>
            </div>
            <div className={style.button}>
              <button onClick={onClickResetPrices}>초기화</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filterSearch = () => {
    return (
      <div className={`${style.select} ${style.fadeIn}`}>
        <div className={style.filterSearchSection}>
          <div className={style.searchBox}>
            <input type="text" id="searchingWord" value={searchingWord} onChange={(event) => onChangeSearchingWord(event)} />
            <div className={style.imageIcon}>
              <Image src={searchIcon.image} alt={searchIcon.name} />
            </div>
            <div className={style.imageIcon} onClick={onClickEraseSearchingWord}>
              <Image src={xIcon.image} alt={xIcon.name} />
            </div>
          </div>
        </div>
      </div>
    )
  }



  // main
  return (
    <div className={style.shop} ref={shopPageRef}>
      <div className={style.header}>
        <div className={style.section}>
          <div className={style.title}>
            <h2 onClick={reload}>FETCHING</h2>
          </div>
          <div className={style.state}>
              {
                stateIcons.map((state, index) => (
                  <Image key={index} src={state.image} alt={state.name} />
                ))
              }
          </div>
        </div>
      </div>
      <div className={`${style.filter} ${isExpandedFilter && style.expandedFilter} ${toggledFilterList.length > 0 && (isExpandedFilter ? style.expandedToggledFilter : style.toggledFilter)}`}>
        <div className={`${style.section} ${isExpandedFilter && style.expandedSection}`}>
          {
            isExpandedFilter && (
              showingFilter === "브랜드" ? filterBrand()
              : showingFilter === "가격" ? filterPrice()
              : showingFilter === "검색어" ? filterSearch()
              : <div>Template Error</div>
            )
          }
          <div className={style.option}>
            <div className={style.button} onClick={onClickFilterButton}>
              {
                !isExpandedFilter ? (
                  <h4>필터</h4>
                )
                : (
                  <h4>닫기</h4>
                )
              }
              <Image src={filterIcon.image} alt={filterIcon.name} />
            </div>
            {
              isExpandedFilter && (
                <div className={`${style.options} ${style.fadeIn}`}>
                  {filterOptionList.map((filter, index) => (
                    <h4 className={`${filter.isClicked && style.clickedOption} ${filter.isToggled && style.toggledOption}`} onClick={() => onclickFilterOption(filter.name)} key={index}>{filter.name}</h4>
                  ))}
                </div>
              )
            }
          </div>
        </div>
        {
          toggledFilterList.length > 0 && (
            <div className={style.filterCondition} onMouseEnter={onMouseEnterFilterCondition} onMouseLeave={onMouseLeaveFilterCondition} onClick={onClickRefreshFilterButton}>
              {
                isMouseOveredFilterCondition ? (
                  <Image src={refreshIcon.image} alt={refreshIcon.name} />
                )
                : (
                  <h4>{toggledFilterList.length}</h4>
                )
              }
            </div>
          )
        }
      </div>
      <div className={style.scrollToTop} onClick={onClickScrollToTop}>
        <Image src={scrollTopIcon.image} alt={scrollTopIcon.name} />
      </div>
      <div className={style.products}>
        <div className={style.productsSection}>
          <div className={style.productListState}>
            <div>
              <h4>{searchingWord.length === 0 ? productQuantity : showingProductList.length}개의 결과</h4>
            </div>
            <div className={style.sortingMethod} onClick={onClickSortingMethodButton}>
              <div className={style.sortingMethodName} onClick={onClickSortingMethodButton}>
                <h4>{checkedSortingMethod}</h4>
              </div>
              {
                isExpandedSortingMethod && (
                  <div className={style.sortingMethodList}>
                    {
                      sortingMethodList.map((sortingMethodName, index) => (
                        <div key={index} onClick={() => onClickChangeSortingMethodButton(sortingMethodName)}>
                          <h4>{sortingMethodName}</h4>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
          <div className={style.productsList}>
            {
              showingProductList.map((product, index) => (
                <div className={style.product} key={index}>
                  <div className={style.productImage}>
                    <Image src={fetchingLogoImage.image} alt={fetchingLogoImage.name} priority />
                  </div>
                  <div className={style.productDescription}>
                    <div className={style.productText}>
                      <div className={style.productBrand}>
                        <h6>{product.brand}</h6>
                      </div>
                      <div className={style.productName}>
                        <h5>{product.name}</h5>
                      </div>
                    </div>
                    {
                      product.promotion > 0 ? (
                        <div className={style.productValue}>
                          <div className={style.productPrice}>
                            <h5 className={style.productOriginalPrice}>{product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</h5>
                            <h5 className={style.productPromotion}>{product.promotion}%</h5>
                          </div>
                          <div>
                            <h3>{product.promotionalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</h3>
                          </div>
                        </div>
                      )
                      : (
                        <div className={style.productValue}>
                          <div>
                            <h3>{product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</h3>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              ))
            }
          </div>
          {
            showingProductList.length === 0 ? (
              <div>
                <h4>검색된 상품이 없어요 :(</h4>
              </div>
            )
            : ''
          }
          {
            ((searchingProductQuantity * (searchingProductListPage + 1)) < productQuantity) && searchingWord.length === 0 ? (
              <div className={style.showMoreProductList}>
                <div className={style.showMoreProductListButton} ref={showMoreButtonRef}>
                  <button onClick={onClickShowMoreProductListButton}>
                    <h4>더보기 ({searchingProductQuantity * (searchingProductListPage + 1)} / {productQuantity})</h4>
                  </button>
                </div>
              </div>
            )
            : showingProductList.length > 0 ? (
              <div className={style.showMoreProductList}>
                <h4>END :)</h4>
              </div>
            )
            : ''
          }
        </div>
      </div>
      <div className={style.footer}>
      </div>
    </div>
  );
};

export default memo(shop);

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
  catch (error) {
    // 서버 연결에 오류가 발생하여도 별다른 처리는 하지 않습니다.

    return {
      props: {}
    };
  }
}