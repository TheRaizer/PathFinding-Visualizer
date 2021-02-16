export default class Heap {
  /*The item at the top of the heap has succeeded all the other items and has the lowest fCost */
  items = [];

  // the index of the last item in the heap
  lastHeapItemIndex = -1;

  constructor(searchType) {
    this.searchType = searchType;
  }

  contains(item) {
    // check if the heap includes a given item
    return this.items.includes(item);
  }

  add(item) {
    this.lastHeapItemIndex++;

    // assign the heap index to be the last added item index
    item.heapIndex = this.lastHeapItemIndex;
    this.items[this.lastHeapItemIndex] = item;
    this.sortUp(item);
  }

  removeFirst() {
    let firstCell = this.items[0];

    // remove the last item and make it the first
    this.items[0] = this.items.pop();

    // change the (was last) item's heapIndex to be 0
    this.items[0].heapIndex = 0;

    // since we popped a item out the lastHeapItemIndex must be decremented
    this.lastHeapItemIndex--;

    //sort the top item down the heap
    this.sortDown(this.items[0]);

    return firstCell;
  }

  update(item, sortUp) {
    if (sortUp) {
      this.sortUp(item);
    } else {
      this.sortDown(item);
    }
  }

  sortUp(item) {
    while (true) {
      let parentIndex = Math.floor((item.heapIndex - 1) / 2);
      parentIndex = parentIndex < 0 ? 0 : parentIndex;

      var parentCell = this.items[parentIndex];

      // if the item succeeds the parent item
      if (item.compareTo(parentCell, this.searchType) > 0) {
        // swap the item and parent positions in the heap
        this.swap(item, parentCell);
      } else {
        break;
      }
    }
  }

  sortDown(item) {
    // #region Explanation
    /*
    A* algorithm example: 
    we continue swapping the given cell down through the heap.

    The goal is to place the cell in a position in the heap where
    the parent cell is of a lower fCost and its children items
    are of a higher fCost. 
    
    To do this we check its children items and make sure the swap index 
    references the child with the lowest fCost. This is because we only
    swap with a child that has a lower fCost then the given cell so it 
    makes it easier to just pick the lower fCost child.
    
    (If we swap with the lower fCost child we do not need to check and see if 
    the other child also has a fCost lower then the given cell because we have already 
    done a valid swap) => allows less checks
    
    https://www.youtube.com/watch?v=3Dw5d7PlcTM
    */
    //#endregion
    while (true) {
      var leftChildIndex = Math.floor(item.heapIndex * 2 + 1);
      leftChildIndex = leftChildIndex < 0 ? 0 : leftChildIndex;

      var rightChildIndex = Math.floor(item.heapIndex * 2 + 2);
      rightChildIndex = rightChildIndex < 0 ? 0 : rightChildIndex;

      // if the left child exists
      if (leftChildIndex < this.items.length) {
        var swapIndex = leftChildIndex;

        // if the right child exists
        if (rightChildIndex < this.items.length) {
          // if the right child succeeds the left child
          if (
            this.items[rightChildIndex].compareTo(
              this.items[leftChildIndex],
              this.searchType
            ) > 0
          ) {
            // we will be swapping with the child
            swapIndex = rightChildIndex;
          }
        }

        // if the item precedes the item to swap with
        if (item.compareTo(this.items[swapIndex], this.searchType) < 0) {
          // swap with the item
          this.swap(item, this.items[swapIndex]);
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }

  swap(itemA, itemB) {
    // swap the items
    this.items[itemA.heapIndex] = itemB;
    this.items[itemB.heapIndex] = itemA;

    let item_A_index = itemA.heapIndex;

    // swap the indices
    itemA.heapIndex = itemB.heapIndex;
    itemB.heapIndex = item_A_index;
  }
}
