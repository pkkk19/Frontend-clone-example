import GroceryDeliveryItem from "./helper/GroceryDeliveryItem";

const GroceryDelivery = () => {
  const list = [
    {
      id: "01",
      title: "Choose what you want",
      description: "Select items from your favorite grocery stores at Gmarket",
    },
    {
      id: "02",
      title: "See real-time updates",
      description: "Personal shoppers pick items with care.",
    },
    {
      id: "03",
      title: "Get your items same-day",
      description: "Enjoy Instacart's 100% quality guarantee on every order.",
    },
  ];
  return (
    <div className="container section">
      <div className="grocery_delivery">
        <div className="title">Grocery delivery you can count on</div>
        <div className="items">
          {list?.map((item, key) => {
            return <GroceryDeliveryItem key={key} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default GroceryDelivery;
