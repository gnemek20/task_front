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

  const addToCheckedBrandList = (brandName: typeBrandName) => {
    if (!checkedBrandList.includes(brandName)) setCheckedBrandList([...checkedBrandList, brandName]);
  }
  const deleteFromCheckedBrandList = (brandName: typeBrandName) => {
    if (checkedBrandList.includes(brandName)) setCheckedBrandList(checkedBrandList.filter((checkedBrand) => checkedBrand !== brandName));
  }

  const makeQueryString = (tFilterList: Array<typeFilterOptionName>, cBrandList: Array<typeBrandName>, sPrice: number, ePrice: number, sortingMethod: typeSortingMethodName) => {
    let query: string = "";
    const priceScale: number = 10000;

    tFilterList.map((filter) => {
      if (filter === "신상") {
        query = [query, "isNew=true"].join("&");
      }
      else if (filter === "할인중") {
        query = [query, "promotion_ne=0"].join("&");
      }
      else if (filter === "브랜드") {
        cBrandList.map((brandName) => {
          query = [query, `brand=${brandName}`].join("&");
        });
      }
      else if (filter === "가격") {
        if (sPrice == 0) {
          query = [query, `promotionalPrice_lte=${ePrice * priceScale}`].join("&");
        }
        else if (ePrice == 0) {
          query = [query, `promotionalPrice_gte=${sPrice * priceScale}`].join("&");
        }
        else if (sPrice > ePrice) {
          query = [query, `promotionalPrice_gte=${ePrice * priceScale}`].join("&");
          query = [query, `promotionalPrice_lte=${sPrice * priceScale}`].join("&");
        }
        else {
          query = [query, `promotionalPrice_gte=${sPrice * priceScale}`].join("&");
          query = [query, `promotionalPrice_lte=${ePrice * priceScale}`].join("&");
        }
      }
    });

    if (!tFilterList.includes("품절")) query = [query, "isOut=false"].join("&");

    if (sortingMethod === "높은 가격순") query = [query, "_sort=promotionalPrice&_order=desc"].join("&");
    else if (sortingMethod === "낮은 가격순") query = [query, "_sort=promotionalPrice&_order=asc"].join("&");
    else if (sortingMethod === "높은 할인순") query = [query, "_sort=promotion&_order=desc"].join("&");
    else if (sortingMethod === "낮은 할인순") query = [query, "_sort=promotion&_order=asc"].join("&");

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

  const onclickBrand = (brandName: typeBrandName) => {
    let checked = false;
    brandList.map((brand) => {
      if (brand.name == brandName) {
        brand.isChecked = !brand.isChecked;
        setBrandList([...brandList]);

        if (brand.isChecked) {
          addToCheckedBrandList(brandName);
          checked = true;
        }
        else deleteFromCheckedBrandList(brandName);
      }
      else if (!checked && brand.isChecked) {
        checked = true;
      }
    });

    if (checked) {
      filterOptionList.map((filter) => {
        if (filter.name == "브랜드") {
          addToToggledFilterList(filter.name);
          filter.isToggled = true;
        }
      });
    }
    else {
      filterOptionList.map((filter) => {
        if (filter.name == "브랜드") {
          deleteFromToggledFilterList(filter.name);
          filter.isToggled = false;
        }
      });
    }

    setFilterOptionList([...filterOptionList]);
  }

  const onClickShowingCheckedBrandList = () => {
    setIsShowingCheckedBrandList(!isShowingCheckedBrandList);
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
    const query: string = makeQueryString(toggledFilterList, checkedBrandList, startPrice, endPrice, checkedSortingMethod);

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
    shopPageRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const onClickEraseSearchingWord = () => {
    setSearchingWord("");

    filterOptionList.map((filter) => {
      if (filter.name === "검색어") {
        filter.isToggled = false;
      }
    });
    setFilterOptionList(filterOptionList);
  }

  const onClickSortingMethodButton = () => {
    setIsExpandedSortingMethod(!isExpandedSortingMethod);
  }

  const onClickChangeSortingMethodButton = (sortingMethodName: typeSortingMethodName) => {
    setCheckedSortingMethod(sortingMethodName);
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
        if (filter.name == "가격") {
          filter.isToggled = false;
          deleteFromToggledFilterList(filter.name);
        }
      });
    }

    setFilterOptionList([...filterOptionList]);
  }

  const onChangeSearchingBrandName = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchingBrandName(event.target.value);
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
    const query: string = makeQueryString(toggledFilterList, checkedBrandList, startPrice, endPrice, checkedSortingMethod);

    fetch(`http://localhost:3000/products?${query}`).then((res) => res.json()).then((data) => {
      setProductQuantity(data.length);
    });

    setSearchingProductListPage(0);
    router.push(`/shop?${query}`, undefined, { shallow: false });
  }, [toggledFilterList, checkedBrandList, startPrice, endPrice, checkedSortingMethod]);

  useEffect(() => {
    let mappedProductList: Array<productProps> = productList;

    if (searchingWord.length > 0) {
      mappedProductList = mappedProductList.filter((product) => product.name.toUpperCase().includes(searchingWord.toUpperCase()));
      shopPageRef.current?.scrollIntoView();
    }
    
    setShowingProductList(mappedProductList);
  }, [productList, searchingWord]);

  useEffect(() => {
    const observer: IntersectionObserver = new IntersectionObserver(intersect, {
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
            <input type="text" value={searchingWord} onChange={(event) => onChangeSearchingWord(event)} />
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