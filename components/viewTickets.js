import { useRecoilState } from "recoil";
import {
  rouncount,
  viewTicket,
  userTickets as accountTicket,
  wonSize,
  wonPoolLength,
  wonid,
  winningNumbers,
} from "../atoms/atoms";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowSmRightIcon, XIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useRef, useState } from "react";

import Sinoabi from "../utils/Coinsino.json";
import { ethers, BigNumber } from "ethers";
import { list } from "postcss";
import { arrayify, id } from "ethers/lib/utils";
import RandomImage from "./randomenumber";

function ViewTickets() {
  const [viewTicketOpen, setviewTicketOpen] = useRecoilState(viewTicket);
  const [roundCount, setRoundCount] = useRecoilState(rouncount);
  const [userTickets, setUserTickets] = useRecoilState(accountTicket);
  const [wonTicketSize, setWonTicketSize] = useRecoilState(wonSize);
  const [claimpoolLength, setclaimpoolLength] = useRecoilState(wonPoolLength);
  const [wwonid, setwonId] = useRecoilState(wonid);

  const [winningNo, setWinningNO] = useRecoilState(winningNumbers);
  const splittedWinningValues = Array.from(String(winningNo));

  function closeViewTickets() {
    setviewTicketOpen(false);
  }

  function openViewTickets() {
    setviewTicketOpen(true);
  }

  return (
    <div>
      {/* edit Tickets */}
      <Transition appear show={viewTicketOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 "
          open={viewTicketOpen}
          onClose={closeViewTickets}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0   bg-white bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full min-w-[300px] max-w-[350px] transform space-y-5 overflow-hidden rounded-2xl bg-coinSinoPurple  p-6 text-left align-middle text-white shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex  justify-between text-lg font-extrabold leading-6 "
                  >
                    Round {roundCount}
                    <XIcon
                      className="h-7 cursor-pointer p-1 text-coinSinoGreen"
                      onClick={() => {
                        closeViewTickets();
                      }}
                    />
                  </Dialog.Title>

                  {/* <div className=" text-md space-y-10 border-t-[1px] border-coinSinoTextColor2 text-center">
                    <h2 className="my-5 font-bold text-coinSinoTextColor">
                      Winning Number
                    </h2>
                    <RandomImage />
                  </div> */}
                  <p className="flex justify-between">
                    <span className=" text-xs text-white">Total tickets</span>{" "}
                    <span className="">{userTickets.length}</span>
                  </p>

                  {/* <p className="flex justify-between">
                    <span className=" text-xs text-white">Winning tickets</span>{" "}
                    <span className="">{wonTicketSize}</span>
                  </p> */}

                  {/* <p className="text-sm">
                    You matched the following number(s) in pink
                  </p> */}

                  <div className="mt-2">
                    <div className="text-sm ">
                      {userTickets.map((e, i) => {
                        const split = Array.from(String(e));
                        return (
                          <div
                            key={i}
                            className="my-2 flex w-full items-center justify-between  rounded-2xl  border-[1px] bg-coinSinoPurpleNav p-2 font-bold"
                          >
                            {split.map((ee, ii) => (
                              <p
                                className={` flex items-center  p-2 text-lg    `}
                                key={i}
                              >
                                {ee}
                              </p>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default ViewTickets;
