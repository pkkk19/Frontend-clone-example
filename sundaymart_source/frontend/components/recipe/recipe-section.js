import React from "react";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import { useTranslation } from "react-i18next";

const RecipeSection = ({
  children,
  title = "Recipe Section",
  to,
  className = "",
}) => {
  const { t: tl } = useTranslation();
  return (
    <section className="product-section recipe-section">
      <div className="section-header">
        <div className="title">{title}</div>
        {to && (
          <Link href={to}>
            <a className="see-all">
              {tl("See all")}
              <ArrowRightSLineIcon size={20} />
            </a>
          </Link>
        )}
      </div>
      <div className={`section-content ${className}`}>{children}</div>
    </section>
  );
};

export default RecipeSection;
