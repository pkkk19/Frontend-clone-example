import React from "react";
import ChatSmile2LineIcon from "remixicon-react/ChatSmile2LineIcon";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { imgBaseUrl } from "../../constants";
const BlogCard = ({ blog }) => {
  const { t: tl } = useTranslation();
  return (
    <div className="blog-card">
      <div className="img-box">
        <Link href={`/blog/${blog.uuid}`}>
          <img src={imgBaseUrl + blog.img} alt="blog" />
        </Link>
      </div>
      <div className="name">{blog?.translation?.title}</div>
      <div className="description">{blog?.translation?.short_desc}</div>
      <div className="blog-footer">
        <div className="date-com">
          <div className="date">{blog?.published_at}</div>
          {/* <span></span> */}
          {/* <div className="comment">
            <ChatSmile2LineIcon size={20} />
            <div className="count">20</div>
          </div> */}
        </div>
        <Link href={`/blog/${blog.uuid}`}>
          <a className="read-more">{tl("read more")}</a>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
