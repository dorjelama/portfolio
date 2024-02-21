import 'react-tooltip/dist/react-tooltip.css';
import { TypeAnimation } from "react-type-animation";
import clearPic from "../assets/ProfilePicClear.jpg"
import { SocialIcon } from "react-social-icons";
import { Tooltip } from 'react-tooltip'
import { useState } from "react";

export const HomePage = () => {
    return (
        <>
            <div className="flex flex-col h-screen">
                <div className="bg-white p-4 flex flex-row-reverse">
                    <div className="mr-2 md:mx-10"
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="LinkedIn"
                        data-tooltip-place="top">
                        <SocialIcon url="https://www.linkedin.com/in/dorje-lama-0004ab10b/" style={{ height: 30, width: 30 }} />
                    </div>
                    <div className='mr-4'
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="GitHub"
                        data-tooltip-place="left">
                        <SocialIcon url="https://github.com/dorjelama" style={{ height: 30, width: 30 }} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center md:flex-row-reverse md:items-center flex-grow">
                    {/* Image and Text (Reversed order for smaller screens) */}
                    <div className="mb-4 md:mr-4 border-2 border-gray-500 rounded-full overflow-hidden order-1 md:order-2">
                        <img src={clearPic} alt="Profile" className="transform scale-110 md:scale-100 h-32 w-32 md:h-32 md:w-32" />
                    </div>
                    <div className="flex items-center min-w-max md:order-1 order-2 text-center md:text-left">
                        <h1 className="font-pokemon text-xs md:text-xl">
                            <TypeAnimation
                                style={{ whiteSpace: 'pre-line', display: 'block' }}
                                sequence={[
                                    "",
                                    2000,
                                    `Hi, I am Dorje Lama\n .Net Developer at Silicon Soft`,
                                    1000
                                ]}
                                speed={1}
                            />
                        </h1>
                    </div>
                </div>

                <div className="bg-white p-4 font-pokemon text-xs mt-auto">
                    <TypeAnimation className='cursor-pointer'
                        style={{ whiteSpace: 'pre-line', display: 'block' }}
                        sequence={[
                            '',
                            7000,
                            `Download My Resume`,
                            1000
                        ]}
                        speed={1}
                    />
                </div>
            </div>
            <Tooltip id="my-tooltip"
                className="font-pokemon text-xs"
                style={{ backgroundColor: "rgb(255, 255, 255)", color: "#222" }} />
        </>
    )
}

export default HomePage