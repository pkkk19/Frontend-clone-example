import React from "react";
import StoreCard from "../../components/stores/card";
import SiderHorizontal from "../../components/store-layout/sider-horizontal";
import SEO from "../../components/seo";
import { useSelector } from "react-redux";
import RiveResult from "../../components/loader/rive-result";
import { useTranslation } from "react-i18next";
function SavedStores() {
  const savedStores = useSelector((state) => state.savedStore.savedStoreList);
  const { t: tl } = useTranslation();
  return (
    <>
      <SEO />
      <SiderHorizontal
        searchContent={true}
        categoryFilter={true}
        address={true}
      />
      <div className="content">
        <h3>{tl("Saved stores")}</h3>
        <div className="store">
          {savedStores?.map((data, key) => (
            <StoreCard key={key} data={data} />
          ))}
          {savedStores?.length <= 0 && (
            <RiveResult text="There are no items in the saved stores" />
          )}
        </div>
      </div>
    </>
  );
}

export default SavedStores;
