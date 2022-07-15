import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";

function Winners() {
  return (
    <div>
      <Head>
        <title>Winners</title>
        <meta name="description" content="CoinSino Winners" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen flex flex-col justify-between ">
        <Header />
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Winners;
