import Image from "next/image";
import { useRecoilState } from "recoil";
import { winningNumbers } from "../atoms/atoms";

// let  randomNumb = [1, 2, 3, 4, 5, 6];
// function shuffle(array) {
//   let currentIndex = array.length,  randomIndex;

//   // While there remain elements to shuffle.
//   while (currentIndex != 0) {

//     // Pick a remaining element.
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;

//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex], array[currentIndex]];
//   }

//   return array;
// }
// const a = shuffle(randomNumb)

function RandomImage() {
  const [winningNo, setWinningNO] = useRecoilState(winningNumbers);

  // convert winning number to array
  const splittedWinningValues = Array.from(String(winningNo));

 

  return (
    <>
      {splittedWinningValues.length > 5 ? (
        <div className="mx-auto  mt-0 flex    max-w-lg  items-center justify-between  ">
          {splittedWinningValues.map((e, i) => {
            const balls =
              i === 0
                ? "pinkball"
                : i == 1
                ? "brownball"
                : i == 2
                ? "deepgreenball"
                : i == 3
                ? "pinkball"
                : i == 4
                ? "greenball"
                : "yellowball";
            const negetiveAngle = i % 2 !== 0 ? "-" : "";

            return (
              <div
                key={i}
                className={`relative  h-[45px] w-[80%]    items-center   rounded-full  bg-center sm:h-[68px]  ${negetiveAngle}rotate-12  bg-[url('/images/${balls}.svg')] bg-no-repeat `}
              >
                {" "}
                <div className="shadow-[2px]  absolute right-0 left-0 top-2 bottom-0 text-center  text-[21px]   font-bold   blur-[0.8px] sm:text-[35px] ">
                  {e}
                </div>
                <div className="shadow-[2px] absolute right-0 left-0 top-2  text-[20px]    font-bold text-black sm:text-[34px]">
                  {e}
                </div>
              </div>
            );
          })}

          {/* <div className="h-14 w-14 rounded-full bg-[url('/images/yellowball.svg')] bg-no-repeat">
          <p className="  font-bold text-white  shadow-black    drop-shadow">
            {splittedWinningValues[2]}
          </p>
        </div>
        <div className="h-14 w-14 rounded-full bg-[url('/images/deepgreenball.svg')]  bg-no-repeat">
          <p className="  font-bold text-white  shadow-black    drop-shadow">
            {splittedWinningValues[2]}
          </p>
        </div>
        <div className="h-14 w-14 rounded-full bg-[url('/images/brownball.svg')]  bg-no-repeat">
          <p className="  font-bold text-white  shadow-black    drop-shadow">
            {splittedWinningValues[2]}
          </p>
        </div>
        <div className="h-14 w-14 rounded-full bg-[url('/images/pinkball.svg')]   bg-no-repeat">
          <p className="  font-bold text-white  shadow-black    drop-shadow">
            {splittedWinningValues[2]}
          </p>
        </div>
        <div className="h-14 w-14 rounded-full bg-[url('/images/greenball.svg')]   bg-no-repeat">
          <p className="  font-bold text-white  shadow-black    drop-shadow">
            {splittedWinningValues[2]}
          </p>
        </div> */}
        </div>
      ) : (
        <div className="waiting w-40 md:w-80"></div>
      )}
    </>
  );
}

export default RandomImage;
