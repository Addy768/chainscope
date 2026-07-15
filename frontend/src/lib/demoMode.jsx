import { createContext, useContext, useEffect, useState } from "react";
import sample from "../data/sample_predictions.json";

const Ctx = createContext({ demo: false, setDemo: () => {}, sample });

export function DemoProvider({ children }) {
  const [demo, setDemo] = useState(
    () => localStorage.getItem("chainscope.demo") === "1"
  );
  useEffect(() => {
    localStorage.setItem("chainscope.demo", demo ? "1" : "0");
  }, [demo]);
  return <Ctx.Provider value={{ demo, setDemo, sample }}>{children}</Ctx.Provider>;
}

export const useDemo = () => useContext(Ctx);
