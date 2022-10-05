import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ReactElement, useEffect, useRef, useState } from "react";
import PathfinderGrid from "./PathfinderGrid";
import styles from "../styles/Home.module.css";
import HeaderSection from "./HeaderSection";
import Toolbar from "./Toolbar";

const Home: NextPage = () => {
  const [activeTool, setActiveTool] = useState<string>("");
  const [reset, setReset] = useState<boolean>(false);
  const [runAlgorithm, setRunAlgorithm] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const setStartTool = () => {
    setActiveTool("start");
    console.log("start tool selected");
  };
  const setTargetTool = () => {
    setActiveTool("target");
    console.log("target tool selected");
  };
  const setWallTool = () => {
    setActiveTool("wall");
    console.log("wall tool selected");
  };
  const setEraserTool = () => {
    setActiveTool("eraser");
    console.log("eraser tool selected");
  };
  const toggleRunAlgorithm = () => {
    setRunAlgorithm(!runAlgorithm);
    console.log("Running pathfinding algorithm");
  };
  const toggleShowInfo = () => {
    setShowInfo(!showInfo);
    console.log("Showing additional information");
  };
  const toggleReset = () => {
    setReset(!reset);
    console.log("Grid reset initiated");
  };
  useEffect(() => {
    document.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
  }, []);
  const displayInfoModal = () => {};
  return (
    <div className=" bg-slate-800">
      <Head>
        <title>Pathfinder</title>
        <meta name="description" content="Pathfinding algorithm visualizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen w-full flex-col items-center">
        <Toolbar
          toggleStartSelected={setStartTool}
          toggleTargetSelected={setTargetTool}
          toggleWallSelected={setWallTool}
          toggleEraserSelected={setEraserTool}
          toggleRun={toggleRunAlgorithm}
          toggleInfo={toggleShowInfo}
          toggleReset={toggleReset}
        />
        <PathfinderGrid
          activeTool={activeTool}
          resetGrid={reset}
          runAlgorithm={runAlgorithm}
        />
      </main>

      <footer className="h-full bg-slate-700"></footer>
    </div>
  );
};

export default Home;
