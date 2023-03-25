import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { ShopApi } from "../../api/main/shops";
import { AuthContext } from "./AuthContext";
export const ShopContext = createContext();

const ShopContextProvider = ({ children, setLoader }) => {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(null);
  const [shopLoader, setShopLoader] = useState(false);
  const { userLocation } = useContext(AuthContext);
  const [page, setPage] = useState(2);

  const getNearbyShops = async () => {
    setShopLoader(true);
    setPage(2);
    ShopApi.getNearby({ clientLocation: userLocation })
      .then((res) => {
        setStores(res.data);
        setTotal(res.data.length);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setShopLoader(false);
      });
  };
  const getStore = (params = {}) => {
    setShopLoader(true);
    ShopApi.get({ page, ...params })
      .then((res) => {
        if (params.page) {
          setStores(res.data);
        } else {
          setStores([...stores, ...res.data]);
        }
        setTotal(res.meta.total);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setShopLoader(false);
      });
  };
  const handleFilter = (params = {}) => {
    setPage(2);
    params.page = 1;
    getStore(params);
  };
  const searchStore = () => {
    setLoader(true);
    ShopApi.search({ search })
      .then((res) => {
        setStores(res.data);
        setLoader(false);
        setTotal(res.data?.length);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };
  const handleLoadMore = () => {
    setStores([]);
    getStore();
    setPage((prev) => prev + 1);
  };
  const handleCategory = (params) => {
    getStore(params);
  };
  useEffect(() => {
    setSearch("");
    setPage(2);
  }, [router.pathname]);

  return (
    <ShopContext.Provider
      value={{
        stores,
        setStores,
        search,
        setSearch,
        page,
        setPage,
        getNearbyShops,
        getStore,
        handleFilter,
        handleLoadMore,
        searchStore,
        handleCategory,
        shopLoader,
        total,
        setTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
