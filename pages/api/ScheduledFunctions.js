import { useRecoilState } from "recoil";
import {   lotteryStatus as Lstatus, } from "../../atoms/atoms";
import OperatorFunctions from "../../components/OperatorFunctions";

export default async function handler(req, res) {
//     const [lotteryStatus, setlotteryStatus] = useRecoilState(Lstatus)
//   const { startLottery, closeLottery, drawLottery } = OperatorFunctions(
//     process.env.opkey
//   );

  res.status(200).json({
    message: `lottery round completed , ${'lotteryStatus'}`,
  });
}
