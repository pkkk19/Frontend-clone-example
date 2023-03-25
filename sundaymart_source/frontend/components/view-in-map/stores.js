import React from "react";
import RiveResult from "../loader/rive-result";
import StoreCard from "../stores/card";

function Store({ stores }) {
  return (
    <div className="store_location">
      {stores?.map((data, key) => (
        <StoreCard key={key} data={data} />
      ))}
      {stores?.length <= 0 && <RiveResult text="Shop not found" />}
    </div>
  );
}

export default Store;
