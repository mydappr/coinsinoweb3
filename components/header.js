import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

function Header() {
  const router = useRouter();

  const naveStyle = (page) => {
    return `${router.pathname == `/${page}` ? "activeNave" : "inActiveNave"}`;
  };
  return (
    <div className=" mx-auto  w-full  max-w-5xl  ">
      {" "}
      <header className="sticky top-0    z-50 flex  items-center justify-between    border-b-[0.095rem]  border-coinSinoTextColor2 bg-coinSinoPurpleNav p-5 text-coinSinoTextColor   ">
        <Link href={"/"}>
          <a>
            {" "}
             
              <Image
                height={30}
                width={100}
                src={"/images/logoForDarkBg.png"}
              />
         
          </a>
        </Link>

        <ul className="fixed  bottom-0  left-0 z-10 flex h-16  w-full items-center justify-between rounded-xl border border-coinSinoTextColor2  bg-coinSinoPurpleNav p-5     text-white  sm:static   sm:top-0 sm:z-[51]  sm:float-right  sm:w-fit sm:space-x-3 sm:border-none ">
          <Link href={"/faq"}>
            <a className={naveStyle("faq")}>How to play</a>
          </Link>
          <Link href={"/winners"}>
            <a className={naveStyle("winners")}>Winner list</a>
          </Link>
          <Link href={"/oddPool"}>
            <a className={naveStyle("oddPool")}>The Odd pool</a>
          </Link>
        </ul>
      </header>
      {/* mobile menu/nav */}
    </div>
  );
}

export default Header;
