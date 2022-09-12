import React, { useRef } from "react";
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
    const color = "bg-slate-500";

    switch (event.currentTarget?.id) {
      case "start":
        toggleStartSelected();
        startButton.current?.classList.add(color);
        targetButton.current?.classList.remove(color);
        wallButton.current?.classList.remove(color);
        eraserButton.current?.classList.remove(color);

        break;
      case "target":
        toggleTargetSelected();
        startButton.current?.classList.remove(color);
        targetButton.current?.classList.add(color);
        wallButton.current?.classList.remove(color);
        eraserButton.current?.classList.remove(color);

        break;
      case "wall":
        toggleWallSelected();
        startButton.current?.classList.remove(color);
        targetButton.current?.classList.remove(color);
        wallButton.current?.classList.add(color);
        eraserButton.current?.classList.remove(color);

        break;
      case "eraser":
        toggleEraserSelected();
        startButton.current?.classList.remove(color);
        targetButton.current?.classList.remove(color);
        wallButton.current?.classList.remove(color);
        eraserButton.current?.classList.add(color);
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
    <div className="mb-8 flex justify-evenly">
      <div>
        <button
          id="start"
          className="border border-black bg-slate-300 py-4 px-8"
          onClick={setActiveTool}
          ref={startButton}
        >
          Start
        </button>
        <button
          id="target"
          className="border border-black bg-slate-300 py-4 px-8"
          onClick={setActiveTool}
          ref={targetButton}
        >
          Target
        </button>
        <button
          id="wall"
          className="border border-black bg-slate-300 py-4 px-8"
          onClick={setActiveTool}
          ref={wallButton}
        >
          Wall
        </button>
        <button
          id="eraser"
          className="border border-black bg-slate-300 py-4 px-8"
          onClick={setActiveTool}
          ref={eraserButton}
        >
          Eraser
        </button>
      </div>
      <div>
        <button
          className="border border-black  bg-green-400 py-4 px-8"
          ref={runButton}
          onClick={toggleRun}
        >
          Run
        </button>
        <button
          className="border border-black bg-yellow-300  py-4 px-8 "
          ref={infoButton}
          onClick={toggleInfo}
        >
          Info
        </button>
        <button
          className="border border-black bg-red-300  py-4 px-8 "
          ref={resetButton}
          onClick={toggleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
