import { useEffect, useState } from "react";
import Diagnostics from "./screens/Diagnostics";
import Simple from "./screens/Simple";

// #simple in the URL = plain-English version, so it can be linked directly; Back switches back.
const fromUrl = () => (location.hash === "#simple" ? "simple" : "technical");

export default function App() {
  const [view, setView] = useState(fromUrl);

  useEffect(() => {
    const sync = () => setView(fromUrl());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const switchTo = (v) => {
    history.pushState(null, "", v === "simple" ? "#simple" : location.pathname + location.search);
    setView(v);
    window.scrollTo(0, 0);
  };

  return <main>{view === "simple" ? <Simple onSwitch={switchTo} /> : <Diagnostics onSwitch={switchTo} />}</main>;
}
