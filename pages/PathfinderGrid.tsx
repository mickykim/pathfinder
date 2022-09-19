import React, { ReactElement, useEffect, useRef, useState } from "react";
import GridNode from "./GridNode";
import { dijkstras } from "./PathfindingAlgorithms";
/**
 * @typedef {Object} GridNode
 * @property GridNode.start
 * @property GridNode.target
 * @property GridNode.visited
 * @property GridNode.blocked
 * @property GridNode.distance
 * @property GridNode.id
 */
export interface GridNode {
  start: boolean;
  target: boolean;
  visited: boolean;
  blocked: boolean;
  distance: number;
  targetPath: boolean;
  shortestPath: GridNode | null;
  id: string;
}
/**
 * @typedef {Object} PropTypes
 * @property PropTypes.activeTool
 * @property PropTypes.resetGrid
 * @property PropTypes.runAlgorithm
 */
interface PropTypes {
  activeTool: string;
  resetGrid: boolean;
  runAlgorithm: boolean;
}
/**
 * Creates GUI for pathfind visualizer. Grid is composed of a double array of GridNode elements
 * @param {PropTypes} PropTypes
 * @returns
 */
const PathfinderGrid = ({ activeTool, resetGrid, runAlgorithm }: PropTypes) => {
  const canvasWrapper = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<GridNode[][]>();
  const [gridElement, setGridElement] = useState<ReactElement>();
  const [startLocation, setStartLocation] = useState<string>("");
  const [targetLocation, setTargetLocation] = useState<string>("");
  const [targetNode, setTargetNode] = useState<GridNode>();
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  /**
   * Initializes and creates a GridNode double array that represents the state of every node in the graph.
   * @param squareSize size of grid node square
   * @returns Grid data double array
   */
  const createGrid = (squareSize: number) => {
    if (!canvasWrapper.current)
      throw new Error("Failed to select canvasWrapper");
    let tempGrid: GridNode[][] = [];
    for (
      let x = 0;
      x < Math.floor(canvasWrapper.current.offsetHeight / squareSize);
      x++
    ) {
      let row: GridNode[] = [];
      for (
        let y = 0;
        y < Math.floor(canvasWrapper.current.offsetWidth / squareSize);
        y++
      ) {
        let gridNodeState: GridNode = {
          start: false,
          target: false,
          visited: false,
          blocked: false,
          shortestPath: null,
          targetPath: false,
          distance: Number.MAX_SAFE_INTEGER,
          id: `node_${x}_${y}`,
        };
        row.push(gridNodeState);
      }
      tempGrid.push(row);
    }
    console.log({ tempGrid: tempGrid });
    return tempGrid;
  };

  const drawGrid = () => {
    if (!grid) return;
    if (!canvasWrapper.current) throw new Error("Failed to load canvasWrapper");
    const canvas = [];
    for (let x = 0; x < grid.length; x++) {
      let row: ReactElement[] = [];
      const rowId = `row_${x}`;
      for (let y = 0; y < grid[x].length; y++) {
        // Create GridNode element with the corresponding data for the specific node
        let GridNodeElement: JSX.Element = (
          <GridNode
            key={`node_${x}_${y}`}
            x={x}
            y={y}
            target={grid[x][y].target}
            start={grid[x][y].start}
            blocked={grid[x][y].blocked}
            visited={grid[x][y].visited}
            targetPath={grid[x][y].targetPath}
            activeTool={activeTool}
            handleClick={handleClick}
            handleDrag={handleDrag}
          ></GridNode>
        );
        row.push(GridNodeElement);
      }

      let rowElement = (
        <div className="flex h-full w-full flex-nowrap" key={rowId}>
          {row.map((child) => {
            return child;
          })}
        </div>
      );
      canvas.push(rowElement);
    }
    const canvasElement = (
      <div className="flex h-full select-none flex-col bg-slate-300">
        {canvas.map((child) => child)}
      </div>
    );
    return canvasElement;
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!grid) return;
    const updatedGrid = grid.map((inner) => inner.slice());

    const nodeLocation = event.currentTarget.id;
    const nodeLocationElement = document.getElementById(nodeLocation);
    const x = Number(nodeLocation.split("_")[1]);
    const y = Number(nodeLocation.split("_")[2]);
    switch (activeTool) {
      case "start":
        if (startLocation !== "") {
          const prevX = Number(startLocation.split("_")[1]);
          const prevY = Number(startLocation.split("_")[2]);
          updatedGrid[prevX][prevY].start = false;
          updatedGrid[prevX][prevY].distance = Number.MAX_SAFE_INTEGER;
        }
        updatedGrid[x][y].start = true;
        updatedGrid[x][y].distance = 0;
        updatedGrid[x][y].target = false;
        updatedGrid[x][y].blocked = false;
        setStartLocation(nodeLocation);
        setGrid(updatedGrid);
        console.count("start placed");
        break;

      case "target":
        if (targetLocation !== "") {
          const prevX = Number(targetLocation.split("_")[1]);
          const prevY = Number(targetLocation.split("_")[2]);
          console.log(prevX, prevY);
          updatedGrid[prevX][prevY].target = false;
        }
        setTargetLocation(nodeLocation);
        setTargetNode(updatedGrid[x][y]);
        updatedGrid[x][y].target = true;
        updatedGrid[x][y].start = false;
        updatedGrid[x][y].blocked = false;
        updatedGrid[x][y].distance = Number.MAX_SAFE_INTEGER;
        setGrid(updatedGrid);
        console.count("target placed");
        break;

      case "wall":
        updatedGrid[x][y].target = false;
        updatedGrid[x][y].start = false;
        updatedGrid[x][y].blocked = true;
        updatedGrid[x][y].distance = Number.MAX_SAFE_INTEGER;
        setGrid(updatedGrid);
        console.count("wall placed");
        break;
      case "eraser":
        updatedGrid[x][y].target = false;
        updatedGrid[x][y].start = false;
        updatedGrid[x][y].blocked = false;
        updatedGrid[x][y].distance = Number.MAX_SAFE_INTEGER;
        console.count("deleted node");
        break;

      default:
        break;
    }
  };
  /**
   * Mouse drag event handler depending on current active tool.
   * Handles wall placement and erasing to work while dragging
   * @param event Mouse event
   * @returns
   */
  const handleDrag = (event: React.MouseEvent<HTMLElement>) => {
    if (!mouseDown) return; // Check that user is dragging
    handleClick(event);
  };

  const createPath = (node: GridNode) => {
    if (node.shortestPath === null) return;
    node.shortestPath.targetPath = true;
    createPath(node.shortestPath);
  };
  /**
   * Initial setup when component is mounted
   * Add event listener to mousedown and mouseup to check if user is dragging
   */
  useEffect(() => {
    setGrid(createGrid(25));
    document.addEventListener("mousedown", () => {
      setMouseDown(true);
    });
    document.addEventListener("mouseup", () => {
      setMouseDown(false);
    });
  }, []);

  /**
   * Handles grid reset when reset is initiated
   */
  useEffect(() => {
    setGrid(createGrid(25));
    setStartLocation("");
    setTargetLocation("");
    setTargetNode(undefined);
    console.log("Grid reset finalized");
  }, [resetGrid]);

  /**
   * Run algorithm when user presses run button
   */
  useEffect(() => {
    if (!grid || !targetNode || startLocation == "") return;
    dijkstras(grid, startLocation, setGrid);
    createPath(targetNode);
    setGridElement(drawGrid());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runAlgorithm]);

  /**
   * Redraw grid to respond to user action.
   */
  useEffect(() => {
    setGridElement(drawGrid());
  }, [grid, startLocation, targetLocation, activeTool, mouseDown]);

  return (
    <div
      id="canvas__wrapper"
      ref={canvasWrapper}
      className="outline-3 h-[800px] w-[1700px] outline outline-black"
    >
      {gridElement}
    </div>
  );
};

export default PathfinderGrid;
