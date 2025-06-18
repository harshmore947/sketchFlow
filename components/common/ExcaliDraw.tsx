"use client";
import {
  Excalidraw,
  convertToExcalidrawElements,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import React, { useEffect, useRef, useState } from "react";

const ExcalidrawWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    handleResize(); // Initial size
    window.addEventListener("resize", handleResize); // Resize updates

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "500px",
        width: "500px",
        border: "1px solid #444",
      }}
    >
      <Excalidraw
        theme="dark"
        initialData={{
          elements: [
            {
              type: "rectangle",
              id: "rect-1",
              x: 50,
              y: 50,
              width: 150,
              height: 100,
              angle: 0,
              seed: 1,
              version: 1,
              versionNonce: 1,
              isDeleted: false,
              groupIds: [],
              strokeWidth: 1,
              roughness: 1,
              opacity: 100,
              locked: false,
            },
          ],
          appState: {
            viewBackgroundColor: "#1e1e1e",
          },
        }}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
          },
        }}
      />
      <div className="text-white mt-2">
        Width: {dimensions.width}px | Height: {dimensions.height}px
      </div>
    </div>
  );
};

export default ExcalidrawWrapper;
