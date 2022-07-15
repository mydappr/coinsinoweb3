import Image from "next/image";

let  randomNumb = [1, 2, 3, 4, 5, 6];
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
const a = shuffle(randomNumb)
 

const resultImage = a.map((e) => {
  return {
    number: e,
    image: `/images/${e}.png`,
  };
});

function RandomImage() {
  return (
    <div className="flex  md:flex-wrap justify-between md:justify-center md:space-x-5 my-2">
      {resultImage.map((e) => {
        return (
          <div key={e.number} className='mx-[1.5px] md:mx-0'>
            <Image key={e.number} height={70} width={70} src={e.image} />
          </div>
        );
      })}
    </div>
  );
}

export default RandomImage;
