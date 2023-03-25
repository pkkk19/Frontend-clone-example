import React, { useContext, useEffect, useState } from "react";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import EqualizerLineIcon from "remixicon-react/EqualizerLineIcon";
import FlashlightFillIcon from "remixicon-react/FlashlightFillIcon";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { storeFilter } from "../../constants";
import Link from "next/link";
import OutsideAlerter from "../../hooks/useClickOutside";
import { MainContext } from "../../contexts/MainContext";
import { useTranslation } from "react-i18next";
import { ArrowRigthIcon, CheeseLineIcon } from "../../constants/images";
const Filter = ({ handleFilter = () => {}, shop_id }) => {
  const { t: tl } = useTranslation();
  const router = useRouter();
  const [active, setActive] = useState(null);
  const category = useSelector((state) => state.category.categoryList.data);
  const [sortName, setSortName] = useState({});
  const { setIsOpenDropdown, isOpenDropdown } = useContext(MainContext);

  const clickSort = (key) => {
    setSortName(key);
  };
  const handleCategory = (item) => {
    setActive(item.value);
    if (item.id === "open")
      handleFilter({
        open: true,
      });
    if (item.id === "delivery")
      handleFilter({
        delivery: "pickup",
      });
    if (item.id === "always_open")
      handleFilter({
        always_open: 1,
      });
    if (item.id === "new")
      handleFilter({
        new: "new",
      });
    if (item.id === "all") handleFilter();
  };
  useEffect(() => {
    setActive(storeFilter[0].value);
    if (category) {
      setSortName(category[0]);
    }
  }, []);
  let currentCategory = category?.find((item) => item.id === sortName?.id);
  const handleClick = (e, item) => {
    e.stopPropagation();
    clickSort(item);
    setIsOpenDropdown(false);
  };
  return (
    <div className="filter">
      {router.pathname === "/" ? (
        <div className="category filter-icon">
          <EqualizerLineIcon />
        </div>
      ) : (
        <OutsideAlerter>
          <div className="category" onClick={() => setIsOpenDropdown(true)}>
            <span>{sortName?.translation?.title}</span>
            <ArrowDownSLineIcon size={20} className="suffix" />
            <div
              className={isOpenDropdown ? "sort-items active" : "sort-items"}
            >
              {category?.map((item, key) => (
                <div
                  key={key}
                  className="item"
                  onClick={(e) => handleClick(e, item)}
                >
                  <span>{item.translation?.title}</span>
                </div>
              ))}
            </div>
          </div>
        </OutsideAlerter>
      )}
      <div className="items">
        {router.pathname === "/" &&
          storeFilter.map((item, key) => (
            <div
              key={key}
              className={active === item.value ? "item active" : "item"}
              onClick={() => handleCategory(item)}
            >
              {tl(item.value)}
            </div>
          ))}
        {router.pathname !== "/" &&
          (currentCategory?.children.length > 0 ? (
            currentCategory?.children?.map((item, key) => (
              <Link
                key={key}
                href={`/stores/${shop_id}/all-product?category_id=${item.id}`}
              >
                <a className="item">{item.translation?.title}</a>
              </Link>
            ))
          ) : (
            <div className="item">{tl("No children")}</div>
          ))}
      </div>
      <div className="filter-links">
        <Link href="/stores/often-buy">
          <div className="btn link">
            <div className="label">
              <FlashlightFillIcon size={32} color="#61DC00" />
              <span>{tl("Often buy")}</span>
            </div>
            <div className="suffix">
              <ArrowRigthIcon />
            </div>
          </div>
        </Link>
        <Link href="/stores/profitable">
          <div className="btn link">
            <div className="label">
              <CheeseLineIcon />
              {tl("Profitable today")}
            </div>
            <div className="suffix">
              <ArrowRigthIcon />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Filter;
