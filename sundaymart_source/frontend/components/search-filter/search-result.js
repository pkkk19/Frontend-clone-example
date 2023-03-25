import React from "react";
import { useTranslation } from "react-i18next";
import RiveResult from "../loader/rive-result";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import Link from "next/link";
const SearchResult = ({ isSearching, searchResult, setVisible }) => {
  const { t: tl } = useTranslation();
  const onClick = () => {
    setVisible(false);
  };
  return (
    <div className="search-result-wrapper">
      {isSearching ? (
        `${tl("searching")}...`
      ) : !searchResult?.data?.length ? (
        <RiveResult />
      ) : (
        <div className="suggestion">
          <ul>
            {searchResult?.data?.map((suggestion, key) => (
              <li key={key}>
                <Search2LineIcon size={20} />
                <Link href={`/product/${suggestion.uuid}`}>
                  <a onClick={onClick}>
                    {suggestion.product.translation?.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
