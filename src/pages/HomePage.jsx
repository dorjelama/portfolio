import "react-tooltip/dist/react-tooltip.css";
import { TypeAnimation } from "react-type-animation";
import clearPic from "../assets/ProfilePicClear.jpg";
import backgroundImg from "../assets/background.webp";
import { SocialIcon } from "react-social-icons";
import { Tooltip } from "react-tooltip";
import Hexagongroup from "../component/hexagongroup";
import { MdCloudDownload } from "react-icons/md";
import DotNetImage from "../assets/dotnet.png";
import CV from "../assets/Dorje Lama CV.pdf";
import CSharp from "../assets/CSharp.png";
import ReactImg from "../assets/react.png";
import TailwindcssImg from "../assets/tailwindcss.png";
import JQueryImg from "../assets/jQuery.png";
import JavascriptImg from "../assets/Javascript.png";

export const HomePage = () => {
  return (
    <>
      <div
        className="flex flex-col h-dvh bg-cover md:bg-contain"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="p-4 flex flex-row-reverse">
          <div
            className="mr-2 md:mx-5"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="LinkedIn"
            data-tooltip-place="top"
          >
            <SocialIcon
              url="https://www.linkedin.com/in/dorje-lama-0004ab10b/"
              style={{ height: 30, width: 30 }}
            />
          </div>
          <div
            className="mr-2"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="GitHub"
            data-tooltip-place="left"
          >
            <SocialIcon
              url="https://github.com/dorjelama"
              style={{ height: 30, width: 30 }}
            />
          </div>
        </div>

                <div className="flex flex-col items-center justify-center md:flex-row-reverse md:items-center flex-grow">
                    {/* Image and Text (Reversed order for smaller screens) */}
                    <div className="mb-4 md:mr-4 border-2 border-black rounded-full overflow-hidden order-1 md:order-2">
                        <img src={clearPic} alt="Profile" className="transform scale-110 md:scale-100 h-32 w-32 md:h-32 md:w-32" />
                    </div>
                    <div className="flex p-2 bg-white border-black items-center md:order-1 order-2 text-center md:text-left">
                        <h1 className="font-pokemon text-xs md:text-xl">
                            <TypeAnimation
                                style={{ whiteSpace: 'pre-line', display: 'block' }}
                                sequence={[
                                    "",
                                    2000,
                                    `Hi, I am Dorje Lama\n Senior Software Engineer (.Net)\n at Cloud Pro Ai`,
                                    1000
                                ]}
                                speed={1}
                            />
                        </h1>
                    </div>
                </div>

        <div className="flex items-center p-4 font-pokemon text-xs mt-auto">
          <a href={CV} download>
            <div className="flex items-center">
              <MdCloudDownload
                size={20}
                className="mr-2 cursor-pointer"
                style={{ color: "white" }}
              />
              <TypeAnimation
                className="cursor-pointer"
                style={{ whiteSpace: "pre-line", display: "block" }}
                sequence={["", 7000, `Download My Résumé`, 1000]}
                speed={1}
                repeat={Infinity}
              />
            </div>
          </a>
        </div>
      </div>
      <div className="absolute flex flex-row md:flex-col top-20 left-0 md:left-10">
        <Hexagongroup img1={DotNetImage} img2={CSharp} img3={ReactImg} />
        <Hexagongroup
          img1={TailwindcssImg}
          img2={JQueryImg}
          img3={JavascriptImg}
        />
      </div>
      <Tooltip
        id="my-tooltip"
        className="font-pokemon text-xs"
        style={{ backgroundColor: "rgb(255, 255, 255)", color: "#222" }}
      />
    </>
  );
};

export default HomePage;