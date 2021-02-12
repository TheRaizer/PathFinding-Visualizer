import Grid from "./Grid";
import Header from "./Header";
import { rndOdd } from "./UtilityFuncs";
import "./App.css";

for (let i = 0; i < 10; i++) {
  console.log(rndOdd(3, 11));
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
