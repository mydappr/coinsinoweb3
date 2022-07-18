import { useEffect, useState } from "react";
import { Tabs } from "flowbite-react";
import { BeakerIcon, PlayIcon } from "@heroicons/react/solid";
import RandomImage from "./randomenumber";

function SectionB({}) {
  const [lastDrawTime, setLastDrawTime] = useState({});
  const [roundCount, setRoundCount] = useState(120);

  useEffect(() => {
    const now = new Date();
    const drawUtc = new Date(
      now.getFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
    drawUtc.setUTCHours(12);
    const month = drawUtc.toLocaleString("default", { month: "short" });
    const date = drawUtc.getDate();
    const year = drawUtc.getFullYear();
    const hour = drawUtc.getHours();
    const lastDraw = { month, date, year, hour };
    setLastDrawTime(lastDraw);
  }, []);
  // last
  const lastTimeDraw = (date = new Date()) => {
    const pastDraw = new Date(date.getTime());
    pastDraw.setUTCDate(date.getDate() - 1);
    return pastDraw;
  };
  // nextfrom Last
  const nextDay = (date = new Date()) => {
    const nextDay = new Date(date.getTime());
    nextDay.setUTCDate(date.getDate() + 1);
    return nextDay;
  };

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
                    // implement not update date before frst draw
                    let { year, month, date } = lastDrawTime;
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];

                    month = monthNames.indexOf(month, 0);

                    const oldNow = new Date();
                    oldNow.setFullYear(year);
                    oldNow.setMonth(month);
                    oldNow.setDate(date);
                    oldNow.setUTCHours(12);
                    if (roundCount > 1) {
                      const pastDraw = lastTimeDraw(
                        new Date(
                          oldNow.getFullYear(),
                          oldNow.getMonth(),
                          oldNow.getDate(),
                          oldNow.getHours()
                        )
                      );

                      const displayPastDraw = {
                        year: pastDraw.getFullYear(),
                        month: pastDraw.toLocaleString("default", {
                          month: "short",
                        }),
                        hour: pastDraw.getHours(),
                        date: pastDraw.getDate(),
                      };
                      setLastDrawTime(displayPastDraw);
                    }

                    roundCount > 1 && setRoundCount(roundCount - 1);
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
                      {lastDrawTime.hour}:{"0"}
                      {"0"}
                    </span>
                    <span className="ml-1">{lastDrawTime.amPm}</span>
                  </div>
                </div>
                <PlayIcon
                  onClick={() => {
                    let { year, month, date } = lastDrawTime;
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];

                    month = monthNames.indexOf(month, 0);

                    if (date < new Date().getDate()) {
                      setRoundCount(roundCount + 1);
                      const newNow = new Date();
                      newNow.setFullYear(year);
                      newNow.setMonth(month);
                      newNow.setDate(date);
                      newNow.setUTCHours(12);

                      const newxtDraw = nextDay(
                        new Date(
                          newNow.getFullYear(),
                          newNow.getMonth(),
                          newNow.getDate(),
                          newNow.getHours()
                        )
                      );

                      const displayPastDraw = {
                        year: newxtDraw.getFullYear(),
                        month: newxtDraw.toLocaleString("default", {
                          month: "short",
                        }),
                        hour: newxtDraw.getHours(),
                        date: newxtDraw.getDate(),
                      };
                      setLastDrawTime(displayPastDraw);
                    }
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
