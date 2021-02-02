export default class Heap {
  /*The cell at the top of the heap has succeeded all the other cells and has the lowest fCost */
  cells = [];

  // if this is ever 0 it means there are no cells since it is always 1 ahead of the number of cells in the heap
  lastHeapCellIndex = -1;

  contains(cell) {
    // check if the heap includes a given cell
    return this.cells.includes(cell);
  }

  add(cell) {
    this.lastHeapCellIndex++;

    // assign the heap index to be the last added cell index
    cell.heapIndex = this.lastHeapCellIndex;
    this.cells[this.lastHeapCellIndex] = cell;
    this.sortUp(cell);
  }

  removeFirst() {
    let firstCell = this.cells[0];

    // remove the last cell and make it the first
    this.cells[0] = this.cells.pop();

    // change the (was last) cell's heapIndex to be 0
    this.cells[0].heapIndex = 0;

    // since we popped a cell out the lastHeapCellIndex must be decremented
    this.lastHeapCellIndex--;

    //sort the top cell down the heap
    this.sortDown(this.cells[0]);

    return firstCell;
  }

  updateItem(cell) {
    this.sortUp(cell);
  }

  sortUp(cell) {
    while (true) {
      let parentIndex = Math.floor((cell.heapIndex - 1) / 2);
      parentIndex = parentIndex < 0 ? 0 : parentIndex;

      var parentCell = this.cells[parentIndex];

      // if the cell succeeds (has a lower fcost) the parent cell
      if (cell.compareTo(parentCell) > 0) {
        // swap the cell and parent positions in the heap
        this.swap(cell, parentCell);
      } else {
        break;
      }
    }
  }

  sortDown(cell) {
    // #region Explanation
    /*we continue swapping the given cell down through the heap.

    The goal is to place the cell in a position in the heap where
    the parent cell is of a lower fCost and its children cells
    are of a higher fCost. 
    
    To do this we check its children cells and make sure the swap index 
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
      var leftChildIndex = Math.floor(cell.heapIndex * 2 + 1);
      leftChildIndex = leftChildIndex < 0 ? 0 : leftChildIndex;

      var rightChildIndex = Math.floor(cell.heapIndex * 2 + 2);
      rightChildIndex = rightChildIndex < 0 ? 0 : rightChildIndex;

      // if the left child exists
      if (leftChildIndex < this.cells.length) {
        var swapIndex = leftChildIndex;

        // if the right child exists
        if (rightChildIndex < this.cells.length) {
          // if the right child succeeds (has a lower fcost) the left child
          if (
            this.cells[rightChildIndex].compareTo(this.cells[leftChildIndex]) >
            0
          ) {
            // we will be swapping with the child that has the lowest fCost
            swapIndex = rightChildIndex;
          }
        }

        // if the cell precedes (has a higher fCost) the cell to swap with
        if (cell.compareTo(this.cells[swapIndex]) < 0) {
          // swap with the cell
          this.swap(cell, this.cells[swapIndex]);
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }

  swap(cellA, cellB) {
    // swap the cells
    this.cells[cellA.heapIndex] = cellB;
    this.cells[cellB.heapIndex] = cellA;

    let item_A_index = cellA.heapIndex;

    // swap the indices
    cellA.heapIndex = cellB.heapIndex;
    cellB.heapIndex = item_A_index;
  }
}
