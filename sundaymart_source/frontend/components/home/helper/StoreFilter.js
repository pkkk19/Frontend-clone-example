import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FilterOutline,
  LocationOutline,
} from "../../../public/assets/images/svg";
import { storeFilterItems } from "../../../constants";
import SearchInput from "../../form/search-input";
import useDebounce from "../../../hooks/useDebounce";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
const StoreFilter = ({
  handleFilter,
  getNearbyShops,
  search,
  searchStore,
  setSearch,
}) => {
  const { t: tl } = useTranslation();
  const router = useRouter();
  const [active, setActive] = useState(null);
  const debouncedSearchTerm = useDebounce(search, 1000);
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

  useEffect(() => {
    setActive(storeFilterItems[0].value);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm || debouncedSearchTerm === null) {
      searchStore();
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="store_filter">
      <div className="left">
        <div className="filter_btn">
          <FilterOutline />
        </div>
        <div className="category">
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
      </div>
      <div className="right">
        <SearchInput width={"100%"} setSearch={setSearch} />
        {getButton(router, tl)}
      </div>
    </div>
  );
};

const getButton = (router, tl) => {
  return (
    <>
      {router.pathname === "/view-in-map" ? (
        <Link href="/">
          <a className="get_location">
            <LocationOutline />
            {tl("View in list")}
          </a>
        </Link>
      ) : (
        <Link href="/view-in-map">
          <a className="get_location">
            <LocationOutline />
            {tl("View in map")}
          </a>
        </Link>
      )}
    </>
  );
};

export default StoreFilter;
