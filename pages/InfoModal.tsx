import React, { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
interface PropTypes {
  toggleInfo: VoidFunction;
}
import {
  FaEraser,
  FaFlagCheckered,
  FaFlag,
  FaInfo,
  FaPlay,
  FaRedo,
} from "react-icons/fa";
import { GiBrickWall } from "react-icons/gi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const InfoModal = ({ toggleInfo }: PropTypes) => {
  const modal = useRef(null);
  useEffect(() => {
    window.onclick = (event) => {
      if (event.target === modal.current) {
        toggleInfo();
      }
    };
  });
  return (
    <div
      className="absolute z-20 flex h-screen w-screen items-center justify-center  bg-slate-700 bg-opacity-60"
      ref={modal}
    >
      <div
        className="relative z-30 max-h-[90%] w-fit overflow-auto rounded-xl bg-slate-800 p-8 text-white opacity-100"
        onClick={() => {}}
      >
        <MdClose
          onClick={toggleInfo}
          className="absolute right-10 top-8 cursor-pointer text-2xl text-white opacity-100"
        />
        <h2 className="pb-8 text-xl font-semibold">Information</h2>
        <div className="gap-28 lg:flex">
          <div>
            <h3 className="py-4 text-lg font-semibold">Tools</h3>
            <ul>
              <li className="flex py-2">
                <FaFlag className="text-xl" />
                <p className="ml-4 text-sm font-semibold">Start Location</p>
              </li>
              <li className="flex py-2">
                <FaFlagCheckered className="text-xl" />
                <p className="ml-4 text-sm font-semibold">Target Location</p>
              </li>
              <li className="flex py-2">
                <GiBrickWall className="text-xl" />
                <p className="ml-4 text-sm font-semibold">Wall</p>
              </li>
              <li className="flex py-2">
                <FaEraser className="text-xl" />
                <p className="ml-4 text-sm font-semibold">Eraser</p>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="py-4 text-lg font-semibold">Playback</h3>
            <ul>
              <li className="flex py-2">
                <MdOutlineKeyboardArrowRight className="text-xl" />
                <p className="ml-4 text-sm font-semibold">Select Algorithm</p>
              </li>
              <li className="flex py-2">
                <FaPlay className="text-xl" />
                <p className="ml-4 text-sm font-semibold">Run Algorithm</p>
              </li>
              <li className="flex py-2">
                <FaRedo className="text-xl" />
                <p className="ml-4 text-sm font-semibold">Reset Grid</p>
              </li>
              <li className="flex py-2">
                <FaInfo className="text-xl" />
                <p className="ml-4 text-sm font-semibold">Show Information</p>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="py-4 text-lg font-semibold">
              Mouse/Keyboard Controls
            </h3>
            <ul>
              <li className="flex items-baseline py-2">
                <p>Left Click</p>
                <p className="ml-4 text-sm font-semibold">
                  Place Selected Element
                </p>
              </li>
              <li className="flex items-baseline py-2">
                <p>Right Click</p>
                <p className="ml-4 text-sm font-semibold">
                  Remove Selected Element
                </p>
              </li>
              <li className="flex items-baseline py-2">
                <p>F12</p>
                <p className="ml-4 text-sm font-semibold">
                  Source Code / Dev Tools
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="py-4 text-lg font-semibold">
              Touch/Stylus Controls
            </h3>
            <ul>
              <li className="flex items-baseline py-2">
                <p>Tap</p>
                <p className="ml-4 text-sm font-semibold">
                  Place Selected Element
                </p>
              </li>
              <li className="flex items-baseline py-2">
                <p>Two-Finger Tap</p>
                <p className="ml-4 text-sm font-semibold">Previous Tool</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
