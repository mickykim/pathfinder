import { arrayBuffer } from "stream/consumers";
import { GridNode } from "./PathfinderGrid";
import { BinaryMaxHeap } from "../utils/BinaryMaxHeap";
export const dijkstras = (grid: GridNode[][], startLocation: string) => {
  const timeline: GridNode[] = [];
  const updatedGrid = grid.map((inner) => inner.slice());
  let startX = Number(startLocation.split("_")[1]);
  let startY = Number(startLocation.split("_")[2]);
  let xOffsets = [1, -1, 0, 0];
  let yOffsets = [0, 0, 1, -1];
  const priorityQueue = [[startX, startY]];
  for (let i = 0; i < priorityQueue.length; i++) {
    const x = priorityQueue[i][0];
    const y = priorityQueue[i][1];
    updatedGrid[x][y] = { ...updatedGrid[x][y], visited: true };

    if (updatedGrid[x][y].target === true) {
      timeline.push(updatedGrid[x][y]);
      break;
    }

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
          updatedGrid[x + xOffsets[j]][y + yOffsets[j]] = {
            ...updatedGrid[x + xOffsets[j]][y + yOffsets[j]],
            distance: updatedGrid[x][y].distance + 1,
            shortestPath: updatedGrid[x][y],
          };
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
    timeline.push(updatedGrid[x][y]);
  }
  return timeline;
};

const heuristic = (x, y, targetX, targetY) => {
  return 0;
};

export const astar = (
  grid: GridNode[][],
  startLocation: string,
  targetLocation: string
) => {
  const timeline: GridNode[] = [];
  const updatedGrid = grid.map((inner) => inner.slice());
  let startX = Number(startLocation.split("_")[1]);
  let startY = Number(startLocation.split("_")[2]);
  let targetX = Number(targetLocation.split("_")[1]);
  let targetY = Number(targetLocation.split("_")[2]);
  let xOffsets = [1, -1, 0, 0];
  let yOffsets = [0, 0, 1, -1];
  const priorityQueue = new BinaryMaxHeap();
  priorityQueue.insert({ x: startX, y: startY, priority: 0 });
  for (let i = 0; i < priorityQueue.length(); i++) {
    const currentNode = priorityQueue.extractMax();
    if (!currentNode) return;
    const x = currentNode.x;
    const y = currentNode.y;
    updatedGrid[x][y] = { ...updatedGrid[x][y], visited: true };

    if (updatedGrid[x][y].target === true) {
      timeline.push(updatedGrid[x][y]);
      break;
    }

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
          updatedGrid[x + xOffsets[j]][y + yOffsets[j]] = {
            ...updatedGrid[x + xOffsets[j]][y + yOffsets[j]],
            distance: updatedGrid[x][y].distance + 1,
            shortestPath: updatedGrid[x][y],
          };
        }

        priorityQueue.insert({
          x: x + xOffsets[j],
          y: y + yOffsets[j],
          priority:
            updatedGrid[x + xOffsets[j]][y + yOffsets[j]].distance +
            heuristic(x + xOffsets[j], y + yOffsets[j], targetX, targetY),
        });
      }
    }
    timeline.push(updatedGrid[x][y]);
  }
  return timeline;
};
