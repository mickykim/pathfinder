import { GridNode } from "./PathfinderGrid";

export const dijkstras = (grid: GridNode[][], startLocation: string) => {
  let x = Number(startLocation.split("_")[1]);
  let y = Number(startLocation.split("_")[2]);
  let done = false;
  let xOffsets = [1, -1, 0, 0];
  let yOffsets = [0, 0, 1, -1];
  while (!done) {
    if (grid[x][y].visited) {
    }
    grid[x][y].visited = true;


    /**
     * Checks if the node is out of bounds or already visited.
     * If not it updates the shortest distance to the node if a
     * shorter distance is found and updates the route.
     *
     * Uses offsets arrays to create temporary adjacency list of the current node.
     * */
    for (let i = 0; i < 4; i++) {
      if (
        grid[x + xOffsets[i]][y + yOffsets[i]] &&
        !grid[x + xOffsets[i]][y + yOffsets[i]].visited
      ) {
        if (
          grid[x][y].distance + 1 <
          grid[x + xOffsets[i]][y + yOffsets[i]].distance
        ) {
          grid[x + xOffsets[i]][y + yOffsets[i]].distance =
            grid[x][y].distance + 1;
          grid[x + xOffsets[i]][y + yOffsets[i]].shortestPath = [9
            ...grid[x][y].shortestPath,
            grid[x][y].id,
          ];
        }
      }
    }
    // Find node with smallest distance from source to choose as next node
    for (let i = 0; i < 4; i++) {

    }
};

export const astar = () => {};
