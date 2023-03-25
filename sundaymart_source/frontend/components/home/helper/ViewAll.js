import Link from "next/link";
import { useTranslation } from "react-i18next";

const ViewAll = () => {
  const { t: tl } = useTranslation();
  return (
    <Link href="/all-store">
      <a className="view_all">{tl("View all")}</a>
    </Link>
  );
};

export default ViewAll;
