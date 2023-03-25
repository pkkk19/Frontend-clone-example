import React from "react";
import CategoryFilter from "../../category-filter";
import SearchInput from "../../form/search-input";
import SelectAddress from "../../form/drop-down";
import GoBack from "../../go-back";
import TimeRange from "../../time-range";
import SearchFilter from "../../search-filter";
import Balance from "../../balance";

function SiderHorizontal({
  goBack,
  address,
  searchFilter,
  timeRange,
  balance,
  categoryFilter,
  searchContent,
  handleFilter,
  getNearbyShops,
  search,
  setSearch,
  searchStore,
}) {
  return (
    <>
      <div className="store-header">
        {goBack && <GoBack />}
        {searchContent && (
          <SearchInput
            searchStore={searchStore}
            setSearch={setSearch}
            search={search}
            width={332}
            placeholder="Search Store"
          />
        )}
        {categoryFilter && (
          <CategoryFilter
            getNearbyShops={getNearbyShops}
            handleFilter={handleFilter}
            width={439}
          />
        )}
        {address && <SelectAddress />}
        {searchFilter && <SearchFilter />}
        {timeRange && <TimeRange width={210} />}
        {balance && <Balance width={138} />}
      </div>
    </>
  );
}

export default SiderHorizontal;
