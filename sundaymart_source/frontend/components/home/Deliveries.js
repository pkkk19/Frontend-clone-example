import { images } from "../../constants/images";
import { getStaticImage } from "../../utils/getImage";
const Deliveries = () => {
  return (
    <div className="container section">
      <div className="get_deliveries">
        <div className="deliveries-wrapper">
          <div className="item deliveries">
            <div className="title">Get deliveries with Githubit</div>
            {getStaticImage(images.MobileApp)}
          </div>
          <div className="store_market">
            <div className="company_logo">
              {getStaticImage(images.PlayStore)}
            </div>
            <div className="company_logo">
              {getStaticImage(images.AppStore)}
            </div>
          </div>
        </div>
        <div className="deliveries-wrapper">
          <div className="item mobileapp">
            <div className="title">Become a Shopper Mobil app</div>
            {getStaticImage(images.Deliveries)}
          </div>
          <div className="store_market">
            <div className="company_logo">
              {getStaticImage(images.PlayStore)}
            </div>
            <div className="company_logo">
              {getStaticImage(images.AppStore)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deliveries;
