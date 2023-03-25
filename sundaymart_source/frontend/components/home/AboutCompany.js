import { images } from "../../constants/images";
import { PlayOutline } from "../../public/assets/images/svg";
import { getStaticImage } from "../../utils/getImage";
const AboutCompany = () => {
  return (
    <div className="container section">
      <div className="about_campany">
        {getStaticImage(images.AboutCompany)}
        <div className="content">
          <div className="play_btn">
            <div className="play_icon">
              <PlayOutline />
            </div>
            About company
          </div>
          <div className="context">
            <div className="title">
              The world's largest online grocery service
            </div>
            <div className="item">
              <strong>40,000 stores</strong>
              From local grocers to chain stores
            </div>
            <div className="item">
              <strong>500 million products</strong>
              Available to shop across the catalog
            </div>
            <div className="item">
              <strong>Millions of orders</strong>
              Delivered or picked up yearly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany;
