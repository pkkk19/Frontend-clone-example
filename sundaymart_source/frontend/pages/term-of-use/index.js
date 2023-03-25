import React from "react";
import axiosService from "../../services/axios";
import SEO from "../../components/seo";
import nookies from "nookies";
import Footer from "../../components/footer";
const Term = ({ termDetail }) => {
  return (
    <>
      <SEO
        title={termDetail?.translation?.title}
        description={termDetail?.translation?.description}
        keywords={termDetail?.translation?.description}
      />
      <div className="container">
        <div className="tab-pane-custom">
          <div className="title">{termDetail?.translation?.title}</div>
          <div
            className="detail-text"
            dangerouslySetInnerHTML={{
              __html: termDetail?.translation?.description,
            }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};
export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const term = await axiosService.get(`/rest/term`, {
    params: { lang: language_locale },
  });

  let termDetail = term.data.data;
  return { props: { termDetail } };
}
export default Term;
