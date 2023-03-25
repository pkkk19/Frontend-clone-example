import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { storeFilterItems } from "../../constants";

function CategoryFilter({
  width = 200,
  handleFilter = () => {},
  getNearbyShops = () => {},
}) {
  const { t: tl } = useTranslation();
  const [active, setActive] = useState(null);
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
    if (item.id === "near_you") getNearbyShops();
    if (item.id === "all") handleFilter();
  };
  return (
    <div style={{ width: width }} className="category-filter">
      {storeFilterItems.map((item, key) => (
        <div
          key={key}
          className={active === item.value ? "item active" : "item"}
          onClick={() => handleCategory(item)}
        >
          {tl(item.value)}
        </div>
      ))}
    </div>
  );
}

export default CategoryFilter;
