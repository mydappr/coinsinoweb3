import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
