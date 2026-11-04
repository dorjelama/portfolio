import portrait from "../assets/ProfilePicPixalate1.png";
import PixelFrame from "../components/PixelFrame";
import DialogueBox from "../components/DialogueBox";
import { career, profile } from "../data/profile";

export default function About() {
  const { lv, xp } = career();
  const stats = [
    ["Name", profile.name],
    ["Class", profile.className],
    ["Title", profile.title],
    ["Guild", profile.guild],
    ["Home", profile.home],
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[auto,1fr]">
        <PixelFrame className="mx-auto w-fit md:mx-0">
          <img
            src={portrait}
            alt="Pixel-art portrait of Dorje Lama in a beanie and scarf"
            className="pixelated h-40 w-40 rounded object-cover"
          />
        </PixelFrame>
        <PixelFrame title="Player card">
          <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-[10px] md:text-xs">
            {stats.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-sea">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <dt className="text-sea">LV</dt>
            <dd>{lv}</dd>
          </dl>
          <p className="mb-1 mt-4 text-[10px]" id="xp-label">
            EXP to LV {lv + 1}
          </p>
          <div
            className="bar"
            role="progressbar"
            aria-labelledby="xp-label"
            aria-valuenow={Math.round(xp * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="bar-fill bg-gold" style={{ width: `${xp * 100}%` }} />
          </div>
        </PixelFrame>
      </div>
      <DialogueBox lines={profile.summary} />
    </div>
  );
}
