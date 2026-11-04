import { MdCloudDownload, MdEmail } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import PixelFrame from "../components/PixelFrame";
import DialogueBox from "../components/DialogueBox";
import { profile } from "../data/profile";
import CV from "../assets/Dorje Lama CV.pdf";

const LINES = [
  "Want to team up on your next quest?",
  "Send Dorje a letter, or find him on LinkedIn and GitHub.",
];

export default function Contact() {
  const { email, linkedin, github } = profile.links;
  const links = [
    { href: `mailto:${email}`, label: email, Icon: MdEmail },
    { href: linkedin, label: "LinkedIn", Icon: FaLinkedin, external: true },
    { href: github, label: "GitHub", Icon: FaGithub, external: true },
    { href: CV, label: "Download résumé", Icon: MdCloudDownload, download: true },
  ];

  return (
    <div className="space-y-4">
      <DialogueBox lines={LINES} />
      <PixelFrame title="Mailbox">
        <ul className="grid gap-3 sm:grid-cols-2">
          {links.map(({ href, label, Icon, external, download }) => (
            <li key={label}>
              <a
                href={href}
                className="pixel-btn w-full break-all"
                {...(external && { target: "_blank", rel: "noreferrer" })}
                {...(download && { download: "Dorje Lama CV.pdf" })}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </PixelFrame>
    </div>
  );
}
