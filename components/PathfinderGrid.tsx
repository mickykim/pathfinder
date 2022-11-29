import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import GridNode from "./GridNode";
import { astar, dijkstras } from "./PathfindingAlgorithms";
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
  currentAlgorithm: string;
}
/**
 * Creates GUI for pathfind visualizer. Grid is composed of a double array of GridNode elements
 * @param {PropTypes} PropTypes
 * @returns
 */
const PathfinderGrid = ({
  activeTool,
  resetGrid,
  runAlgorithm,
  currentAlgorithm,
}: PropTypes) => {
  /**
   * Initializes and creates a GridNode double array that represents the state of every node in the graph.
   * @param squareSize size of grid node square
   * @returns Grid data double array
   */

  const canvasWrapper = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<GridNode[][]>([]);
  const [startLocation, setStartLocation] = useState<string>("");
  const [targetLocation, setTargetLocation] = useState<string>("");
  const [frameDuration] = useState(5);
  const timeline = useRef<GridNode[]>([]);
  const animationStarted = useRef<boolean>(false);
  const animationFinished = useRef<boolean>(false);
  const mouseDown = useRef<boolean>(false);
  const shortestPath = useRef<GridNode[]>([]);
  const unvisitedGrid = useRef<GridNode[][]>([]);

  const createGrid = useCallback((squareSize: number) => {
    const tempGrid: GridNode[][] = [];
    for (
      let x = 0;
      x < Math.floor(document.documentElement.clientHeight / squareSize);
      x++
    ) {
      const row: GridNode[] = [];
      for (
        let y = 0;
        y < Math.floor(document.documentElement.clientWidth / squareSize);
        y++
      ) {
        const gridNodeState: GridNode = {
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
    unvisitedGrid.current = tempGrid.map((inner) =>
      inner.map((node) => {
        return { ...node };
      })
    );
    return tempGrid;
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const updateNode = (event: React.MouseEvent<HTMLElement>) => {
        if (animationStarted.current) return;

        const nodeLocation = event.currentTarget.id;
        const x = Number(nodeLocation.split("_")[1]);
        const y = Number(nodeLocation.split("_")[2]);
        switch (activeTool) {
          case "start":
            if (startLocation !== "" && nodeLocation === startLocation) {
              setStartLocation(() => "");
            }
            if (targetLocation !== "" && nodeLocation === targetLocation) {
              setTargetLocation(() => "");
            }
            // Prevent from starting point to be moved after running algorithm
            if (animationFinished.current === true) return;
            setGrid((prevGrid) => {
              const updatedGrid = prevGrid.map((inner) => {
                return inner.map((node) => {
                  return {
                    ...node,
                    start: false,
                    distance: Number.MAX_SAFE_INTEGER,
                  };
                });
              });
              const newNode: GridNode = {
                ...updatedGrid[x][y],
                start: true,
                distance: 0,
                target: false,
                blocked: false,
              };
              updatedGrid[x][y] = newNode;

              return updatedGrid;
            });
            setStartLocation(() => nodeLocation);
            break;

          case "target":
            if (startLocation !== "" && nodeLocation === startLocation) {
              setStartLocation(() => "");
            }
            if (targetLocation !== "" && nodeLocation === targetLocation) {
              setTargetLocation(() => "");
            }
            setGrid((prevGrid) => {
              const updatedGrid = prevGrid.map((inner) => {
                return inner.map((node) => {
                  return {
                    ...node,
                    target: false,
                  };
                });
              });

              const newNode: GridNode = {
                ...updatedGrid[x][y],
                start: false,
                distance: Number.MAX_SAFE_INTEGER,
                target: true,
                blocked: false,
              };
              updatedGrid[x][y] = newNode;

              return updatedGrid;
            });
            setTargetLocation(() => nodeLocation);
            break;

          case "wall":
            if (startLocation !== "" && nodeLocation === startLocation) {
              setStartLocation(() => "");
            }
            if (targetLocation !== "" && nodeLocation === targetLocation) {
              setTargetLocation(() => "");
            }
            // Prevent additional walls to be created after running algorithm
            if (animationFinished.current === true) return;
            setGrid((prevGrid) => {
              const updatedGrid = prevGrid.map((inner) => {
                return inner.slice();
              });

              const newNode: GridNode = {
                ...updatedGrid[x][y],
                start: false,
                distance: Number.MAX_SAFE_INTEGER,
                target: false,
                blocked: true,
              };

              updatedGrid[x][y] = newNode;
              return updatedGrid;
            });
            break;
          case "eraser":
            if (startLocation !== "" && nodeLocation === startLocation) {
              setStartLocation(() => "");
            }
            if (targetLocation !== "" && nodeLocation === targetLocation) {
              setTargetLocation(() => "");
            }
            setGrid((prevGrid) => {
              const updatedGrid = prevGrid.map((inner) => {
                return inner.slice();
              });

              const newNode: GridNode = {
                ...updatedGrid[x][y],
                start: false,
                target: false,
                blocked: false,
                targetPath: false,
              };

              updatedGrid[x][y] = newNode;
              return updatedGrid;
            });
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
      const dragNode = (event: React.MouseEvent<HTMLElement>) => {
        if (!mouseDown.current) return; // Check that user is dragging
        handleClick(event);
      };
      dragNode(event);
    },
    [activeTool, handleClick]
  );
  /**
   * Touch device touch event handler
   */
  const handleTouch = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      if (animationStarted.current) return;
      const nodeElement = document.elementFromPoint(
        event.touches[0].clientX,
        event.touches[0].clientY
      );
      if (!nodeElement) return;
      const nodeLocation = nodeElement.id;
      const x = Number(nodeLocation.split("_")[1]);
      const y = Number(nodeLocation.split("_")[2]);
      //Check if nodeElement with an xy coordinate id was found
      if (isNaN(x) || isNaN(y)) return;

      switch (activeTool) {
        case "start":
          // Prevent from starting point to be moved after running algorithm
          if (animationFinished.current === true) return;
          setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((inner) => {
              return inner.map((node) => {
                return {
                  ...node,
                  start: false,
                  distance: Number.MAX_SAFE_INTEGER,
                };
              });
            });
            const newNode: GridNode = {
              ...updatedGrid[x][y],
              start: true,
              distance: 0,
              target: false,
              blocked: false,
            };
            updatedGrid[x][y] = newNode;

            return updatedGrid;
          });
          setStartLocation(() => nodeLocation);
          break;

        case "target":
          setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((inner) => {
              return inner.map((node) => {
                return {
                  ...node,
                  target: false,
                };
              });
            });

            const newNode: GridNode = {
              ...updatedGrid[x][y],
              start: false,
              distance: Number.MAX_SAFE_INTEGER,
              target: true,
              blocked: false,
            };

            updatedGrid[x][y] = newNode;
            return updatedGrid;
          });
          setTargetLocation(() => nodeLocation);
          break;

        case "wall":
          // Prevent additional walls to be created after running algorithm
          if (animationFinished.current === true) return;
          setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((inner) => {
              return inner.slice();
            });

            const newNode: GridNode = {
              ...updatedGrid[x][y],
              start: false,
              distance: Number.MAX_SAFE_INTEGER,
              target: false,
              blocked: true,
            };

            updatedGrid[x][y] = newNode;
            return updatedGrid;
          });
          break;
        case "eraser":
          if (startLocation !== "" && nodeLocation === startLocation) {
            setStartLocation(() => "");
          }
          if (targetLocation !== "" && nodeLocation === targetLocation) {
            setTargetLocation(() => "");
          }
          setGrid((prevGrid) => {
            const updatedGrid = prevGrid.map((inner) => {
              return inner.slice();
            });

            const newNode: GridNode = {
              ...updatedGrid[x][y],
              start: false,
              target: false,
              blocked: false,
              targetPath: false,
            };

            updatedGrid[x][y] = newNode;
            return updatedGrid;
          });
          break;

        default:
          break;
      }
    },
    [activeTool, startLocation, targetLocation]
  );

  const gridElement = useMemo(() => {
    let paintGrid = (grid: GridNode[][]) => {
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
        <div className="flex h-full select-none flex-col bg-slate-800">
          {canvas.map((child) => child)}
        </div>
      );
      return canvasElement;
    };
    return paintGrid(grid);
  }, [activeTool, handleClick, handleDrag, grid]);

  const runDijkstra = useCallback(() => {
    if (!grid || targetLocation == "" || startLocation == "") return;
    //Algorithm has been run at least once beforehand

    timeline.current = dijkstras(unvisitedGrid.current, startLocation);
    setGrid(() =>
      unvisitedGrid.current.map((inner) => {
        return inner.map((node) => {
          return { ...node };
        });
      })
    );
  }, [grid, targetLocation, startLocation]);

  const runAstar = useCallback(() => {
    if (!grid || targetLocation == "" || startLocation == "") return;

    timeline.current = astar(
      unvisitedGrid.current,
      startLocation,
      targetLocation
    );
    // Replace grid with the unvisited grid to recalculate distances
    setGrid(() =>
      unvisitedGrid.current.map((inner) => {
        return inner.map((node) => {
          return { ...node };
        });
      })
    );
  }, [grid, targetLocation, startLocation]);

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
    setGrid(() => createGrid(25));
  }, []);

  /**
   * Handles grid reset when reset is initiated.
   * Reset is executed inside a timeout in order to wait until the current frame is rendered before resetting.
   */
  useEffect(() => {
    setTimeout(() => {
      setStartLocation("");
      setTargetLocation("");
      timeline.current = [];
      animationFinished.current = false;
      animationStarted.current = false;
      setGrid(() => createGrid(25));
    }, frameDuration);
  }, [resetGrid, createGrid, frameDuration]);

  /**
   * Run algorithm when user presses run button
   */

  useEffect(() => {
    if (animationStarted.current) return;
    if (
      startLocation === "" ||
      targetLocation === "" ||
      startLocation === targetLocation
    )
      return;

    unvisitedGrid.current = grid.map((inner) => {
      return inner.map((node) => {
        return { ...node };
      });
    });
    switch (currentAlgorithm) {
      case "dijkstra":
        animationStarted.current = true;
        runDijkstra();
        break;
      case "astar":
        animationStarted.current = true;
        runAstar();
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runAlgorithm]);

  const createPath = useCallback(() => {
    if (!grid || !targetLocation) return;
    const x = Number(targetLocation.split("_")[1]);
    const y = Number(targetLocation.split("_")[2]);
    const updatedGrid = grid.map((inner) => {
      return inner.map((node) => {
        return { ...node };
      });
    });
    let currentNode = updatedGrid[x][y];

    while (currentNode.shortestPath !== null) {
      const pathNode = { ...currentNode.shortestPath, targetPath: true };
      shortestPath.current.push(pathNode);
      currentNode = currentNode.shortestPath;
    }
    setGrid(() => updatedGrid);
  }, [grid, targetLocation]);

  // Recreate path ONLY if target location changes AND new location is in a visited node.
  useEffect(() => {
    if (
      startLocation === "" ||
      targetLocation === "" ||
      startLocation === targetLocation
    )
      return;

    grid.forEach((inner) => {
      inner.forEach((node) => {
        node.targetPath = false;
      });
    });
    const x = Number(targetLocation.split("_")[1]);
    const y = Number(targetLocation.split("_")[2]);
    const currentNode = grid[x][y];
    if (currentNode.start) return;
    // Check if current node is a previously visited node
    if (currentNode.shortestPath !== null) {
      animationStarted.current = true;
      createPath();
    }

    // Recalculate shortest path since current node has not been calculated before.
    else if (animationFinished.current) {
      animationStarted.current = true;
      animationFinished.current = false;

      unvisitedGrid.current.forEach((inner) => {
        inner.forEach((node) => {
          node.target = false;
        });
      });
      unvisitedGrid.current[x][y].blocked = false;
      unvisitedGrid.current[x][y].distance = Number.MAX_SAFE_INTEGER;

      unvisitedGrid.current[x][y].target = true;

      switch (currentAlgorithm) {
        case "dijkstra":
          runDijkstra();
          break;
        case "astar":
          runAstar();
          break;
      }
    }
  }, [targetLocation]);

  /**
   * Master loop animating algorithm calculation.
   * Run timeline and create shortest path from target.
   */
  useEffect(() => {
    // Check if algorithm was running and animation has finished displaying the changes.

    if (animationStarted.current && animationFinished.current) {
      if (shortestPath.current.length === 0) {
        animationStarted.current = false;
        return;
      }
      const pathNode = shortestPath.current.pop();

      setGrid((prevGrid) => {
        const updatedGrid = prevGrid.map((inner) => {
          return inner.map((node) => {
            return { ...node };
          });
        });
        if (pathNode === undefined) return prevGrid;

        updatedGrid[pathNode.x][pathNode.y] = pathNode;
        return updatedGrid;
      });
      // Check if algorithm is running AND whether all visited nodes have been rendered.
    } else if (animationStarted.current && timeline.current.length === 0) {
      animationFinished.current = true;
      createPath();
    } else if (animationStarted.current) {
      const currentNode = timeline.current.shift();

      setGrid((prevGrid) => {
        const updatedGrid = prevGrid.map((inner) => {
          return inner.map((node) => {
            return { ...node };
          });
        });

        if (currentNode === undefined) return updatedGrid;

        updatedGrid[currentNode.x][currentNode.y] = currentNode;
        return updatedGrid;
      });
    }
  }, [grid, createPath, frameDuration]);

  return (
    <div
      id="canvas__wrapper"
      ref={canvasWrapper}
      className="outline-3 h-[-webkit-fill-available] h-full w-full outline outline-black"
      onTouchMove={handleTouch}
    >
      {gridElement}
    </div>
  );
};

export default PathfinderGrid;
