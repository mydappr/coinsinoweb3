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
    <div className="my-2  flex justify-between  md:justify-center md:space-x-5">
      {splittedWinningValues.length > 5 ? (
        splittedWinningValues.map((e, i) => (
          <div key={i} className="mx-[1.5px] md:mx-0">
            <Image height={70} width={70} src={`/images/${e}.png`} />{" "}
          </div>
        ))
      ) : (
        <div className="waiting"></div>
      )}
    </div>
  );
}

export default RandomImage;
