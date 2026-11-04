import { useEffect } from "react";
import background from "../assets/background.webp";
import { onButton } from "../game/input";
import { sfx } from "../game/sound";
import { profile } from "../data/profile";

function Cloud({ className }) {
  return (
    <svg viewBox="0 0 24 10" shapeRendering="crispEdges" aria-hidden="true" className={`cloud ${className}`}>
      <path fill="#fff" d="M6 2h5V1h5v1h2v2h3v2h2v3H1V6h2V4h3z" />
      <path fill="#d6dff0" d="M1 8h22v1H1z" />
    </svg>
  );
}

export default function TitleScreen({ onStart, onSkip }) {
  useEffect(
    () =>
      onButton((k) => {
        if (k !== "a") return;
        sfx.confirm();
        onStart();
      }),
    [onStart]
  );

  return (
    <div
      className="relative flex h-dvh flex-col items-center justify-between overflow-hidden bg-cover bg-bottom px-4 py-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Cloud className="w-24 [animation-duration:70s] top-[8%]" />
      <Cloud className="w-16 [animation-delay:-30s] [animation-duration:90s] top-[22%]" />

      <div className="mt-[10vh] text-center">
        <h1 className="title-logo text-3xl leading-tight md:text-6xl">{profile.name.toUpperCase()}</h1>
        <p className="pixel-box mt-5 inline-block px-3 py-2 text-[10px] md:text-sm">
          {profile.title} (.NET) · {profile.guild}
        </p>
      </div>

      <div className="mb-[12vh] flex flex-col items-center gap-5">
        <button
          type="button"
          autoFocus
          onClick={() => {
            sfx.confirm();
            onStart();
          }}
          className="title-start blink text-base md:text-2xl"
        >
          ▶ PRESS START
        </button>
        <button type="button" onClick={onSkip} className="text-shadow text-[10px] text-white underline md:text-xs">
          Skip to menu
        </button>
      </div>

      <p className="text-shadow text-[8px] text-white md:text-[10px]">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </div>
  );
}
