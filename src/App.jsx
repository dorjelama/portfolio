import { useCallback, useEffect, useState } from "react";
import TitleScreen from "./screens/TitleScreen";
import Overworld from "./screens/Overworld";
import Room from "./screens/Room";
import About from "./screens/About";
import QuestLog from "./screens/QuestLog";
import Projects from "./screens/Projects";
import Skills from "./screens/Skills";
import Contact from "./screens/Contact";
import StartMenu from "./components/StartMenu";
import { bindKeyboard, onButton } from "./game/input";
import { sfx, soundOn, setSoundOn } from "./game/sound";

const ROOMS = { about: About, quests: QuestLog, projects: Projects, skills: Skills, contact: Contact };

// The URL hash is the screen: "" title, #town, #about, #projects ... so links and Back work.
const fromHash = () => {
  const id = location.hash.slice(1);
  return id === "town" || id in ROOMS ? id : "title";
};

export default function App() {
  const [screen, setScreen] = useState(fromHash);
  const [menu, setMenu] = useState(false);
  const [sound, setSound] = useState(soundOn);

  const go = useCallback((id) => {
    setMenu(false);
    setScreen(id);
    history.pushState(null, "", id === "title" ? location.pathname + location.search : `#${id}`);
  }, []);

  const toggleSound = () => {
    setSoundOn(!sound);
    setSound(!sound);
    sfx.confirm(); // audible only when it was just turned on
  };

  useEffect(bindKeyboard, []);

  useEffect(() => {
    const sync = () => {
      setScreen(fromHash());
      setMenu(false);
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(
    () =>
      onButton((key) => {
        if (screen === "title") return;
        if (key === "start" || (key === "b" && screen === "town" && !menu)) {
          sfx.blip();
          setMenu((m) => !m);
        } else if (key === "b" && menu) {
          sfx.back();
          setMenu(false);
        } else if (key === "b") {
          sfx.back();
          go("town");
        }
      }),
    [screen, menu, go]
  );

  const RoomContent = ROOMS[screen];

  return (
    <main className="h-dvh w-full overflow-hidden bg-ink font-pokemon">
      {screen === "title" && (
        <TitleScreen
          onStart={() => go("town")}
          onSkip={() => {
            go("town");
            setMenu(true);
          }}
        />
      )}
      {screen === "town" && (
        <Overworld
          onEnter={go}
          onMenu={() => setMenu(true)}
          paused={menu}
          sound={sound}
          onToggleSound={toggleSound}
        />
      )}
      {RoomContent && (
        <Room key={screen} id={screen} onBack={() => go("town")} onMenu={() => setMenu(true)}>
          <RoomContent />
        </Room>
      )}
      {menu && (
        <StartMenu onPick={go} onClose={() => setMenu(false)} sound={sound} onToggleSound={toggleSound} />
      )}
    </main>
  );
}
