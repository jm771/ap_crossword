// import React from 'react';
// import ReactDOM from 'react-dom';
// import { RandomizerPage } from './components/RandomizerPage';

import React from "react";
import ReactDOM from "react-dom/client";
import "./components/RandomizerGame.css";
import { RandomizerPage } from "./components/RandomizerPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RandomizerPage />
  </React.StrictMode>
);
