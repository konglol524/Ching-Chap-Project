"use client";
import { useState, useRef, useEffect } from "react";

interface CircularKnobProps {
  length: number | null;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export const CircularKnob = ({ length, value, min, max, onChange, className = "" }: CircularKnobProps) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [prevAngle, setPrevAngle] = useState<number>(0);
  const lastQuadrantRef = useRef<number>(0);

  const mapValueToAngle = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 360;
  };

  const mapAngleToValue = (angle: number, min: number, max: number) => {
    return Math.round(Math.min(
      max,
      Math.max(min, (angle / 360) * (max - min) + min)
    ));
  };

  useEffect(() => {
    setAngle(mapValueToAngle(value, min, max));
  }, [value, min, max]);

  useEffect(() => {
    if (length) {
      setAngle(mapValueToAngle(60000 / length, min, max));
    }
  }, [length, min, max]);

  const handleStart = (clientX: number, clientY: number) => {
    if (knobRef.current) {
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      let initialAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      initialAngle = initialAngle < 0 ? initialAngle + 360 : initialAngle;
      
      lastQuadrantRef.current = getQuadrant(deltaX, deltaY);
      setIsDragging(true);
      setPrevAngle(initialAngle);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
    e.preventDefault();
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const getQuadrant = (x: number, y: number): number => {
    if (x >= 0 && y <= 0) return 1;
    if (x <= 0 && y <= 0) return 2;
    if (x <= 0 && y >= 0) return 3;
    return 4;
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging && knobRef.current) {
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      const currentQuadrant = getQuadrant(deltaX, deltaY);
      let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      newAngle = newAngle < 0 ? newAngle + 360 : newAngle;

      let angleDiff = newAngle - prevAngle;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      if (Math.abs(angleDiff) > 90) {
        return;
      }

      let proposedAngle = angle + angleDiff;
      proposedAngle = Math.max(0, Math.min(360, proposedAngle));

      if (
        (proposedAngle > 0 && proposedAngle < 360) || 
        (proposedAngle === 0 && angleDiff > 0) ||
        (proposedAngle === 360 && angleDiff < 0)
      ) {
        setAngle(proposedAngle);
        setPrevAngle(newAngle);
        onChange(mapAngleToValue(proposedAngle, min, max));
      }

      lastQuadrantRef.current = currentQuadrant;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
    e.preventDefault(); // Prevents the page from scrolling on touch devices
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: false }); // Disable passive to prevent scrolling
      document.addEventListener("touchend", handleEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, angle, prevAngle]);

  return (
    <div
      ref={knobRef}
      className={`relative w-24 h-24 ${className} bg-gray-800 rounded-full shadow-lg border border-gray-600 flex items-center justify-center`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute w-full h-full rounded-full border-4 border-gray-700"></div>
      <div
        className="absolute w-1 h-12 bg-red-500 rounded-full"
        style={{ transform: "rotate(0deg)", top: "50%", transformOrigin: "center bottom" }}
      ></div>      
      <div
        className="absolute w-2 h-12 bg-yellow-400 border-black border-2 rounded-full"
        style={{ transform: `rotate(${angle}deg)`, top: "50%", transformOrigin: "center top" }}
      ></div>
    </div>
  );
};