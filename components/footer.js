import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

function Footer({ scrollTargetElementRef }) {
  function goToTop() {
    scrollTargetElementRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div className="w-full  bg-coinSinoPurple">
      <footer className="  mx-auto  flex flex-col items-center justify-between space-y-3  p-2 md:max-w-2xl md:flex-row lg:max-w-4xl xl:max-w-6xl ">
        <div className="my-5 mt-10 mb-20 space-y-2 ">
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
          <a href="#_" className="group relative inline-block text-lg">
            <span className="relative z-10 block overflow-hidden rounded-lg border-2 border-gray-900 px-5 py-3 font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out group-hover:text-white">
              <span className="absolute inset-0 h-full w-full rounded-lg bg-coinSinoTextColor px-5 py-3"></span>
              <span className="ease absolute left-0 -ml-2 h-48 w-48 origin-top-right -translate-x-full translate-y-12 -rotate-90 bg-coinSinoPurple transition-all duration-300 group-hover:-rotate-180"></span>
              <span className="relative">Connect</span>
            </span>
            <span
              className="absolute bottom-0 right-0 -mb-1 -mr-1 h-12 w-full rounded-lg bg-gray-900 transition-all duration-200 ease-linear group-hover:mb-0 group-hover:mr-0"
              data-rounded="rounded-lg"
            ></span>
          </a>

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

      <button
        onClick={goToTop}
        className=" z-90 bottom-8 right-8 hidden sm:block  h-16  w-16 rounded-full border-0 bg-indigo-500 text-3xl font-bold text-white drop-shadow-md sm:fixed"
      >
        &uarr;
      </button>
    </div>
  );
}

export default Footer;
