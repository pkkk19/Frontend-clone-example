import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import useDebounce from "../../../hooks/useDebounce";
function SearchInput({
  width = 200,
  placeholder = "Search",
  search,
  setSearch = () => {},
  searchStore,
}) {
  const { t: tl } = useTranslation();
  const debouncedSearchTerm = useDebounce(search, 1000);

  useEffect(() => {
    if (debouncedSearchTerm || debouncedSearchTerm === null) searchStore();
  }, [debouncedSearchTerm]);
  return (
    <div style={{ width: width }} className="search-input">
      <div className="search-icon">
        <Search2LineIcon size={20} />
      </div>
      <input
        placeholder={tl(placeholder)}
        onChange={(e) => {
          if (e.target.value === "") {
            setSearch(null);
          } else setSearch(e.target.value);
        }}
      />
    </div>
  );
}

export default SearchInput;
