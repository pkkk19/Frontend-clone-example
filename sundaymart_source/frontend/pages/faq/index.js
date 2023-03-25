import React, { useState } from "react";
import nookies from "nookies";
import SEO from "../../components/seo";
import axiosService from "../../services/axios";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import RiveResult from "../../components/loader/rive-result";
import Footer from "../../components/footer";

const Faq = ({ faqDetail }) => {
  const [open, setOpen] = useState("");
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  return (
    <>
      <SEO />
      <div className="container">
        <div className="tab-pane-custom ">
          <div className="title">FAQ</div>
          {faqDetail?.map((item, id) => (
            <Accordion key={id} flush open={open} toggle={toggle}>
              <AccordionItem>
                <AccordionHeader targetId={id}>
                  {item.translation.question}
                </AccordionHeader>
                <AccordionBody accordionId={id}>
                  <div className="typography">
                    <p>{item.translation.answer}</p>
                  </div>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          ))}
          {faqDetail?.length === 0 && (
            <RiveResult text="There are not items in faq page" />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_id = cookies?.language_id;
  const language_locale = cookies?.language_locale;
  const faq = await axiosService.get(`/rest/faqs/paginate`, {
    params: { language_id, lang: language_locale },
  });

  let faqDetail = faq.data.data;
  return { props: { faqDetail } };
}
export default Faq;
