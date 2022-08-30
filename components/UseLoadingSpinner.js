import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";

function UseLoadingSpinner(isloading) {
  const override = (CSSProperties   = {
    display: "block",
    margin: "0 auto",
    borderColor: "#d33493",
  });

  const Loading = () => {
    return (
      <ClipLoader
        color="#ffffff"
        loading={isloading}
        cssOverride={override}
        size={50}
      />
    );
  };

  return { Loading };
}

export default UseLoadingSpinner;
