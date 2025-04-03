import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NewsBoard from "./components/NewsBoard";
import TeletextFrame from "./components/TeletextFrame";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <TeletextFrame />
    </div>
  );
}

export default App;
