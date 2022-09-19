import { arrayBuffer } from "stream/consumers";
import { GridNode } from "./PathfinderGrid";

export const dijkstras = (
  grid: GridNode[][],
  startLocation: string,
  setGrid: any,
  drawGrid: any
) => {
  const updatedGrid = grid.map((inner) => inner.slice());

  let startX = Number(startLocation.split("_")[1]);
  let startY = Number(startLocation.split("_")[2]);
  let xOffsets = [1, -1, 0, 0];
  let yOffsets = [0, 0, 1, -1];
  const priorityQueue = [[startX, startY]];
  for (let i = 0; i < priorityQueue.length; i++) {
    const x = priorityQueue[i][0];
    const y = priorityQueue[i][1];
    if (updatedGrid[x][y].target === true) {
      break;
    }
    updatedGrid[x][y].visited = true;

    /**
     * Checks if the node is out of bounds or already visited.
     * If not it updates the shortest distance to the node if a
     * shorter distance is found and updates the route.
     *
     * Uses offsets arrays to create temporary adjacency list of the current node.
     * */

    for (let j = 0; j < 4; j++) {
      if (
        x + xOffsets[j] > -1 &&
        y + yOffsets[j] > -1 &&
        x + xOffsets[j] < updatedGrid.length &&
        y + yOffsets[j] < updatedGrid[0].length &&
        !updatedGrid[x + xOffsets[j]][y + yOffsets[j]].blocked &&
        !updatedGrid[x + xOffsets[j]][y + yOffsets[j]].visited
      ) {
        if (
          updatedGrid[x][y].distance + 1 <
          updatedGrid[x + xOffsets[j]][y + yOffsets[j]].distance
        ) {
          updatedGrid[x + xOffsets[j]][y + yOffsets[j]].distance =
            updatedGrid[x][y].distance + 1;
          updatedGrid[x + xOffsets[j]][y + yOffsets[j]].shortestPath =
            updatedGrid[x][y];
        }
        if (
          !priorityQueue.some(
            (row) => row[0] === x + xOffsets[j] && row[1] === y + yOffsets[j]
          )
        ) {
          priorityQueue.push([x + xOffsets[j], y + yOffsets[j]]);
        }
      }
    }
  }
  return updatedGrid;
};

export const astar = () => {};
