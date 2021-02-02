import Grid from "./Grid";
import Header from "./Header";
import Heap from "./Heap";
import Cell from "./Cell";
import "./App.css";

const heap = new Heap();

for (let i = 0; i < 20; i++) {
  let cell = new Cell(i + 1, (i + 2) / 2);
  cell.gCost = Math.floor(Math.random() * 100);
  cell.hCost = Math.floor(Math.random() * 100);
  heap.add(cell);
}

for (let i = 0; i < 20; i++) {
  let lowestFCost = heap.removeFirst();
  console.log("lowest fCost ", lowestFCost.fCost());
}

function App() {
  return (
    <div className="App">
      <Header />
      <Grid />
    </div>
  );
}

export default App;
