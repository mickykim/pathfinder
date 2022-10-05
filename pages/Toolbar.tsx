import React, { useRef } from "react";
import {
  FaEraser,
  FaFlagCheckered,
  FaFlag,
  FaInfo,
  FaPlay,
  FaRedo,
} from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { GiBrickWall } from "react-icons/gi";
interface VoidFunction {
  (): void;
}
interface PropTypes {
  toggleStartSelected: VoidFunction;
  toggleTargetSelected: VoidFunction;
  toggleWallSelected: VoidFunction;
  toggleEraserSelected: VoidFunction;
  toggleReset: VoidFunction;
  toggleRun: VoidFunction;
  toggleInfo: VoidFunction;
}

const Toolbar = ({
  toggleStartSelected,
  toggleTargetSelected,
  toggleWallSelected,
  toggleEraserSelected,
  toggleReset,
  toggleRun,
  toggleInfo,
}: PropTypes) => {
  const setActiveTool = (event: React.MouseEvent<HTMLButtonElement>) => {
    const color = ["bg-sky-500", "active"];

    switch (event.currentTarget?.id) {
      case "start":
        startButton.current?.classList.add(...color);
        targetButton.current?.classList.remove(...color);
        wallButton.current?.classList.remove(...color);
        eraserButton.current?.classList.remove(...color);
        toggleStartSelected();

        break;
      case "target":
        startButton.current?.classList.remove(...color);
        targetButton.current?.classList.add(...color);
        wallButton.current?.classList.remove(...color);
        eraserButton.current?.classList.remove(...color);
        toggleTargetSelected();

        break;
      case "wall":
        startButton.current?.classList.remove(...color);
        targetButton.current?.classList.remove(...color);
        wallButton.current?.classList.add(...color);
        eraserButton.current?.classList.remove(...color);
        toggleWallSelected();

        break;
      case "eraser":
        startButton.current?.classList.remove(...color);
        targetButton.current?.classList.remove(...color);
        wallButton.current?.classList.remove(...color);
        eraserButton.current?.classList.add(...color);
        toggleEraserSelected();

      default:
        break;
    }
  };
  const startButton = useRef<HTMLButtonElement>(null);
  const targetButton = useRef<HTMLButtonElement>(null);
  const wallButton = useRef<HTMLButtonElement>(null);
  const eraserButton = useRef<HTMLButtonElement>(null);
  const runButton = useRef<HTMLButtonElement>(null);
  const infoButton = useRef<HTMLButtonElement>(null);
  const resetButton = useRef<HTMLButtonElement>(null);

  return (
    <div className="absolute bottom-2 z-10 flex justify-evenly rounded-lg border border-solid border-sky-300 border-opacity-25 bg-slate-700 p-1 text-white">
      <div className="">
        <button
          id="start"
          className="rounded-xl py-4 px-4  [&:not(.active)]:hover:bg-slate-600"
          onClick={setActiveTool}
          ref={startButton}
        >
          <FaFlag />
        </button>
        <button
          id="target"
          className=" rounded-xl py-4 px-4 [&:not(.active)]:hover:bg-slate-600"
          onClick={setActiveTool}
          ref={targetButton}
        >
          <FaFlagCheckered />
        </button>
        <button
          id="wall"
          className="rounded-xl py-4 px-4 [&:not(.active)]:hover:bg-slate-600"
          onClick={setActiveTool}
          ref={wallButton}
        >
          <GiBrickWall />
        </button>
        <button
          id="eraser"
          className="rounded-xl py-4 px-4 [&:not(.active)]:hover:bg-slate-600"
          onClick={setActiveTool}
          ref={eraserButton}
        >
          <FaEraser />
        </button>
      </div>
      <span className="mx-2  my-1 inline-block w-[1px]  bg-slate-500" />
      <div className="flex">
        <div className="group flex items-center justify-center  rounded-xl hover:bg-slate-600">
          <MdOutlineKeyboardArrowRight className="transition-all group-hover:-rotate-90" />
          <div className=" absolute bottom-3/4 hidden flex-col items-center justify-center p-2 group-hover:flex">
            <button className="rounded-t-xl bg-slate-700 px-6 py-4 hover:bg-slate-600">
              Link 1
            </button>
            <button className="bg-slate-700 px-6 py-4 hover:bg-slate-600">
              Link 2
            </button>
            <button className="bg-slate-700 px-6 py-4 hover:bg-slate-600">
              Link 3
            </button>
          </div>
          <button className="">Algorithm</button>
        </div>
        <button
          className="rounded-xl py-4  px-4 [&:not(.active)]:hover:bg-slate-600"
          ref={runButton}
          onClick={toggleRun}
        >
          <FaPlay />
        </button>

        <button
          className="rounded-xl  py-4 px-4 [&:not(.active)]:hover:bg-slate-600"
          ref={resetButton}
          onClick={toggleReset}
        >
          <FaRedo />
        </button>
        <button
          className="rounded-xl py-4  px-4 [&:not(.active)]:hover:bg-slate-600 "
          ref={infoButton}
          onClick={toggleInfo}
        >
          <FaInfo />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
