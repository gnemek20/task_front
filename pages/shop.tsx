import Image from "next/image"
import style from "@/styles/shop.module.css"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

const shop = () => {
  type ImageIcons = string | StaticImport;
  type typeStartEnd = "start" | "end";

  interface iconProps {
    name: string;
    image: ImageIcons;
  }
  interface filterOptionsProps {
    name: string;
    isClicked?: boolean;
    isToggled: boolean;
  }
  interface brandsProps {
    name: string;
    isChecked: boolean;
  }

  const filterIcon: iconProps = {
    name: "filter",
    image: require("@/public/icons/filterIcon.svg"),
  }
  const searchIcon: iconProps = {
    name: "search",
    image: require("@/public/icons/searchIcon.svg"),
  }

  const categories: string[] = ["전체", "의류", "신발", "악세서리"];
  const states: iconProps[] = [
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

  const reload = () => {
    window.location.reload();
  }

  const clickedFilterButton = () => {
    setExpandFilter(!expandFilter);
    setSearchBrands("");
  }
  const onclickFilterOption = (name: filterOptionsProps["name"]) => {
    if (exceptionFilterOptions.includes(name)) {
      filterOptions.map((option) => {
        if (option.name == name) {
          option.isToggled = !option.isToggled;
        }
      });
      setFilterOptions([...filterOptions]);

      return;
    }

    filterOptions.map((option) => {
      if (option.name == name) {
        option.isClicked = true;
        setFilterOptions([...filterOptions]);
        setRenderingFilter(name);
      }
      else if (!exceptionFilterOptions.includes(option.name)) {
        option.isClicked = false;
        setFilterOptions([...filterOptions]);
      }
    });
  }
  const onclickBrand = (name: brandsProps["name"]) => {
    let checked = false;
    brands.map((brand) => {
      if (brand.name == name) {
        brand.isChecked = !brand.isChecked;
        setBrands([...brands]);

        if (brand.isChecked) checked = true;
      }
      else if (!checked && brand.isChecked) {
        checked = true;
      }
    });

    if (checked) {
      filterOptions.map((option) => {
        if (option.name == "브랜드") {
          option.isToggled = true;
        }
      });
    }
    else {
      filterOptions.map((option) => {
        if (option.name == "브랜드") {
          option.isToggled = false;
        }
      });
    }

    setFilterOptions([...filterOptions]);
  }

  const onChangeSearchBrands = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchBrands(event.target.value);
  }
  const onclickStatusBrands = () => {
    setIsCheckedBrands(!isCheckedBrands);
  }

  const onChangePrices = (event: ChangeEvent<HTMLInputElement>, startEnd: typeStartEnd) => {
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
      filterOptions.map((option) => {
        if (option.name == "가격") {
          option.isToggled = true;
          return;
        }
      });
    }
    else {
      filterOptions.map((option) => {
        option.isToggled = false;
        return;
      });
    }

    setFilterOptions([...filterOptions]);
  }
  const onClickPrices = (event: MouseEvent<HTMLInputElement>, startEnd: typeStartEnd) => {
    (event.target as HTMLInputElement).value = "";

    if (startEnd == "start") setStartPrice(0);
    else if (startEnd == "end") setEndPrice(0);

    if ((startEnd == "start" ? endPrice : startPrice) > 0) {
      filterOptions.map((option) => {
        if (option.name == "가격") {
          option.isToggled = true;
          return;
        }
      });
    }
    else {
      filterOptions.map((option) => {
        option.isToggled = false;
        return;
      });
    }

    setFilterOptions([...filterOptions]);
  }
  const onClickResetPrices = () => {
    setStartPrice(0);
    setEndPrice(0);
    filterOptions.map((option) => {
      if (option.name == "가격") {
        option.isToggled = false;
        return;
      }
    });

    setFilterOptions([...filterOptions]);
  }

  const [expandFilter, setExpandFilter] = useState<boolean>(false);
  const [renderingFilter, setRenderingFilter] = useState<string>("브랜드");
  const [brands, setBrands] = useState<Array<brandsProps>>([]);
  const [searchBrands, setSearchBrands] = useState<string>("");
  const [isCheckedBrands, setIsCheckedBrands] = useState<boolean>(false);
  const [startPrice, setStartPrice] = useState<number>(0);
  const [endPrice, setEndPrice] = useState<number>(0);

  const exceptionFilterOptions: Array<filterOptionsProps["name"]> = ["신상", "품절", "할인중"];
  const [filterOptions, setFilterOptions] = useState<Array<filterOptionsProps>>([
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
      name: "브랜드",
      isClicked: true,
      isToggled: false,
    },
    {
      name: "가격",
      isClicked: false,
      isToggled: false,
    },
  ]);

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
                <input id="searchBrands" type="text" onChange={(event) => onChangeSearchBrands(event)} autoComplete="off" />
              </div>
            </div>
            <div className={`${style.status} ${isCheckedBrands && style.toggledStatus}`} onClick={onclickStatusBrands}>
              <h4>체크된 것만 보기</h4>
            </div>
          </div>
        </div>
        <div className={style.brands}>
          {
            brands.map((brand, index) => (
              brand.name.toUpperCase().includes(searchBrands.toUpperCase()) ? (
                !isCheckedBrands || brand.isChecked ? (
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
                <input id="startPrice" type="text" value={(startPrice > 0 ? startPrice : "") || ""} onClick={(event) => onClickPrices(event, "start")} onChange={(event) => onChangePrices(event, "start")} autoComplete="off" />
                <h4>만원부터</h4>
              </div>
              <div className="none">
                {/* 2번째 태그에 value가 포함된 input 태그를 작성하면 에러가 나요. */}
                {/* 발생 이유는 모르겠어요 😢 */}
                {/* Error: A component is changing an uncontrolled input to be controlled. */}
                {/* <input type="text" value={123} /> */}
              </div>
              <div>
                <input id="endPrice" type="text" value={(endPrice > 0 ? endPrice : "") || ""} onClick={(event) => onClickPrices(event, "end")} onChange={(event) => onChangePrices(event, "end")} autoComplete="off" />
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

  useEffect(() => {
    // fetch("http://localhost/data/productsData.json", {
    //   method: "GET",
    // }).then ((res) => res.json()).then((data) => {
    //   console.log(...data)
    // });

    setBrands([...brands,
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
  }, []);

  return (
    <div>
      <div className={style.header}>
        <div className={style.section}>
          <div className={style.title}>
            <h2 onClick={reload}>FETCHING</h2>
          </div>
          <div className={style.categories}>
            {
              categories.map((category, index) => (
                <h4 key={index}>{category}</h4>
              ))
            }
          </div>
          <div className={style.state}>
              {
                states.map((state, index) => (
                  <Image key={index} src={state.image} alt={state.name} />
                ))
              }
          </div>
        </div>
      </div>
      <div className={`${style.filter} ${expandFilter && style.expandedFilter}`}>
        <div className={`${style.section} ${expandFilter && style.expandedSection}`}>
          {
            expandFilter && (
              renderingFilter == "브랜드" ? filterBrand()
              : renderingFilter == "가격" ? filterPrice()
              : <div>Template Error</div>
            )
          }
          <div className={style.option}>
            <div className={style.button} onClick={clickedFilterButton}>
              {
                !expandFilter ? (
                  <h4>필터</h4>
                )
                : (
                  <h4>닫기</h4>
                )
              }
              <Image src={filterIcon.image} alt={filterIcon.name} />
            </div>
            {
              expandFilter && (
                <div className={`${style.options} ${style.fadeIn}`}>
                  {filterOptions.map((option, index) => (
                    <h4 className={`${option.isClicked && style.clickedOption} ${option.isToggled && style.toggledOption}`} onClick={() => onclickFilterOption(option.name)} key={index}>{option.name}</h4>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      </div>
      <div className={style.products}>
      </div>
    </div>
  );
}

export default shop;