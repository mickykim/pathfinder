import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ReactElement, useEffect, useRef, useState } from "react";
import PathfinderGrid from "../components/PathfinderGrid";
import styles from "../styles/Home.module.css";
import HeaderSection from "../components/HeaderSection";
import Toolbar from "../components/Toolbar";
import InfoModal from "../components/InfoModal";

const Home: NextPage = () => {
  const [activeTool, setActiveTool] = useState<string>("");
  const [reset, setReset] = useState<boolean>(false);
  const [runAlgorithm, setRunAlgorithm] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState("");

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
  const setDijkstrasAlgorithm = () => {
    setCurrentAlgorithm("dijkstra");
    console.log("Dijkstra set");
  };

  const setAStar = () => {
    setCurrentAlgorithm("astar");
    console.log("A* set");
  };
  useEffect(() => {
    setStartTool();
    setDijkstrasAlgorithm();
    document.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
    //Prevent mobile scrolling
    window.addEventListener("scroll", (e) => {
      e.preventDefault();
      window.scrollTo(0, 0);
    });
  }, []);
  const displayInfoModal = () => {};
  return (
    // hide overflow scrolling for mobile
    <div className=" fixed top-0 left-0 right-0 bottom-0 min-h-[-webkit-fill-available]  min-h-screen bg-slate-800">
      <Head>
        <title>Pathfinder</title>
        <meta name="description" content="Pathfinding algorithm visualizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative flex h-full touch-none flex-col items-center">
        <Toolbar
          toggleStartSelected={setStartTool}
          toggleTargetSelected={setTargetTool}
          toggleWallSelected={setWallTool}
          toggleEraserSelected={setEraserTool}
          toggleRun={toggleRunAlgorithm}
          toggleInfo={toggleShowInfo}
          toggleReset={toggleReset}
          toggleDijkstra={setDijkstrasAlgorithm}
          toggleAStar={setAStar}
          currentAlgorithm={currentAlgorithm}
        />
        <PathfinderGrid
          activeTool={activeTool}
          resetGrid={reset}
          runAlgorithm={runAlgorithm}
          currentAlgorithm={currentAlgorithm}
        />
        {showInfo ? <InfoModal toggleInfo={toggleShowInfo} /> : <></>}
      </main>

      <footer className="h-full bg-slate-700"></footer>
    </div>
  );
};

export default Home;
