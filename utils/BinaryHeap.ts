interface PriorityNode {
  x: number;
  y: number;
  priority: number;
}
export class BinaryMaxHeap {
  private values: Array<PriorityNode>;
  constructor() {
    this.values = [];
  }
  insert(node: PriorityNode) {
    this.values.push(node);
    this.bubbleUp(this.values.length - 1);
  }

  length() {
    return this.values.length;
  }

  extractMax() {
    if (this.values.length === 0) return;
    const max = this.values[0];
    this.values[0] = this.values[this.values.length - 1];
    this.bubbleDown(0);
    return max;
  }

  private bubbleUp(index: number) {
    const node = this.values[index];
    while (index > 0) {
      const parentIndex = Math.floor((index + 1) / 2) - 1;
      const parentNode = this.values[parentIndex];

      // Parent has higher value than child, no need to sort.
      if (parentNode.priority > node.priority) return;

      this.values[index] = parentNode;
      this.values[parentIndex] = node;
      index = parentIndex;
    }
  }

  private bubbleDown(index: number) {
    const node = this.values[index];
    while (true) {
      const child1Index = 2 * index + 1;
      const child2Index = 2 * index + 2;
      let swapIndex = null;
      if (child1Index < this.values.length) {
        const child1Node = this.values[child1Index];

        swapIndex = child1Node.priority > node.priority ? child1Index : null;
      }
      if (child2Index < this.values.length) {
        const child2Node = this.values[child2Index];
        swapIndex =
          child2Node.priority >
          (swapIndex === null ? node.priority : this.values[swapIndex].priority)
            ? child2Index
            : null;
      }

      // Nothing left to sort as both child elements are smaller
      if (swapIndex === null) return;

      this.values[index] = this.values[swapIndex];
      this.values[swapIndex] = node;
    }
  }
}

export class BinaryMinHeap {
  private values: Array<PriorityNode>;
  constructor() {
    this.values = [];
  }
  insert(node: PriorityNode) {
    this.values.push(node);
    this.bubbleUp(this.values.length - 1);
  }
  length() {
    return this.values.length;
  }
  findIndex(x: number, y: number) {
    let index = null;
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].x === x && this.values[i].y === y) {
        index = i;
      }
    }
    return index;
  }
  updatePriority(index: number, priority: number) {
    this.values[index].priority = priority;
    this.bubbleUp(index);
    this.bubbleDown(index);
  }
  extractMin() {
    if (this.values.length === 0) return;
    const max = this.values[0];
    const lastNode = this.values.pop();
    if (!lastNode) return;
    this.values[0] = lastNode;
    this.bubbleDown(0);
    return max;
  }

  private bubbleUp(index: number) {
    const node = this.values[index];
    while (index > 0) {
      const parentIndex = Math.floor((index + 1) / 2) - 1;
      const parentNode = this.values[parentIndex];

      // Parent has lower value than child, no need to sort.
      if (parentNode.priority < node.priority) return;

      this.values[index] = parentNode;
      this.values[parentIndex] = node;
      index = parentIndex;
    }
  }

  private bubbleDown(index: number) {
    const node = this.values[index];
    while (true) {
      const child1Index = 2 * index + 1;
      const child2Index = 2 * index + 2;
      let swapIndex = null;
      if (child1Index < this.values.length) {
        const child1Node = this.values[child1Index];

        swapIndex = child1Node.priority < node.priority ? child1Index : null;
      }
      if (child2Index < this.values.length) {
        const child2Node = this.values[child2Index];
        if (
          child2Node.priority <
          (swapIndex === null ? node.priority : this.values[swapIndex].priority)
        )
          swapIndex = child2Index;
      }

      // Nothing left to sort as both child elements are larger
      if (swapIndex === null) return;

      this.values[index] = this.values[swapIndex];
      this.values[swapIndex] = node;
      index = swapIndex;
    }
  }
}
