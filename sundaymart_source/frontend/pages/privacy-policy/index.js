import React from "react";
import SEO from "../../components/seo";
import axiosService from "../../services/axios";
import nookies from "nookies";
import Footer from "../../components/footer";
const PrivacyPolicy = ({ policyDetail = {} }) => {
  return (
    <>
      <SEO
        title={policyDetail?.data?.title}
        description={policyDetail.data?.description}
      />
      <div className="container">
        <div className="tab-pane-custom">
          <div className="title">
            <div
              className="termofuse"
              dangerouslySetInnerHTML={{
                __html: policyDetail.data?.translation?.title,
              }}
            />
          </div>
          <div className="termofuse">
            <div
              className="typography"
              dangerouslySetInnerHTML={{
                __html: policyDetail.data?.translation?.description,
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const policy = await axiosService.get(`/rest/policy`, {
    params: { lang: language_locale },
  });

  let policyDetail = policy.data;
  return { props: { policyDetail } };
}
export default PrivacyPolicy;
