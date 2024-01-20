import Image from "next/image"
import style from "@/styles/shop.module.css"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useEffect, useState } from "react";
import { exit } from "process";

const shop = () => {
  type ImageIcons = string | StaticImport;

  interface iconProps {
    name: string;
    image: ImageIcons;
  }
  interface filterOptionsProps {
    name: string;
    isClicked: boolean;
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
  }
  const clickedFilterOption = (name: filterOptionsProps["name"]) => {
    if (name == filterOptions[0].name) {
      filterOptions[0].isToggled = !filterOptions[0].isToggled;
      setFilterOptions([...filterOptions]);

      return;
    }

    filterOptions.map((option) => {
      if (option.name == name) {
        option.isClicked = true;
        setFilterOptions([...filterOptions]);
      }
      else {
        option.isClicked = false;
        setFilterOptions([...filterOptions]);
      }
    })
  }
  const clickedBrand = (name: brandsProps["name"]) => {
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
      filterOptions[1].isToggled = true;
      setFilterOptions([...filterOptions]);
    }
    else {
      filterOptions[1].isToggled = false;
      setFilterOptions([...filterOptions]);
    }
  }

  const [expandFilter, setExpandFilter] = useState<boolean>(false);
  const [brands, setBrands] = useState<Array<brandsProps>>([]);
  const [filterOptions, setFilterOptions] = useState<Array<filterOptionsProps>>([
    {
      name: "신상",
      isClicked: false,
      isToggled: false,
    },
    {
      name: "브랜드",
      isClicked: false,
      isToggled: false,
    },
    {
      name: "가격",
      isClicked: false,
      isToggled: false,
    },
    {
      name: "프로모션",
      isClicked: false,
      isToggled: false,
    },
  ]);

  const filterBrand = () => {
    return (
      <div className={`${style.select} ${style.fadeIn}`}>
        <div className={style.search}>
          <div className={style.image}>
            <Image src={searchIcon.image} alt={searchIcon.name} />
          </div>
          <div className={style.input}>
            <input type="text" />
          </div>
        </div>
        <div className={style.brands}>
          {
            brands.map((brand, index) => (
              <div className={style.brand} key={index}>
                <label>
                  <input id="brand" type="checkbox" checked={brand.isChecked} onChange={() => clickedBrand(brand.name)} />
                  <h4>{brand.name}</h4>
                </label>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  useEffect(() => {
    setBrands([...brands,
      {
        name: "나이키",
        isChecked: false,
      },
      {
        name: "뉴발란스",
        isChecked: false,
      },
      {
        name: "루이비통",
        isChecked: false,
      },
      {
        name: "자라",
        isChecked: false,
      },
      {
        name: "유니클로",
        isChecked: false,
      },
      {
        name: "아디다스",
        isChecked: false,
      },
      {
        name: "크리스찬디올",
        isChecked: false,
      },
      {
        name: "배럴",
        isChecked: false,
      },
    ]);
  }, []);

  return (
    <div>
      <div className={style.header}>
        <div className={style.section}>
          <div className={style.title} onClick={reload}>
            <h2>FETCHING</h2>
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
        <div className={style.section}>
          {
            expandFilter && (
              filterOptions[1].isClicked && (
                filterBrand()
              )
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
                    <h4 className={`${option.isClicked && style.clickedOption} ${option.isToggled && style.toggledOption}`} onClick={() => clickedFilterOption(option.name)} key={index}>{option.name}</h4>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default shop;