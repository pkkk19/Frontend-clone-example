import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShopContext } from "../../context/ShopContext";
import RiveResult from "../loader/rive-result";
import StoreSkeleton from "../skeleton/store-skeleton";
import StoreCard from "../stores/card";
import StoreFilter from "./helper/StoreFilter";

const Store = ({ filter, totalCount }) => {
  const { t: tl } = useTranslation();
  const {
    stores,
    getNearbyShops,
    handleFilter,
    search,
    setSearch,
    searchStore,
    handleLoadMore,
    shopLoader,
    total,
    setTotal,
  } = useContext(ShopContext);
  useEffect(() => {
    setTotal(totalCount);
  }, []);
  return (
    <div className="container">
      {filter && (
        <StoreFilter
          handleFilter={handleFilter}
          getNearbyShops={getNearbyShops}
          setSearch={setSearch}
          search={search}
          searchStore={searchStore}
        />
      )}
      <div className="store">
        {stores?.map((data, key) => (
          <StoreCard key={key} data={data} />
        ))}
        {shopLoader && (
          <>
            <StoreSkeleton />
            <StoreSkeleton />
          </>
        )}
        {stores?.length <= 0 && !shopLoader && (
          <RiveResult text="Shop not found" />
        )}
      </div>
      {total > 0 && total > stores?.length && stores?.length > 0 && (
        <div className="view_all" onClick={handleLoadMore}>
          {tl("Load more")}
        </div>
      )}
    </div>
  );
};

export default Store;
