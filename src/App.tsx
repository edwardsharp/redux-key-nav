import "./App.css";

import Nested from "./examples/Nested";
import { useNavigationKeys } from "./lib/navigation/navigation.hooks";

function App() {
  useNavigationKeys();
  return (
    <div className="App">
      <header className="App-header">redux-key-nav</header>
      <main>
        <Nested />
      </main>
    </div>
  );
}

export default App;
