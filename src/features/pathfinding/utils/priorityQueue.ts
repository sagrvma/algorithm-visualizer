export class PriorityQueue<T> {
  private heap: Array<{ item: T; priority: number }>;
  //This is a min heap: Smaller priority = Higher importance

  constructor() {
    this.heap = [];
  }

  isEmpty = (): boolean => {
    return this.heap.length === 0;
  };

  size = (): number => {
    return this.heap.length;
  };

  //Add an item to the minHeap with given priority (distance)
  enqueue = (item: T, priority: number): void => {
    //Add to the end of the heap
    this.heap.push({ item, priority });
    //Bubble up to move it to it's proper place
    this.bubbleUp(this.heap.length - 1);
  };

  //Pop the item with the smallest priority
  dequeue = (): T | undefined => {
    if (this.isEmpty()) {
      return undefined;
    }

    //Swap first and last
    this.swap(0, this.heap.length - 1);

    //Remove the last as it was the original first
    const min = this.heap.pop();

    //Bubble down the original last which is not at 0, to its correct position
    if (!this.isEmpty()) {
      this.bubbleDown(0);
    }

    return min?.item;
  };

  //Move the element up the priority queue to its correct place after it has been enqueued
  private bubbleUp = (index: number): void => {
    while (index > 0) {
      //Parent Index
      const parentIndex = Math.floor((index - 1) / 2);

      //If already the order is correct, then stop
      if (this.heap[parentIndex].priority < this.heap[index].priority) {
        break;
      }

      //Otherwise swap with parent and continue
      this.swap(index, parentIndex);

      index = parentIndex;
    }
  };

  //Move the element down the priority to its correct place after a dequeue
  private bubbleDown = (index: number): void => {
    while (true) {
      let smallest = index;
      const leftChild = index * 2 + 1;
      const rightChild = index * 2 + 2;

      //Check with leftChild to determine new smallest if it changes
      if (
        leftChild < this.heap.length &&
        this.heap[smallest].priority > this.heap[leftChild].priority
      ) {
        smallest = leftChild;
      }

      //Check with rightChild to determine new smallest, note that instead of checking with index, we are checking with smallest so as to account for if leftchild already was smaller than original index, so we find if rightChild is even smaller and then operated on the smallest of the two if both are having a smaller priority than the original index.
      if (
        rightChild < this.heap.length &&
        this.heap[smallest].priority > this.heap[rightChild].priority
      ) {
        smallest = rightChild;
      }

      //If still smalllest is the original, that means everything is already in correct order, so break
      if (smallest === index) {
        break;
      }

      //Otherwise swap and continue
      this.swap(index, smallest);
      index = smallest;
    }
  };

  private swap = (i: number, j: number): void => {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]; //This is swapping by destructuring, similar to
    /*
      const temp = this.heap[i];
      this.heap[i] = this.heap[j];
      this.heap[j] = temp;
    */
  };
}
