import React, { useContext, useEffect, useState } from "react";
import Slider from "rc-slider";
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../../context/MainContext";
import { parseCookies } from "nookies";
import { useTranslation } from "react-i18next";
import RiveResult from "../loader/rive-result";
import { useRouter } from "next/router";
import useDebounce from "../../hooks/useDebounce";
import QueryString from "qs";
import { setSort } from "../../redux/slices/mainState";

const FilterContent = () => {
  const dispatch = useDispatch();
  const { t: tl } = useTranslation();
  const router = useRouter();
  const cookies = parseCookies();
  const currency_symbol = cookies.currency_symbol;
  const category = useSelector((state) => state.category.categoryList);
  const sort = useSelector((state) => state.mainState.sort);
  const [range, setRange] = useState([]);
  const [showRange, setShowRange] = useState([1, 10000]);
  const debouncedSearchTerm = useDebounce(range, 1000);

  const handleChange = (value) => {
    setRange(value);
    setShowRange(value);
  };
  const handleSort = (sort) => {
    handleFilter({ sort });
    dispatch(setSort(sort));
  };

  const handleFilter = ({ category_id, range = [], sort }) => {
    const id = router.query.id;
    const prevCategoryId = router.query.category_id;
    const prevFrom = router.query.price_from;
    const prevTo = router.query.price_to;
    const prevSort = router.query.sort;
    const str = QueryString.stringify({
      category_id: category_id ? category_id : prevCategoryId,
      price_from: range[0] ? range[0] : prevFrom,
      price_to: range[1] ? range[1] : prevTo,
      sort: sort ? sort : prevSort,
      column_price: sort || prevSort ? "price" : undefined,
    });
    router.push(`/stores/${id}/all-product?${str}`);
  };
  useEffect(() => {
    if (debouncedSearchTerm.length) {
      handleFilter({ range });
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="filter-content">
      <div className="title">{tl("Category")}</div>
      <div className="categories">
        {category
          ?.filter((item) => item.translation !== null)
          ?.map((item, key) => (
            <div
              key={key}
              className={`category-item ${
                router.query.category_id == item.id ? "active" : ""
              }`}
              onClick={() => handleFilter({ category_id: item.id })}
            >
              {item.translation?.title}
            </div>
          ))}
        {category?.length === 0 && <RiveResult />}
      </div>
      <div className="price-rage">
        <span>{`${currency_symbol ? currency_symbol : "$"} ${
          showRange ? showRange[0] : 0
        } - `}</span>
        <span>{`${currency_symbol ? currency_symbol : "$"} ${
          showRange ? showRange[1] : 0
        }`}</span>
      </div>
      <div className="filter-slider">
        <Slider
          range
          allowCross={false}
          defaultValue={[1, showRange[1]]}
          min={1}
          max={10000}
          onChange={(value) => handleChange(value)}
        />
      </div>
      <div className="price">
        <div className="low-high">
          <button
            className={sort === "asc" ? "active" : ""}
            onClick={() => handleSort("asc")}
          >
            {tl("By low price")}
          </button>
          <button
            className={sort === "desc" ? "active" : ""}
            onClick={() => handleSort("desc")}
          >
            {tl("By high price")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterContent;
