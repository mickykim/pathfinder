import { defaultConfig } from "next/dist/server/config-shared";
import React, { useEffect, useState } from "react";
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
  const startIcon = "hover:bg-green-500";
  const targetIcon = "hover:bg-red-500";
  const wallIcon = "hover:bg-slate-800";
  const [hoverIcon, setHoverIcon] = useState("");

  useEffect(() => {
    setHoverIcon(
      activeTool === "start"
        ? startIcon
        : activeTool === "target"
        ? targetIcon
        : activeTool === "wall"
        ? wallIcon
        : ""
    );
  }, [activeTool]);

  /**
   * Start Node
   */
  if (start) {
    return (
      <div
        key={nodeLocation}
        id={nodeLocation}
        className={`h-full w-full bg-green-600 outline outline-1 outline-slate-400 transition-colors duration-75 ${hoverIcon}`}
        onMouseOver={handleDrag}
        onMouseDown={handleClick}
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
        className={`h-full w-full bg-red-600 outline outline-1 outline-slate-400 transition-colors duration-75 ${hoverIcon}`}
        onMouseOver={handleDrag}
        onMouseDown={handleClick}
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
        className={`h-full w-full bg-slate-700 outline outline-1 outline-slate-400 transition-colors duration-75 ${hoverIcon}`}
        onMouseOver={handleDrag}
        onMouseDown={handleClick}
        draggable="false"
      ></div>
    );
  }
  if (targetPath) {
    return (
      <div
        key={nodeLocation}
        id={nodeLocation}
        className={`h-full w-full bg-purple-700 outline outline-1 outline-slate-400 transition-colors duration-75 ${hoverIcon}`}
        onMouseOver={handleDrag}
        onMouseDown={handleClick}
        draggable="false"
      ></div>
    );
  }
  if (visited) {
    return (
      <div
        key={nodeLocation}
        id={nodeLocation}
        className={`h-full w-full bg-yellow-700 outline outline-1 outline-slate-400 transition-colors duration-75 ${hoverIcon}`}
        onMouseOver={handleDrag}
        onMouseDown={handleClick}
        draggable="false"
      ></div>
    );
  }

  /** Default (empty) Node depending on current active tool*/

  return (
    <div
      key={nodeLocation}
      id={nodeLocation}
      className={`h-full w-full outline outline-1 outline-slate-400 transition-colors duration-75 ${hoverIcon}`}
      onMouseOver={handleDrag}
      onMouseDown={handleClick}
      draggable="false"
    ></div>
  );
};

export default GridNode;
