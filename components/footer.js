import { ChevronDoubleUpIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Footer({ scrollTargetElementRef }) {
  const [atTheTop, setAtTheTop] = useState(false);
  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset === 0) {
        setAtTheTop(true);
      } else setAtTheTop(false);
    };

    return () => (window.onscroll = null);
  });

  function goToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
  return (
    <div className="w-full  bg-coinSinoPurple">
      <footer className="  mx-auto  flex flex-col items-center justify-between space-y-3  p-2 md:max-w-2xl md:flex-row lg:max-w-4xl xl:max-w-6xl ">
        <div className="my-5 mt-10 mb-28 space-y-2 ">
          {" "}
          <div className="w-25 hidden cursor-pointer md:inline">
            <Image height={30} width={120} src={"/images/logoForDarkBg.png"} />
          </div>
          <p className="text-lg text-coinSinoTextColor2">
            © 2022 coinSino. All Rights Reserved.
          </p>
          <ul className="flex space-x-2">
            <li className="group cursor-pointer">
              <img
                className="w-15 h-15 group-hover:hidden"
                src={"/images/twitterActive.png"}
              />
              <img
                className="w-15 h-15 hidden group-hover:inline"
                src={"/images/twitterInActive.png"}
              />
            </li>

            <li className="group cursor-pointer">
              <img
                className="w-15 h-15 group-hover:hidden"
                src={"/images/fbActive.png"}
              />
              <img
                className="w-15 h-15 hidden group-hover:inline"
                src={"/images/fbInActive.png"}
              />
            </li>

            <li className="group cursor-pointer">
              <img
                className="w-15 h-15 group-hover:hidden"
                src={"/images/instagramActive.png"}
              />
              <img
                className="w-15 h-15 hidden group-hover:inline"
                src={"/images/instagramInActive.png"}
              />
            </li>

            <li className="group cursor-pointer">
              <img
                className="w-15 h-15 group-hover:hidden"
                src={"/images/githubActive.png"}
              />
              <img
                className="w-15 h-15 hidden group-hover:inline"
                src={"/images/githubInActive.png"}
              />
            </li>

            <li className="group cursor-pointer">
              <img
                className="w-15 h-15 group-hover:hidden"
                src={"/images/mediumActive.png"}
              />
              <img
                className="w-15 h-15 hidden group-hover:inline"
                src={"/images/mediumInActive.png"}
              />
            </li>

            <li className="group cursor-pointer">
              <img
                className="w-15 h-15 group-hover:hidden"
                src={"/images/telegramActive.png"}
              />
              <img
                className="w-15 h-15 hidden group-hover:inline"
                src={"/images/telegramInActive.png"}
              />
            </li>
          </ul>
        </div>

        <div className="-order-1 my-5 flex w-full items-center justify-between  px-3 sm:justify-around md:order-1 md:max-w-sm md:justify-around md:px-0 lg:justify-between ">
          <div className="space-y-2 text-coinSinoTextColor">
            <h2 className="text-center font-bold text-coinSinoGreen">
              Helpful Links
            </h2>
            <div className=" flex flex-col items-center  space-y-2  sm:items-start">
              <a className="w-fit cursor-pointer">Blog</a>
              <Link href={"/faq"}>
                <a className="  w-fit cursor-pointer">Faq</a>
              </Link>
              <a className="w-fit cursor-pointer">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {!atTheTop && (
        <button
          onClick={goToTop}
          className=" z-90 fixed bottom-20 right-8 h-12 w-12 rounded-full  border-0  bg-coinSinoPink  text-3xl font-bold text-white outline-none drop-shadow-md sm:bottom-8 sm:block sm:h-14 sm:w-14 sm:text-5xl"
        >
          <ChevronDoubleUpIcon className="mx-auto mt-0 h-7" />
        </button>
      )}
    </div>
  );
}

export default Footer;
