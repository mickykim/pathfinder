import { defaultConfig } from "next/dist/server/config-shared";
import React, { useEffect, useState, memo, useRef } from "react";
interface propTypes {
  x: number;
  y: number;
  start: boolean;
  target: boolean;
  activeTool: string;
  blocked: boolean;
  visited: boolean;
  targetPath: boolean;
  handleDrag: React.MouseEventHandler<HTMLDivElement>;
  handleClick: React.MouseEventHandler<HTMLElement>;
}

const GridNode = ({
  x,
  y,
  start,
  target,
  blocked,
  visited,
  activeTool,
  targetPath,
  handleDrag,
  handleClick,
}: propTypes) => {
  const nodeLocation = `node_${x}_${y}`;
  const startIcon = "hover:bg-sky-500 hover:animate-pulse-slow";
  const targetIcon = "hover:bg-red-500 hover:animate-pulse-slow";
  const wallIcon = "hover:bg-slate-800 hover:animate-pulse-slow";
  const eraserIcon = "hover:bg-slate-200 hover:animate-pulse-slow";
  const [hoverIcon, setHoverIcon] = useState("");
  const node = useRef(null);

  useEffect(() => {
    setHoverIcon(
      activeTool === "start"
        ? startIcon
        : activeTool === "target"
        ? targetIcon
        : activeTool === "wall"
        ? wallIcon
        : activeTool === "eraser"
        ? eraserIcon
        : ""
    );
  }, [activeTool]);

  /**
   * Start Node
   */
  if (start) {
    return (
      <div
        ref={node}
        key={nodeLocation}
        id={nodeLocation}
        className={` h-full w-full border border-slate-100 bg-sky-500 transition-colors duration-75 ${hoverIcon}`}
        onMouseEnter={handleDrag}
        onClick={handleClick}
        draggable="false"
      ></div>
    );
  }
  /**
   * Target Node
   */
  if (target) {
    return (
      <div
        key={nodeLocation}
        id={nodeLocation}
        className={` h-full w-full border border-slate-100 bg-red-500 transition-colors duration-75 ${hoverIcon}`}
        onMouseEnter={handleDrag}
        onClick={handleClick}
        draggable="false"
      ></div>
    );
  }
  /**
   * Wall Node
   */
  if (blocked) {
    return (
      <div
        key={nodeLocation}
        id={nodeLocation}
        className={` h-full w-full border border-slate-100 bg-slate-700 transition-colors duration-75 ${hoverIcon}`}
        onMouseEnter={handleDrag}
        onClick={handleClick}
        draggable="false"
      ></div>
    );
  }
  if (targetPath) {
    return (
      <div
        key={nodeLocation}
        id={nodeLocation}
        className={` h-full w-full animate-circle border border-slate-100 bg-green-500 transition-colors duration-75 ${hoverIcon}`}
        onMouseEnter={handleDrag}
        onClick={handleClick}
        draggable="false"
      ></div>
    );
  }
  if (visited) {
    return (
      <div
        key={nodeLocation}
        id={nodeLocation}
        className={` h-full w-full animate-visited border border-slate-100 bg-yellow-500 transition-colors duration-75 ${hoverIcon}`}
        onMouseEnter={handleDrag}
        onClick={handleClick}
        draggable="false"
      ></div>
    );
  }

  /** Default (empty) Node depending on current active tool*/
  // console.count("default render");
  return (
    <div
      key={nodeLocation}
      id={nodeLocation}
      className={` h-full w-full border border-slate-100 transition-colors duration-75 ${hoverIcon}`}
      onMouseEnter={handleDrag}
      onClick={handleClick}
      draggable="false"
    ></div>
  );
};

export default memo(GridNode);
