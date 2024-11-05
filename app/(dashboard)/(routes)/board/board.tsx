"use client";

import React, { useRef, useState, useEffect, useContext } from 'react';
import { ThemeContext } from "../../ThemeContext";
import { cn } from "@/lib/utils";
import { 
  Pencil, 
  Eraser, 
  Circle, 
  Square, 
  Type, 
  Minus, 
  Download, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Paintbrush,
  MousePointer,
} from 'lucide-react';

type Tool = 
  | 'select'
  | 'pencil'
  | 'brush'
  | 'eraser'
  | 'text'
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'dropper'
  | 'move';

interface Point {
  x: number;
  y: number;
}

interface ShapeProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  lineWidth: number;
}

const Board = () => {
  const [pages, setPages] = useState<{
    id: number;
    data: string | null;
    toolState: {
      color: string;
      tool: Tool;
      size: number;
    };
  }[]>([
    {
      id: 1,
      data: null,
      toolState: {
        color: '#000000',
        tool: 'pencil',
        size: 2,
      },
    },
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const { isDark } = useContext(ThemeContext);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [lineWidth, setLineWidth] = useState(2);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [savedImageData, setSavedImageData] = useState<ImageData | null>(null);

  // History for undo functionality
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveCanvasState = (fromUndoRedo = false) => {
    if (canvasRef.current && context) {
      const currentDrawing = canvasRef.current.toDataURL();

      if (!fromUndoRedo) {
        // If we're not undoing/redoing, we add the new state to history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentDrawing);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }

      const newPages = [...pages];
      newPages[currentPage] = {
        ...newPages[currentPage],
        data: currentDrawing,
        toolState: {
          color: currentColor,
          tool: currentTool,
          size: lineWidth,
        },
      };
      setPages(newPages);
    }
  };

  const restoreCanvasState = (dataURL: string | null) => {
    if (canvasRef.current && context) {
      if (dataURL) {
        const img = new Image();
        img.onload = () => {
          context.fillStyle = "#FFFFFF";
          context.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          context.drawImage(img, 0, 0);
        };
        img.src = dataURL;
      } else {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        setContext(ctx);

        const pageToolState = pages[currentPage].toolState;

        ctx.strokeStyle = pageToolState.tool === 'eraser'
          ? "#FFFFFF"
          : pageToolState.color;

        ctx.lineWidth = pageToolState.size;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        // Always use a white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Restore the canvas data
        restoreCanvasState(pages[currentPage].data);

        // Initialize history with the current canvas state
        const initialData = canvas.toDataURL();
        setHistory([initialData]);
        setHistoryIndex(0);
      }
    }

    // Reset text input state when changing pages
    setIsAdding(false);
    setTextPosition(null);
  }, [currentPage, isDark, pages]);

  useEffect(() => {
    if (context) {
      context.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
      context.lineWidth = lineWidth;
    }
  }, [currentTool, currentColor, lineWidth, context]);

  // Add event listener for Ctrl + Z (Undo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [historyIndex, history]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreCanvasState(history[newIndex]);
      saveCanvasState(true);
    }
  };

  const drawLine = (props: ShapeProps) => {
    if (!context) return;
    const { startX, startY, endX, endY, color, lineWidth } = props;
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.closePath();
  };

  const drawRectangle = (props: ShapeProps) => {
    if (!context) return;
    const { startX, startY, endX, endY, color, lineWidth } = props;
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.rect(startX, startY, endX - startX, endY - startY);
    context.stroke();
    context.closePath();
  };

  const drawCircle = (props: ShapeProps) => {
    if (!context) return;
    const { startX, startY, endX, endY, color, lineWidth } = props;
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.arc(startX, startY, radius, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();
  };

  const addText = (x: number, y: number) => {
    setTextPosition({ x, y });
    setIsAdding(true);
    if (textInputRef.current) {
      textInputRef.current.style.left = `${x}px`;
      textInputRef.current.style.top = `${y}px`;
      textInputRef.current.focus();
    }
  };

  const handleTextSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && context && textPosition) {
      e.preventDefault();
      const text = (e.target as HTMLTextAreaElement).value;
      context.font = `${lineWidth * 8}px Arial`;
      context.fillStyle = currentColor;
      context.fillText(text, textPosition.x, textPosition.y);
      setIsAdding(false);
      setTextPosition(null);
      if (textInputRef.current) {
        textInputRef.current.value = '';
      }
      saveCanvasState();
    }
  };

  const getColorAtPoint = (x: number, y: number) => {
    if (context) {
      const pixel = context.getImageData(x, y, 1, 1).data;
      const color = `#${[pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      setCurrentColor(color);
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'dropper') {
      getColorAtPoint(x, y);
      return;
    }

    if (currentTool === 'text') {
      addText(x, y);
      return;
    }

    setIsDrawing(true);
    setStartPoint({ x, y });

    if (['line', 'rectangle', 'circle'].includes(currentTool)) {
      if (context && canvasRef.current) {
        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        setSavedImageData(imageData);
      }
    } else {
      if (context) {
        context.beginPath();
        context.moveTo(x, y);
        context.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
        context.lineWidth = lineWidth;
      }
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !context || !canvasRef.current || !startPoint) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (['line', 'rectangle', 'circle'].includes(currentTool)) {
      if (savedImageData) {
        context.putImageData(savedImageData, 0, 0);
      }

      const shapeProps = {
        startX: startPoint.x,
        startY: startPoint.y,
        endX: x,
        endY: y,
        color: currentColor,
        lineWidth: lineWidth
      };

      switch (currentTool) {
        case 'line':
          drawLine(shapeProps);
          break;
        case 'rectangle':
          drawRectangle(shapeProps);
          break;
        case 'circle':
          drawCircle(shapeProps);
          break;
      }
    } else {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      if (context && !['line', 'rectangle', 'circle'].includes(currentTool)) {
        context.closePath();
      }
      setIsDrawing(false);
      setSavedImageData(null);
      saveCanvasState();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current && context) {
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveCanvasState();
    }
  };

  const downloadCanvas = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL("image/png");
      link.download = `canvas-drawing-page-${currentPage + 1}.png`;
      link.click();
    }
  };

  const addNewPage = () => {
    saveCanvasState(); // Save current page before adding a new one
    const newPage = {
      id: pages.length + 1,
      data: null,
      toolState: {
        color: currentColor,
        tool: currentTool,
        size: lineWidth,
      },
    };
    setPages([...pages, newPage]);
    setCurrentPage(pages.length);
    // Reset history for the new page
    setHistory([]);
    setHistoryIndex(-1);
  };

  const navigatePage = (direction: 'prev' | 'next') => {
    saveCanvasState();
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setLineWidth(newSize);
    if (context) context.lineWidth = newSize;
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    if (context && currentTool !== 'eraser') {
      context.strokeStyle = newColor;
    }
  };

  const ToolButton = ({ tool, icon: Icon, tooltip }: { tool: Tool; icon: React.ElementType; tooltip: string }) => (
    <button
      onClick={() => setCurrentTool(tool)}
      className={cn(
        "p-3 rounded-lg transition-all duration-300 relative group",
        currentTool === tool
          ? isDark 
            ? "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20" 
            : "bg-blue-500 hover:bg-blue-400 shadow-lg shadow-blue-300/30"
          : isDark 
            ? "bg-gray-700 hover:bg-gray-600" 
            : "bg-gray-100 hover:bg-gray-200"
      )}
    >
      <Icon className={cn("w-5 h-5", currentTool === tool ? "text-white" : isDark ? "text-gray-300" : "text-gray-600")} />
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        {tooltip}
      </span>
    </button>
  );

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen w-full p-6 space-y-6",
      isDark ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-gray-100"
    )}>
      {/* Drawing Tools */}
      <div className={cn(
        "flex items-center space-x-6 p-4 rounded-xl shadow-lg backdrop-blur-sm",
        isDark ? "bg-gray-800/90" : "bg-white/90"
      )}>
        <div className="flex space-x-2">
          <ToolButton tool="pencil" icon={Pencil} tooltip="Pencil" />
          <ToolButton tool="eraser" icon={Eraser} tooltip="Eraser" />
          <ToolButton tool="brush" icon={Paintbrush} tooltip="Brush" />
          <ToolButton tool="line" icon={Minus} tooltip="Line" />
          <ToolButton tool="rectangle" icon={Square} tooltip="Rectangle" />
          <ToolButton tool="circle" icon={Circle} tooltip="Circle" />
          <ToolButton tool="text" icon={Type} tooltip="Text" />
          <ToolButton tool="dropper" icon={MousePointer} tooltip="Color Picker" />
          {/* Add more tools as needed */}
        </div>

        <div className={cn(
          "h-6 w-px",
          isDark ? "bg-gray-600" : "bg-gray-300"
        )} />

        <div className="flex items-center space-x-4">
          <input
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-opacity-50 transition-transform hover:scale-105"
          />
          <div className="flex items-center space-x-3">
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={handleSizeChange}
              className="w-32 accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Canvas with Navigation Buttons */}
      <div className="flex items-center justify-center relative w-full">
        {pages.length > 1 && (
          <button
            onClick={() => navigatePage('prev')}
            disabled={currentPage === 0}
            className={cn(
              "absolute left-4 p-4 rounded-full transition-all duration-300 shadow-lg",
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800" 
                : "bg-white hover:bg-gray-50 disabled:bg-gray-100",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <ChevronLeft className={cn("w-6 h-6", isDark ? "text-gray-200" : "text-gray-700")} />
          </button>
        )}

        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            width={1050}
            height={650}
            className="rounded-xl shadow-xl bg-white"
          />
          {isAdding && (
            <textarea
              ref={textInputRef}
              onKeyDown={handleTextSubmit}
              className="absolute z-10 bg-transparent outline-none resize-none"
              style={{
                left: `${textPosition?.x}px`,
                top: `${textPosition?.y}px`,
                color: currentColor,
                fontSize: `${lineWidth * 8}px`,
              }}
            />
          )}
        </div>

        {pages.length > 1 && (
          <button
            onClick={() => navigatePage('next')}
            disabled={currentPage === pages.length - 1}
            className={cn(
              "absolute right-4 p-4 rounded-full transition-all duration-300 shadow-lg",
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800" 
                : "bg-white hover:bg-gray-50 disabled:bg-gray-100",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <ChevronRight className={cn("w-6 h-6", isDark ? "text-gray-200" : "text-gray-700")} />
          </button>
        )}
      </div>

      {/* Page Indicator and Action Buttons */}
      <div className="flex items-center justify-between w-full max-w-[1200px]">
        <span className={cn(
          "px-4 py-2 rounded-md font-medium",
          isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
        )}>
          Page {currentPage + 1} of {pages.length}
        </span>

        <div className="flex space-x-4">
          <button
            onClick={clearCanvas}
            className={cn(
              "px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2",
              isDark 
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20" 
                : "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-300/30"
            )}
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear</span>
          </button>
          <button
            onClick={downloadCanvas}
            className={cn(
              "px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2",
              isDark 
                ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20" 
                : "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-300/30"
            )}
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
          <button
            onClick={addNewPage}
            className={cn(
              "px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2",
              isDark 
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20" 
                : "bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-300/30"
            )}
          >
            <Plus className="w-5 h-5" />
            <span>New Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;
