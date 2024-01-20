import Image from "next/image"

import style from "@/styles/shop.module.css"

const shop = () => {
  interface StateProps {
    name: string;
    image: any;
  }

  const categories: string[] = ["전체", "의류"];
  const states: StateProps[] = [
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

  return (
    <div>
      <div className={style.header}>
        <div className={style.section}>
          <div className={style.title} onClick={reload}>
            <h2>FETCHING</h2>
          </div>
          <div className={style.category}>
            {categories.map((category, index) => (
              <h4 key={index}>{category}</h4>
            ))}
          </div>
          <div className={style.state}>
              {states.map((state, index) => (
                <Image key={index} src={state.image} alt={state.name} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default shop;