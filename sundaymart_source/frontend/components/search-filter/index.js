import React, { useEffect, useState } from "react";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import EqualizerFillIcon from "remixicon-react/EqualizerFillIcon";
import SearchResult from "./search-result";
import FilterContent from "./filter-content";
import useDebounce from "../../hooks/useDebounce";
import axiosService from "../../services/axios";
import { useTranslation } from "react-i18next";
import OutsideAlerter from "../../hooks/useClickOutside";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
const SearchFilter = () => {
  const { t: tl } = useTranslation();
  const router = useRouter();
  const cookies = parseCookies();
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  function searchProduct(search) {
    let shop_id = null;
    if (router.query.id) shop_id = router.query.id;
    return axiosService(`/rest/products/search`, {
      params: { search, perPage: 50, shop_id, lang: cookies.language_locale },
    })
      .then((r) => r.data)
      .catch((error) => {
        console.error(error);
        return [];
      });
  }
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchProduct(debouncedSearchTerm).then((results) => {
        console.log(results);
        setIsSearching(false);
        setSearchResult(results);
      });
    } else {
      setSearchResult([]);
    }
  }, [debouncedSearchTerm]);
  const handleClick = (key) => {
    setVisible(key);
  };
  useEffect(() => {
    setSearchTerm("");
  }, []);
  return (
    <div
      className={
        visible === "search"
          ? "filter-wrapper search-visible"
          : visible === "filter"
          ? "filter-wrapper filter-visible"
          : "filter-wrapper"
      }
    >
      <OutsideAlerter
        visible={visible}
        setVisible={setVisible}
        className="search-filter"
      >
        <Search2LineIcon size={20} onClick={() => handleClick("search")} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => handleClick("search")}
          placeholder={tl("Search products")}
        />
        {router?.pathname !== "/product/[id]" && (
          <EqualizerFillIcon
            className="filter-icon"
            onClick={() => handleClick("filter")}
            size={20}
          />
        )}
        <SearchResult
          isSearching={isSearching}
          searchResult={searchResult}
          setSearchTerm={setSearchTerm}
          setVisible={setVisible}
        />
        <FilterContent isSearching={isSearching} />
      </OutsideAlerter>
    </div>
  );
};

export default SearchFilter;
