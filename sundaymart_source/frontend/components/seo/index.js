import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { imgBaseUrl } from "../../constants";

export default function SEO({ title, description, image, keywords }) {
  const router = useRouter();
  const cookies = parseCookies();
  const site_title = "Sundaymart";
  const currentURL = process.env.NEXT_PUBLIC_BASE_URL + router?.asPath;
  return (
    <Head>
      <title>{title ? title : site_title}</title>
      <meta data-n-head="ssr" charSet="utf-8" />
      <meta
        data-n-head="ssr"
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta
        data-n-head="ssr"
        name="robots"
        data-hid="robots"
        content="index, follow"
      />
      <meta
        data-n-head="ssr"
        name="googlebot"
        data-hid="googlebot"
        content="index, follow"
      />
      <meta data-n-head="ssr" name="description" content={description} />
      <meta data-n-head="ssr" name="keywords" content={keywords} />
      <meta
        data-n-head="ssr"
        data-hid="og:url"
        property="og:url"
        content={currentURL}
      />
      <meta data-n-head="ssr" property="og:type" content="website" />
      <meta
        data-n-head="ssr"
        property="og:title"
        content={site_title}
        key="ogtitle"
      />
      <meta
        data-n-head="ssr"
        property="og:description"
        content={description}
        key="ogdesc"
      />
      <meta
        data-n-head="ssr"
        data-hid="og:site_name"
        property="og:site_name"
        content={site_title}
      />
      <meta
        property="og:image"
        content={image || imgBaseUrl + cookies.favicon}
        key="ogimage"
      />
      <meta
        data-n-head="ssr"
        data-hid="twitter:url"
        name="twitter:url"
        content={currentURL}
      />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title ? `${title}` : site_title} />
      <meta name="twitter:description" content={description} />
      <meta
        data-n-head="ssr"
        data-hid="twitter:creator"
        name="twitter:creator"
        content={`@${currentURL}`}
      />
      <meta
        data-n-head="ssr"
        data-hid="twitter:site"
        name="twitter:site"
        content={`@${currentURL}`}
      />
      <meta
        data-n-head="ssr"
        name="twitter:image"
        content={image || imgBaseUrl + cookies.favicon}
      />
      <link rel="icon" href={imgBaseUrl + cookies.favicon} />
    </Head>
  );
}
