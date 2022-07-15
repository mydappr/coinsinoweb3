import { useEffect, useState } from "react";
import { Tabs } from "flowbite-react";
import { BeakerIcon, PlayIcon } from "@heroicons/react/solid";
import RandomImage from "./randomenumber";

function SectionB({ lastDraw }) {
  const [lastDrawTime, setLastDrawTime] = useState(lastDraw);
  const [roundCount, setRoundCount] = useState(123);

  return (
    <section className="   my-0  mx-auto mt-10 mb-20 w-full p-2 text-white md:max-w-2xl lg:max-w-4xl    xl:max-w-6xl   ">
      <h2 className=" text-center text-lg font-bold text-coinSinoGreen">
        Finished Rounds
      </h2>
      <div>
        <Tabs.Group aria-label="finished rounds" style="underline">
          <Tabs.Item active={true} title="All History">
            {/* all history content */}
            <div>
              <div className="flex justify-between p-3">
                <PlayIcon
                  onClick={() => {
                    const { year, month, date, hour, second } = lastDrawTime;
                    date > 1 && --date;
                    setLastDrawTime({ year, month, hour, second, date });
                    setRoundCount(roundCount - 1);
                  }}
                  className=" h-10  rotate-180 cursor-pointer rounded-full  bg-white text-coinSinoPurple "
                />
                <div className=" ">
                  <div className="mx-auto my-2 w-fit space-y-2 text-center">
                    <h2 className="font-bold text-coinSinoTextColor ">Round</h2>
                    <p className="bg-coinSinoPurple p-2 text-xl font-bold text-coinSinoGreen ">
                      #{roundCount}
                    </p>
                  </div>{" "}
                  <div className="my-5 text-coinSinoTextColor2 ">
                    {`${lastDrawTime.month}
                ${lastDrawTime.date},
                 ${lastDrawTime.year},`}
                    <span>
                      {lastDrawTime.hour}:{lastDrawTime.minute}
                      {lastDrawTime.second}
                    </span>
                    <span className="ml-1">{lastDrawTime.amPm}</span>
                  </div>
                </div>
                <PlayIcon
                  onClick={() => {
                    const todayDate = new Date().getDate();
                    const { year, month, date, hour, second } = lastDrawTime;
                    date < todayDate && ++date;
                    setLastDrawTime({ year, month, hour, second, date });
                    setRoundCount(roundCount + 1);
                  }}
                  className=" h-10  cursor-pointer rounded-full bg-white text-coinSinoPurple"
                />
              </div>
              <div className=" text-md space-y-10 border-t-[1px] border-coinSinoTextColor2 text-center">
                <h2 className="my-5 font-bold text-coinSinoTextColor">
                  Winning Number
                </h2>
                <RandomImage />
                <p>
                  Your pool ticket: You have{" "}
                  <strong className="textlg font-bold text-coinSinoGreen">
                    34
                  </strong>{" "}
                  ticket for this round.{" "}
                  <span className="block cursor-pointer italic text-coinSinoGreen underline">
                    view your ticket
                  </span>
                </p>
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Your History"></Tabs.Item>
        </Tabs.Group>
      </div>
    </section>
  );
}

export default SectionB;
