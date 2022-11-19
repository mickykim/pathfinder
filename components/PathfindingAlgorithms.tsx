import { arrayBuffer } from "stream/consumers";
import { GridNode } from "./PathfinderGrid";
import { BinaryMinHeap } from "../utils/BinaryHeap";

const heuristic = (x: number, y: number, targetX: number, targetY: number) => {
  const xdelta = Math.abs(targetX - x);
  const ydelta = Math.abs(targetY - y);
  return xdelta + ydelta;
};

export const dijkstras = (grid: GridNode[][], startLocation: string) => {
  const timeline: GridNode[] = [];
  const updatedGrid = grid.map((inner) => inner.slice());
  const startX = Number(startLocation.split("_")[1]);
  const startY = Number(startLocation.split("_")[2]);
  const xOffsets = [1, -1, 0, 0];
  const yOffsets = [0, 0, 1, -1];
  const priorityQueue = new BinaryMinHeap();
  priorityQueue.insert({ x: startX, y: startY, priority: 0 });

  // var heap = new BinaryMinHeap();
  // [
  //   10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5, 10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5, 10, 3,
  //   4, 8, 2, 9, 7, 1, 2, 6, 5, 10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5,
  // ].forEach((element) => {
  //   heap.insert({ x: 0, y: 0, priority: element });
  // });
  // console.log(heap);

  while (priorityQueue.length() > 0) {
    const currentNode = priorityQueue.extractMin();
    if (!currentNode) continue;
    const x = currentNode.x;
    const y = currentNode.y;
    if (updatedGrid[x][y].visited) continue;

    updatedGrid[x][y] = { ...updatedGrid[x][y], visited: true };

    if (updatedGrid[x][y].target === true) {
      timeline.push(updatedGrid[x][y]);
      return timeline;
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
        if (updatedGrid[x][y].distance + 1 < updatedGrid[x + xOffsets[j]][y + yOffsets[j]].distance) {
          updatedGrid[x + xOffsets[j]][y + yOffsets[j]] = {
            ...updatedGrid[x + xOffsets[j]][y + yOffsets[j]],
            distance: updatedGrid[x][y].distance + 1,
            shortestPath: updatedGrid[x][y],
          };
          const priority = updatedGrid[x + xOffsets[j]][y + yOffsets[j]].distance;
          const priorityIndex = priorityQueue.findIndex(x + xOffsets[j], y + yOffsets[j]);
          if (priorityIndex !== null) {
            priorityQueue.updatePriority(priorityIndex, priority);
          } else {
            priorityQueue.insert({
              x: x + xOffsets[j],
              y: y + yOffsets[j],
              priority,
            });
          }
        }
      }
    }
    timeline.push(updatedGrid[x][y]);
  }

  return timeline;
};

export const astar = (grid: GridNode[][], startLocation: string, targetLocation: string) => {
  const timeline: GridNode[] = [];
  const updatedGrid = grid.map((inner) => inner.slice());
  const startX = Number(startLocation.split("_")[1]);
  const startY = Number(startLocation.split("_")[2]);
  const targetX = Number(targetLocation.split("_")[1]);
  const targetY = Number(targetLocation.split("_")[2]);
  const xOffsets = [1, -1, 0, 0];
  const yOffsets = [0, 0, 1, -1];
  const priorityQueue = new BinaryMinHeap();
  priorityQueue.insert({ x: startX, y: startY, priority: 0 });
  while (priorityQueue.length() > 0) {
    const currentNode = priorityQueue.extractMin();
    if (!currentNode) continue;
    const x = currentNode.x;
    const y = currentNode.y;
    // if (updatedGrid[x][y].visited) continue;
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
        if (updatedGrid[x][y].distance + 1 < updatedGrid[x + xOffsets[j]][y + yOffsets[j]].distance) {
          updatedGrid[x + xOffsets[j]][y + yOffsets[j]] = {
            ...updatedGrid[x + xOffsets[j]][y + yOffsets[j]],
            distance: updatedGrid[x][y].distance + 1,
            shortestPath: updatedGrid[x][y],
          };
          const priority =
            updatedGrid[x + xOffsets[j]][y + yOffsets[j]].distance +
            heuristic(x + xOffsets[j], y + yOffsets[j], targetX, targetY);
          const priorityIndex = priorityQueue.findIndex(x + xOffsets[j], y + yOffsets[j]);
          if (priorityIndex !== null) {
            priorityQueue.updatePriority(priorityIndex, priority);
          } else {
            priorityQueue.insert({
              x: x + xOffsets[j],
              y: y + yOffsets[j],
              priority,
            });
          }
        }
      }
    }
    console.log(priorityQueue);

    timeline.push(updatedGrid[x][y]);
  }

  return timeline;
};
