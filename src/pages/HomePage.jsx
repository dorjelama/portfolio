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
                    <div className="mx-10"
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="LinkedIn"
                        data-tooltip-place="top">
                        <SocialIcon url="https://www.linkedin.com/in/dorje-lama-0004ab10b/" style={{ height: 30, width: 30 }} />
                    </div>
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="GitHub"
                        data-tooltip-place="left">
                        <SocialIcon url="https://github.com/dorjelama" style={{ height: 30, width: 30 }} />
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="inline-block mr-4 border-2 border-gray-500 rounded-full overflow-hidden">
                        <img src={clearPic} alt="Profile" className="h-32 w-32 transform scale-110" />
                    </div>
                    <div className="flex items-center min-w-max">
                        <h1 className="font-pokemon text-xl">
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

                <div className="bg-white p-4 font-pokemon text-xs">
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
            <Tooltip id="my-tooltip" className="font-pokemon text-xs"
                style={{ backgroundColor: "rgb(255, 255, 255)", color: "#222" }} />
        </>
    )
}

export default HomePage