import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";

function Faq() {
  return (
    <div>
      <Head>
        <title>Faq</title>
        <meta name="description" content="CoinSino frequently asked question" />
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

export default Faq;
