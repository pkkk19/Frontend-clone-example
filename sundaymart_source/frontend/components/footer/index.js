import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import InputEmail from "../form/form-item/InputEmail";

const Footer = () => {
  const settings = useSelector((state) => state.settings.data);
  const { t: tl } = useTranslation();
  return (
    <div className="container section">
      <div className="footer">
        <div className="content">
          <div className="item">
            <ul>
              <li className="title">{tl("Contact")}</li>
              <li>{settings?.phone}</li>
              <li>{settings?.address}</li>
            </ul>
          </div>
          <div className="item">
            <ul>
              <li className="title">{tl("Social")}</li>
              <li>
                <a
                  href={settings["instagram"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tl("Instagram")}
                </a>
              </li>
              <li>
                <a
                  href={settings["facebook"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tl("Facebook")}
                </a>
              </li>
              <li>
                <a
                  href={settings["twitter"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tl("Twitter")}
                </a>
              </li>
            </ul>
          </div>
          <div className="item">
            <ul>
              <li className="title">{tl("Help")}</li>
              <Link href="/faq">
                <li>{tl("FAQ")}</li>
              </Link>
              <Link href="/term-of-use">
                <li>{tl("Term of use")}</li>
              </Link>
              <Link href="/privacy-policy">
                <li>{tl("Privacy Policy")}</li>
              </Link>
            </ul>
          </div>
          <div className="item">
            <ul>
              <li className="title">Subscription</li>
              <li className="subscription-form">
                <InputEmail placeholder="example@gmail.com" label="Email" />
                <Button>Subscribe</Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer>{settings?.footer_text}</footer>
    </div>
  );
};

export default Footer;
