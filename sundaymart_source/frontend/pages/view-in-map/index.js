import React from "react";
import GoogleMap from "../../components/map";
import SEO from "../../components/seo";
import Store from "../../components/view-in-map/stores";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import StoreFilter from "../../components/home/helper/StoreFilter";
import { ShopContext } from "../../context/ShopContext";

function ViewInMap() {
  const { userLocation } = useContext(AuthContext);
  const {
    stores,
    search,
    setSearch,
    getNearbyShops,
    handleFilter,
    searchStore,
  } = useContext(ShopContext);

  useEffect(() => {
    getNearbyShops();
  }, [userLocation]);

  return (
    <>
      <SEO />
      <div className="container">
        <StoreFilter
          handleFilter={handleFilter}
          getNearbyShops={getNearbyShops}
          searchStore={searchStore}
          search={search}
          setSearch={setSearch}
        />
      </div>
      <div className="all_store_location">
        <Store stores={stores} />
        <GoogleMap stores={stores} />
      </div>
    </>
  );
}

export default ViewInMap;
