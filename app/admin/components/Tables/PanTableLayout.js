"use client";
import { useRef, useEffect } from "react";

export const PanTableLayout = ({ children }) => {
  const viewportRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !viewportRef.current) return;

    const dx = e.clientX - lastMousePositionRef.current.x;
    const dy = e.clientY - lastMousePositionRef.current.y;

    viewportRef.current.scrollLeft -= dx;
    viewportRef.current.scrollTop -= dy;

    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = viewport?.querySelector('div');
    if (!viewport || !content) return;

    // Calculate the initial scroll position to center the content
    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;

    const viewportWidth = viewport.offsetWidth;
    const viewportHeight = viewport.offsetHeight;

    // Set scroll position to the center of the content
    const scrollLeft = (contentWidth - viewportWidth) / 2;
    const scrollTop = (contentHeight - viewportHeight) / 2;

    viewport.scrollLeft = scrollLeft;
    viewport.scrollTop = scrollTop;

    viewport.addEventListener("mousemove", handleMouseMove);
    viewport.addEventListener("mouseup", handleMouseUp);
    viewport.addEventListener("mouseleave", handleMouseUp);

    return () => {
      viewport.removeEventListener("mousemove", handleMouseMove);
      viewport.removeEventListener("mouseup", handleMouseUp);
      viewport.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={viewportRef}
      style={{
        width: "500px", // Viewport size
        height: "500px",
        overflow: "scroll",
        position: "relative",
        border: "2px solid black",
        cursor: isDraggingRef.current ? "grabbing" : "grab",
        scrollbarWidth: "none", // Hide scrollbar (Firefox)
        msOverflowStyle: "none", // Hide scrollbar (IE/Edge)
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Hide scrollbar for WebKit browsers */}
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <div
        style={{
          width: "900px", // Large scrollable content
          height: "900px",
          position: "relative",
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(173,216,230,1) 100%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
