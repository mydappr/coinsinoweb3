import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";

function Oddpool() {
  return (
    <div>
      <Head>
        <title>OddPool</title>
        <meta name="description" content="CoinSino OddPool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen flex-col justify-between ">
        <Header />
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Oddpool;
