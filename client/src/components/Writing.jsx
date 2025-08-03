import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

export default function Writing({ text = "" }) {
  const tripleDotList = [".", ".", "."];
  const [tripleDot, setTripleDot] = useState("...");
  const indexRef = useRef(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const index = indexRef.current;
      const tripleDotListCurrent = [...tripleDotList];
      tripleDotListCurrent.splice(index, 0, " ");
      setTripleDot(tripleDotListCurrent.join(""));

      if (index === 3) {
        indexRef.current = 1;
      } else {
        indexRef.current = index + 1;
      }
    }, 500);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  return <>{text + tripleDot}</>;
}

// ..._
// _...
// ._..
// .._.
