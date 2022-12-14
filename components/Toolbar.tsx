import React, { useRef, useState } from "react";
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
  toggleDijkstra: VoidFunction;
  toggleAStar: VoidFunction;
  currentAlgorithm: string;
}

const Toolbar = ({
  toggleStartSelected,
  toggleTargetSelected,
  toggleWallSelected,
  toggleEraserSelected,
  toggleReset,
  toggleRun,
  toggleInfo,
  toggleAStar,
  toggleDijkstra,
  currentAlgorithm,
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
    <div className="absolute bottom-12 z-10 flex justify-evenly rounded-lg border border-solid border-sky-300 border-opacity-25 bg-slate-700 p-1 text-white">
      <div className="">
        <button
          id="start"
          className="active rounded-xl bg-sky-500 p-2  md:p-4 [&:not(.active)]:hover:bg-slate-600"
          onClick={setActiveTool}
          ref={startButton}
          aria-label="start flag"
        >
          <FaFlag />
        </button>
        <button
          id="target"
          className=" rounded-xl p-2 md:p-4 [&:not(.active)]:hover:bg-slate-600"
          onClick={setActiveTool}
          ref={targetButton}
          aria-label="target flag"
        >
          <FaFlagCheckered />
        </button>
        <button
          id="wall"
          className="rounded-xl p-2 md:p-4 [&:not(.active)]:hover:bg-slate-600"
          onClick={setActiveTool}
          ref={wallButton}
          aria-label="wall"
        >
          <GiBrickWall />
        </button>
        <button
          id="eraser"
          className="rounded-xl p-2 md:p-4 [&:not(.active)]:hover:bg-slate-600"
          onClick={setActiveTool}
          ref={eraserButton}
          aria-label="eraser"
        >
          <FaEraser />
        </button>
      </div>
      <span className="mx-2  my-1 inline-block w-[1px]  bg-slate-500" />
      <div className="flex ">
        <div className="group flex  w-full items-center justify-center rounded-xl ">
          <div className=" absolute bottom-3/4 hidden flex-col  items-baseline justify-center p-6 group-hover:flex group-active:flex">
            <button
              className="rounded-t-xl bg-slate-700 px-3 py-2 hover:bg-slate-600 md:px-6 md:py-4"
              onClick={toggleDijkstra}
              onTouchEnd={toggleDijkstra}
              aria-label="dijkstra"
            >
              Dijkstra
            </button>
            <button
              className="w-full  rounded-b-xl bg-slate-700 px-6 py-4 hover:bg-slate-600"
              onClick={toggleAStar}
              onTouchEnd={toggleAStar}
              aria-label="a star"
            >
              A*
            </button>
          </div>
          <MdOutlineKeyboardArrowRight className="block transition-all group-hover:-rotate-90 group-active:-rotate-90" />
          <button className="w-14 rounded-xl hover:bg-slate-600 md:w-16">
            {currentAlgorithm.charAt(0).toUpperCase() +
              currentAlgorithm.slice(1)}
          </button>
        </div>
        <button
          className="rounded-xl p-2 md:p-4 [&:not(.active)]:hover:bg-slate-600"
          ref={runButton}
          onClick={toggleRun}
          aria-label="run algorithm"
        >
          <FaPlay />
        </button>

        <button
          className="rounded-xl  p-2 md:p-4 [&:not(.active)]:hover:bg-slate-600"
          ref={resetButton}
          onClick={toggleReset}
          aria-label="reset grid"
        >
          <FaRedo />
        </button>
        <button
          className="rounded-xl p-2 md:p-4 [&:not(.active)]:hover:bg-slate-600 "
          ref={infoButton}
          onClick={toggleInfo}
          aria-label="information"
        >
          <FaInfo />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
