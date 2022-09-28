import { time } from "console";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  x: number;
  y: number;
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
  /**
   * Initializes and creates a GridNode double array that represents the state of every node in the graph.
   * @param squareSize size of grid node square
   * @returns Grid data double array
   */
  const createGrid = useCallback(
    (gridWidth: number, gridHeight: number, squareSize: number) => {
      let tempGrid: GridNode[][] = [];
      for (let x = 0; x < Math.floor(gridHeight / squareSize); x++) {
        let row: GridNode[] = [];
        for (let y = 0; y < Math.floor(gridWidth / squareSize); y++) {
          let gridNodeState: GridNode = {
            start: false,
            target: false,
            visited: false,
            blocked: false,
            shortestPath: null,
            targetPath: false,
            x: x,
            y: y,
            distance: Number.MAX_SAFE_INTEGER,
            id: `node_${x}_${y}`,
          };
          row.push(gridNodeState);
        }
        tempGrid.push(row);
      }
      console.log("grid created");
      return tempGrid;
    },
    []
  );
  const canvasWrapper = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<GridNode[][]>(createGrid(1700, 800, 25));
  const [startLocation, setStartLocation] = useState<string>("");
  const [targetLocation, setTargetLocation] = useState<string>("");
  const [frameDuration] = useState(5);
  const timeline = useRef<GridNode[]>([]);
  const animationStarted = useRef<boolean>(false);
  const animationFinished = useRef<boolean>(false);
  const mouseDown = useRef<boolean>(false);
  const shortestPath = useRef<GridNode[]>([]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      let updateNode = (event: React.MouseEvent<HTMLElement>) => {
        const nodeLocation = event.currentTarget.id;
        const x = Number(nodeLocation.split("_")[1]);
        const y = Number(nodeLocation.split("_")[2]);
        switch (activeTool) {
          case "start":
            if (startLocation !== "") {
              const prevX = Number(startLocation.split("_")[1]);
              const prevY = Number(startLocation.split("_")[2]);
              setGrid((prevGrid) => {
                let updatedGrid = prevGrid.map((inner) => {
                  return inner.slice();
                });
                let prevStartNode: GridNode = {
                  ...updatedGrid[prevX][prevY],
                  start: false,
                  distance: Number.MAX_SAFE_INTEGER,
                };
                updatedGrid[prevX][prevY] = prevStartNode;
                let newNode: GridNode = {
                  ...updatedGrid[x][y],
                  start: true,
                  distance: 0,
                  target: false,
                  blocked: false,
                };

                updatedGrid[x][y] = newNode;
                return updatedGrid;
              });
            } else {
              setGrid((prevGrid) => {
                let updatedGrid = prevGrid.map((inner) => {
                  return inner.slice();
                });
                let newNode: GridNode = {
                  ...updatedGrid[x][y],
                  start: true,
                  distance: 0,
                  target: false,
                  blocked: false,
                };

                updatedGrid[x][y] = newNode;
                return updatedGrid;
              });
            }

            setStartLocation(nodeLocation);
            console.count("start placed");
            break;

          case "target":
            if (targetLocation !== "") {
              const prevX = Number(targetLocation.split("_")[1]);
              const prevY = Number(targetLocation.split("_")[2]);
              setGrid((prevGrid) => {
                let updatedGrid = prevGrid.map((inner) => {
                  return inner.slice();
                });
                let prevTargetNode: GridNode = {
                  ...updatedGrid[prevX][prevY],
                  target: false,
                  distance: Number.MAX_SAFE_INTEGER,
                };
                updatedGrid[prevX][prevY] = prevTargetNode;
                let newNode: GridNode = {
                  ...updatedGrid[x][y],
                  start: false,
                  distance: Number.MAX_SAFE_INTEGER,
                  target: true,
                  blocked: false,
                };

                updatedGrid[x][y] = newNode;
                return updatedGrid;
              });
            } else {
              setGrid((prevGrid) => {
                let updatedGrid = prevGrid.map((inner) => {
                  return inner.slice();
                });

                let newNode: GridNode = {
                  ...updatedGrid[x][y],
                  start: false,
                  distance: Number.MAX_SAFE_INTEGER,
                  target: true,
                  blocked: false,
                };

                updatedGrid[x][y] = newNode;
                return updatedGrid;
              });
            }
            setTargetLocation(nodeLocation);
            console.count("target placed");
            break;

          case "wall":
            setGrid((prevGrid) => {
              let updatedGrid = prevGrid.map((inner) => {
                return inner.slice();
              });

              let newNode: GridNode = {
                ...updatedGrid[x][y],
                start: false,
                distance: Number.MAX_SAFE_INTEGER,
                target: false,
                blocked: true,
              };
              updatedGrid[x][y] = newNode;
              return updatedGrid;
            });
            console.count("wall placed");
            break;
          case "eraser":
            setGrid((prevGrid) => {
              let updatedGrid = prevGrid.map((inner) => {
                return inner.slice();
              });

              let newNode: GridNode = {
                ...updatedGrid[x][y],
                start: false,
                distance: Number.MAX_SAFE_INTEGER,
                target: false,
                blocked: false,
              };

              updatedGrid[x][y] = newNode;
              return updatedGrid;
            });
            console.count("deleted node");
            break;

          default:
            break;
        }
      };
      updateNode(event);
    },
    [activeTool, startLocation, targetLocation]
  );

  /**
   * Mouse drag event handler depending on current active tool.
   * Handles wall placement and erasing to work while dragging
   * @param event Mouse event
   * @returns
   */
  const handleDrag = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      let dragNode = (event: React.MouseEvent<HTMLElement>) => {
        if (
          !mouseDown.current ||
          (activeTool !== "wall" && activeTool !== "eraser")
        )
          return; // Check that user is dragging
        handleClick(event);
      };
      dragNode(event);
    },
    [activeTool, handleClick]
  );

  const gridElement = useMemo(() => {
    let paintGrid = (grid: GridNode[][]) => {
      console.log("drawing grid");
      if (!grid) return;

      const canvas = [];
      for (let x = 0; x < grid.length; x++) {
        let row: ReactElement[] = [];
        const rowId = `row_${x}`;
        for (let y = 0; y < grid[x].length; y++) {
          // Create GridNode element with the corresponding data for the specific node
          let GridNodeElement: JSX.Element = (
            <GridNode
              key={`node_${x}_${y}`}
              x={grid[x][y].x}
              y={grid[x][y].y}
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
    return paintGrid(grid);
  }, [activeTool, handleClick, handleDrag, grid]);

  /**
   * Initial setup when component is mounted
   * Add event listener to mousedown and mouseup to check if user is dragging
   */
  useEffect(() => {
    document.addEventListener("mousedown", () => {
      mouseDown.current = true;
    });
    document.addEventListener("mouseup", () => {
      mouseDown.current = false;
    });
  }, []);

  /**
   * Handles grid reset when reset is initiated
   */
  useEffect(() => {
    setGrid(createGrid(1700, 800, 25));
    setStartLocation("");
    setTargetLocation("");
    console.log("Grid reset finalized");
  }, [resetGrid, createGrid]);

  /**
   * Run algorithm when user presses run button
   */
  useEffect(() => {
    if (!grid || targetLocation == "" || startLocation == "") return;
    timeline.current = dijkstras(grid, startLocation);
    animationStarted.current = true;
    setGrid([...grid]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runAlgorithm]);

  const createPath = useCallback(() => {
    if (!grid || !targetLocation) return;
    let x = Number(targetLocation.split("_")[1]);
    let y = Number(targetLocation.split("_")[2]);
    let updatedGrid = grid.map((inner) => inner.slice());
    let currentNode = updatedGrid[x][y];

    while (currentNode.shortestPath !== null) {
      const pathNode = { ...currentNode.shortestPath, targetPath: true };
      currentNode = currentNode.shortestPath;
      shortestPath.current.push(pathNode);
    }
    setGrid(updatedGrid);
  }, [grid, targetLocation]);
  //Run timeline
  useEffect(() => {
    if (animationStarted.current && animationFinished.current) {
      if (shortestPath.current.length === 0) {
        console.log("poop");
        animationFinished.current = false;
        return;
      }
      console.log("pee");
      let pathNode = shortestPath.current.pop();
      setTimeout(
        () =>
          setGrid((prevGrid) => {
            let updatedGrid = prevGrid.map((inner) => {
              return inner.slice();
            });
            if (pathNode === undefined) return updatedGrid;

            updatedGrid[pathNode.x][pathNode.y] = pathNode;
            return updatedGrid;
          }),
        frameDuration * 2
      );
    } else if (animationStarted.current && timeline.current.length == 0) {
      animationFinished.current = true;
      createPath();
    } else if (animationStarted.current) {
      let currentNode = timeline.current.shift();
      setTimeout(
        () =>
          setGrid((prevGrid) => {
            let updatedGrid = prevGrid.map((inner) => {
              return inner.slice();
            });
            if (currentNode === undefined) return updatedGrid;

            updatedGrid[currentNode.x][currentNode.y] = currentNode;
            return updatedGrid;
          }),
        frameDuration
      );
    }
  }, [grid, createPath, frameDuration]);

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
