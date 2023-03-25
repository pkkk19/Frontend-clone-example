import React, { useContext, useState } from "react";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import EqualizerFillIcon from "remixicon-react/EqualizerFillIcon";
import HistoryLineIcon from "remixicon-react/HistoryLineIcon";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { MainContext } from "../../../utils/context/MainContext";

function SearchFilter({ width = 200, placeholder = "Search and filter" }) {
  const { toggleSearch, setToggleSearch } = useContext(MainContext);

  return (
    <div
      style={{ width: width }}
      className="search-filter"
      onClick={() => setToggleSearch(true)}
    >
      <div className="search-icon">
        <Search2LineIcon size={20} />
      </div>
      <input placeholder={placeholder} disabled={true} />
      <div className="equalizer">
        <EqualizerFillIcon size={20} />
      </div>
      <Offcanvas
        className="drawer-filter-search"
        direction="top"
        isOpen={toggleSearch}
        toggle={() => setToggleSearch(false)}
      >
        <OffcanvasHeader>
          <div className="search-icon">
            <Search2LineIcon size={20} />
          </div>
          <input placeholder={placeholder} />
          <div className="equalizer">
            <EqualizerFillIcon size={20} />
          </div>
        </OffcanvasHeader>
        <OffcanvasBody>
          {/* <div className="search-content">
            <div className="item">
              <div className="icon">
                <HistoryLineIcon size={20} />
              </div>
              <div className="name">Apple</div>
            </div>
            <div className="item">
              <div className="icon">
                <HistoryLineIcon size={20} />
              </div>
              <div className="name">Sneakers</div>
            </div>
            <div className="item">
              <div className="icon">
                <HistoryLineIcon size={20} />
              </div>
              <div className="name">T-shirt</div>
            </div>
          </div> */}
          <div className="filter-content">
            <div className="by-category">
              <div className="title">Category</div>
              <div className="items">
                <div className="item">New</div>
                <div className="item active">Grocery</div>
                <div className="item">Pets</div>
                <div className="item">Pharmacy</div>
                <div className="item active">Alcohol</div>
                <div className="item">Fashion</div>
                <div className="item">Beauty</div>
                <div className="item">Retail</div>
                <div className="item">Pickup</div>
              </div>
            </div>
            <div className="price">
              <div className="title">Category</div>
              <div className="price-range">$6 - $28</div>
              <div className="change-price"></div>
              <div className="sorts">
                <div className="sort-item active">Sort by low price</div>
                <div className="sort-item">Sort by high price</div>
              </div>
            </div>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
}

export default SearchFilter;
