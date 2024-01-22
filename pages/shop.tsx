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
  type typeFilterOptionName = "신상" | "품절" | "할인중" | "가격" | "검색어";

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
  interface productProps {
    id: number;
    name: string;
    price: number;
    promotion: number;
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
  const [showingFilter, setShowingFilter] = useState<typeFilterOptionName>("검색어");
  const [toggledFilterList, setToggledFilterList] = useState<Array<typeFilterOptionName>>([]);
  const haventIsClickedFilterOptionList: Array<typeFilterOptionName> = ["신상", "품절", "할인중"];
  const [filterOptionList, setFilterOptionList] = useState<Array<filterOptionProps>>([
    {
      name: "신상",
      isToggled: false,
    },
    {
      name: "품절",
      isToggled: false,
    },
    {
      name: "할인중",
      isToggled: false,
    },
    {
      name: "가격",
      isClicked: false,
      isToggled: false,
    },
    {
      name: "검색어",
      isClicked: true,
      isToggled: false,
    }
  ]);

  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);

  const [searchingWord, setSearchingWord] = useState<string>("");

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
    if (entry.isIntersecting) {
      onClickShowMoreProductListButton();
    }
  }, [productList]);

  const addToToggledFilterList = (filterName: typeFilterOptionName) => {
    if (!toggledFilterList.includes(filterName)) setToggledFilterList([...toggledFilterList, filterName]);
  }
  const deleteFromToggledFilterList = (filterName: typeFilterOptionName) => {
    if (toggledFilterList.includes(filterName)) setToggledFilterList(toggledFilterList.filter((toggledFilter) => toggledFilter !== filterName));
  }

  const makeQueryString = (tFilterList: Array<typeFilterOptionName>, sPrice: number, ePrice: number) => {
    let query: string = "";
    const priceScale: number = 10000;

    tFilterList.map((filter) => {
      if (filter === "신상") {
        query = [query, "isNew=true"].join("&");
      }
      else if (filter === "할인중") {
        query = [query, "promotion_ne=0"].join("&");
      }
      else if (filter === "가격") {
        if (sPrice == 0) {
          query = [query, `price_lte=${ePrice * priceScale}`].join("&");
        }
        else if (ePrice == 0) {
          query = [query, `price_gte=${sPrice * priceScale}`].join("&");
        }
        else if (sPrice > ePrice) {
          query = [query, `price_gte=${ePrice * priceScale}`].join("&");
          query = [query, `price_lte=${sPrice * priceScale}`].join("&");
        }
        else {
          query = [query, `price_gte=${sPrice * priceScale}`].join("&");
          query = [query, `price_lte=${ePrice * priceScale}`].join("&");
        }
      }
    });

    if (!tFilterList.includes("품절")) query = [query, "isOut=false"].join("&");

    return query;
  }

  // onClick method
  const onClickFilterButton = () => {
    // 필터 버튼을 클릭하면 필터를 펼치거나 축소합니다.
    setIsExpandedFilter(!isExpandedFilter);
  }

  const onclickFilterOption = (filterName: typeFilterOptionName) => {
    if (haventIsClickedFilterOptionList.includes(filterName)) {
      filterOptionList.map((filter) => {
        if (filter.name == filterName) {
          filter.isToggled = !filter.isToggled;
          setFilterOptionList([...filterOptionList]);

          if (filter.isToggled) addToToggledFilterList(filterName);
          else deleteFromToggledFilterList(filterName);
        }
      });

      return;
    }

    filterOptionList.map((filter) => {
      if (filter.name == filterName) {
        filter.isClicked = true;
        setFilterOptionList([...filterOptionList]);
        setShowingFilter(filterName);
      }
      else if (!haventIsClickedFilterOptionList.includes(filter.name)) {
        filter.isClicked = false;
        setFilterOptionList([...filterOptionList]);
      }
    });
  }

  const onClickPrices = (event: MouseEvent<HTMLInputElement>, startEnd: typeStartOrEnd) => {
    (event.target as HTMLInputElement).value = "";

    if (startEnd == "start") setStartPrice(0);
    else if (startEnd == "end") setEndPrice(0);

    if ((startEnd == "start" ? endPrice : startPrice) > 0) {
      filterOptionList.map((filter) => {
        if (filter.name == "가격") {
          filter.isToggled = true;
          addToToggledFilterList(filter.name);
        }
      });
    }
    else {
      filterOptionList.map((filter) => {
        if (filter.name == "가격") {
          filter.isToggled = false;
          deleteFromToggledFilterList(filter.name);
        }
      });
    }

    setFilterOptionList([...filterOptionList]);
  }

  const onClickResetPrices = () => {
    setStartPrice(0);
    setEndPrice(0);

    filterOptionList.map((filter) => {
      if (filter.name == "가격") {
        filter.isToggled = false;
        deleteFromToggledFilterList(filter.name);
      }
    });

    setFilterOptionList([...filterOptionList]);
  }

  const onClickShowMoreProductListButton = async () => {
    const query: string = makeQueryString(toggledFilterList, startPrice, endPrice);

    await fetch(["http://localhost:3000/products?",
    `_start=${searchingProductQuantity * (searchingProductListPage + 1)}`,
    `&_end=${searchingProductQuantity * (searchingProductListPage + 2)}`,
    `${query}`].join("")).then((res) => res.json()).then((data) => {
      setProductList([...productList, ...data]);
    });

    setSearchingProductListPage(searchingProductListPage + 1);
  }

  const onClickRefreshFilterButton = () => {
    setIsMouseOveredFilterCondition(false);
    setStartPrice(0);
    setEndPrice(0);
    setSearchingWord("");
    setShowingFilter("검색어");
    setToggledFilterList([]);
    setFilterOptionList([
      {
        name: "신상",
        isToggled: false,
      },
      {
        name: "품절",
        isToggled: false,
      },
      {
        name: "할인중",
        isToggled: false,
      },
      {
        name: "가격",
        isClicked: false,
        isToggled: false,
      },
      {
        name: "검색어",
        isClicked: true,
        isToggled: false,
      }
    ]);
  }

  // onChange method
  const onChangePrice = (event: ChangeEvent<HTMLInputElement>, startEnd: typeStartOrEnd) => {
    const value: string = event.target.value.replace(/[^0-9]/g, '');
    const clarifiedValue: string = value[0] == "0" ? value.replace("0", '') : value;
    const price: number = clarifiedValue.length > 0 ? parseInt(clarifiedValue) : 0;
    event.target.value = clarifiedValue;

    if (startEnd == "start") {
      setStartPrice(clarifiedValue == "" ? 0 : price);
    }
    else if (startEnd == "end") {
      setEndPrice(clarifiedValue == "" ? 0 : price);
    }

    if (price + (startEnd == "start" ? endPrice : startPrice) > 0) {
      filterOptionList.map((filter) => {
        if (filter.name == "가격") {
          filter.isToggled = true;
          addToToggledFilterList(filter.name);
        }
      });
    }
    else {
      filterOptionList.map((filter) => {
        filter.isToggled = false;
        deleteFromToggledFilterList(filter.name);
      });
    }

    setFilterOptionList([...filterOptionList]);
  }

  const onChangeSearchingWord = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchingWord(event.target.value);

    if (event.target.value.length > 0) {
      filterOptionList.map((filter) => {
        if (filter.name === "검색어") {
          filter.isToggled = true;
          // addToToggledFilterList(filter.name);
        }
      });
    }
    else {
      filterOptionList.map((filter) => {
        if (filter.name === "검색어") {
          filter.isToggled = false;
          // deleteFromToggledFilterList(filter.name);
        }
      });
    }
  }

  // onMouseEnter method
  const onMouseEnterFilterCondition = () => {
    setIsMouseOveredFilterCondition(true);
  }

  // onMouseLeave method
  const onMouseLeaveFilterCondition = () => {
    setIsMouseOveredFilterCondition(false);
  }

  // useEffect
  useEffect(() => {
    const query: string = makeQueryString(toggledFilterList, startPrice, endPrice);

    fetch(`http://localhost:3000/products?_page=0&_per_page=0${query}`).then((res) => res.json()).then((data) => {
      setProductQuantity(data.items);
    });

    setSearchingProductListPage(0);
    router.push(`/shop?${query}`, undefined, { shallow: false });
  }, [toggledFilterList, startPrice, endPrice]);

  useEffect(() => {
    let list: Array<productProps> = productList;

    if (searchingWord.length > 0) {
      list = list.filter((product) => product.name.toUpperCase().includes(searchingWord.toUpperCase()));
    }
    
    setShowingProductList(list);
  }, [productList, searchingWord]);

  useEffect(() => {
    const observer = new IntersectionObserver(intersect, {
      threshold: 0.3,
      root: null,
    });

    if (showMoreButtonRef.current) observer.observe(showMoreButtonRef.current);

    return () => {
      observer.disconnect();
    }
  }, [intersect, showMoreButtonRef.current]);

  useEffect(() => {
    setProductList(serverSideProps.productList);
  }, [serverSideProps]);

  // component
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
            <div className={style.searchIcon}>
              <Image src={searchIcon.image} alt={searchIcon.name} />
            </div>
            <input type="text" value={searchingWord} onChange={(event) => onChangeSearchingWord(event)} />
          </div>
        </div>
      </div>
    )
  }

  // main
  return (
    <div ref={shopPageRef}>
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
              showingFilter == "가격" ? filterPrice()
              : showingFilter == "검색어" ? filterSearch()
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
      <div className={style.products}>
        <div className={style.productsSection}>
          <div className={style.productListState}>
            <div>
              <h4>{productQuantity}개의 결과</h4>
            </div>
            <div>
              <h4>추천순</h4>
            </div>
          </div>
          <div className={style.productsList}>
            {
              showingProductList.map((product, index) => (
                <div className={style.product} key={index}>
                  <div className={style.productImage}>
                    <Image src={fetchingLogoImage.image} alt={fetchingLogoImage.name} />
                  </div>
                  <div className={style.productDescription}>
                    <div className={style.productText}>
                      <div className={style.productName}>
                        <h4>{product.name}</h4>
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
                            <h3>{(product.price - (product.price / product.promotion)).toFixed().toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</h3>
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
            ((searchingProductQuantity * (searchingProductListPage + 1)) < productQuantity) && searchingWord.length === 0 ? (
              <div className={style.showMoreProductList}>
                <div className={style.showMoreProductListButton} ref={showMoreButtonRef}>
                  <button onClick={onClickShowMoreProductListButton}>
                    <h4>더보기 ({searchingProductQuantity * (searchingProductListPage + 1)} / {productQuantity})</h4>
                  </button>
                </div>
              </div>
            )
            : (
              <div className={style.showMoreProductList}>
                <h4>END :)</h4>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default memo(shop);

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
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
    return {
      props: {}
    };
  }
}