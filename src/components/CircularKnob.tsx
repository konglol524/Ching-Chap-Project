"use client";
import { useState, useRef, useEffect } from "react";

interface CircularKnobProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export const CircularKnob = ({ value, min, max, onChange, className = "" }: CircularKnobProps) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [prevAngle, setPrevAngle] = useState<number>(0);
  const lastQuadrantRef = useRef<number>(0);

  const mapValueToAngle = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 360;
  };

  const mapAngleToValue = (angle: number, min: number, max: number) => {
    return Math.min(
      max,
      Math.max(min, (angle / 360) * (max - min) + min)
    );
  };

  useEffect(() => {
    setAngle(mapValueToAngle(value, min, max));
  }, [value, min, max]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (knobRef.current) {
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      let initialAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      initialAngle = initialAngle < 0 ? initialAngle + 360 : initialAngle;
      
      lastQuadrantRef.current = getQuadrant(deltaX, deltaY);
      setIsDragging(true);
      setPrevAngle(initialAngle);
    }
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getQuadrant = (x: number, y: number): number => {
    if (x >= 0 && y <= 0) return 1;
    if (x <= 0 && y <= 0) return 2;
    if (x <= 0 && y >= 0) return 3;
    return 4;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && knobRef.current) {
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const currentQuadrant = getQuadrant(deltaX, deltaY);
      let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      newAngle = newAngle < 0 ? newAngle + 360 : newAngle;

      // Calculate the shortest distance between angles
      let angleDiff = newAngle - prevAngle;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      // Prevent large angle jumps
      if (Math.abs(angleDiff) > 90) {
        return;
      }

      // Calculate new proposed angle
      let proposedAngle = angle + angleDiff;

      // Clamp the angle between 0 and 360
      proposedAngle = Math.max(0, Math.min(360, proposedAngle));

      // Update angles only if we haven't hit the limits or we're moving away from them
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

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, angle, prevAngle]);

  return (
    <div
      ref={knobRef}
      className={`relative w-24 h-24 ${className} bg-gray-800 rounded-full shadow-lg border border-gray-600 flex items-center justify-center`}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute w-full h-full rounded-full border-4 border-gray-700"></div>
      <div
        className="absolute w-1 h-12 bg-red-500 rounded-full"
        style={{ transform: "rotate(0deg)", top: "50%", transformOrigin: "center bottom" }}
      ></div>      
      <div
        className="absolute w-2 h-12 bg-yellow-400 rounded-full"
        style={{ transform: `rotate(${angle}deg)`, top: "50%", transformOrigin: "center top" }}
      ></div>
    </div>
  );
};