interface PriorityNode {
  x: number;
  y: number;
  priority: number;
}
export class BinaryMaxHeap {
  values: Array<PriorityNode>;
  constructor() {
    this.values = [];
  }
  insert(node: PriorityNode) {
    this.values.push(node);
    this.bubbleUp(this.values.length - 1);
  }
  bubbleUp(index: number) {
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
  length() {
    return this.values.length;
  }
  bubbleDown(index: number) {
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
  extractMax() {
    if (this.values.length === 0) return;
    const max = this.values[0];
    this.values[0] = this.values[this.values.length - 1];
    this.bubbleDown(0);
    return max;
  }
}
