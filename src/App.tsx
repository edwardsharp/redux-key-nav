import "./App.css";

import Examples from "./examples";
import { useNavigationKeys } from "./lib/navigation/navigation.hooks";

function App() {
  useNavigationKeys();
  return (
    <div className="App">
      <header className="App-header">redux-key-nav</header>
      <main>
        <Examples />
      </main>
    </div>
  );
}

export default App;
