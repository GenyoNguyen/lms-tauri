"use client";
import React, { useRef, useEffect, useState, useCallback} from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Copy,
  Download,
  Trash2,
  X,
  Eye
} from 'lucide-react';
import {toast} from 'react-hot-toast';
import ChatbotClient2 from "./ChatbotClient";

// Thiết lập worker cho PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

// Định nghĩa interface cho lịch sử PDF
interface PdfHistory {
  id: string;
  name: string;
  base64: string;
  lastOpened: number;
  currentPage: number;
  scale: number;
}

// Component chính
const PdfViewer: React.FC = () => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(0.6);
  const [numPages, setNumPages] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pdfHistory, setPdfHistory] = useState<PdfHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm quản lý lịch sử PDF
  const managePdfHistory = useCallback((newPdf: Omit<PdfHistory, 'id'>) => {
    const id = Date.now().toString();
    const updatedHistory = [
      { ...newPdf, id },
      ...pdfHistory
        .filter(pdf => pdf.name !== newPdf.name)
        .slice(0, 9) 
    ];

    try {
      localStorage.setItem('pdfHistory', JSON.stringify(updatedHistory));
      setPdfHistory(updatedHistory);
    } catch (storageError) {
      toast.error('Không thể lưu lịch sử PDF');
      console.error('Storage error:', storageError);
    }
  }, [pdfHistory]);

  // Xóa PDF khỏi lịch sử
  const removePdfFromHistory = useCallback((id: string) => {
    const updatedHistory = pdfHistory.filter(pdf => pdf.id !== id);

    try {
      localStorage.setItem('pdfHistory', JSON.stringify(updatedHistory));
      setPdfHistory(updatedHistory);
      toast.success('Đã xóa PDF khỏi lịch sử');
    } catch (storageError) {
      toast.error('Không thể xóa PDF');
      console.error('Storage error:', storageError);
    }
  }, [pdfHistory]);

  // Khôi phục lịch sử PDF
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('pdfHistory');
      if (savedHistory) {
        setPdfHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading PDF history:', error);
      toast.error('Không thể tải lịch sử PDF');
    }
  }, []);

  // Render trang PDF
  const renderPage = useCallback(async (pageNumber: number) => {
    if (!pdf || !canvasRef.current || !textLayerRef.current) {
      console.error('Canvas ref is null or PDF is not loaded');
      return;
    }

    setIsLoading(true);

    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('Canvas ref is not a valid canvas element');
      }
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error('Cannot get 2D rendering context');
      }

      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = viewport.width * devicePixelRatio * 2.25;
      canvas.height = viewport.height * devicePixelRatio * 2.25;

      context.scale(devicePixelRatio * 2.25, devicePixelRatio * 2.25);

      const renderContext = { canvasContext: context, viewport };

      const textLayer = textLayerRef.current;
      textLayer.innerHTML = "";
      textLayer.style.width = `${viewport.width}px`;
      textLayer.style.height = `${viewport.height}px`;

      const renderTask = page.render(renderContext);
      await renderTask.promise;

      const textContent = await page.getTextContent();
      const textContentSource = {
        textContentSource: textContent,
        container: textLayer,
        viewport: viewport,
        textDivs: [],
        enhanceTextSelection: true,
      };

      // @ts-expect-error - Sử dụng API không chính thức
      const renderTextLayer = new pdfjsLib.renderTextLayer(textContentSource);
      await renderTextLayer.render();

    } catch (error) {
      console.error("Lỗi render trang PDF:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pdf, scale]);

  // Hiệu ứng render trang
  useEffect(() => {
    if (pdf) {
      renderPage(currentPage);
    }
  }, [pdf, currentPage, scale, renderPage]);

  // Xử lý tải file
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const typedArray = new Uint8Array(
        atob(base64.split(',')[1])
          .split('')
          .map(char => char.charCodeAt(0))
      );

      const loadedPdf = await pdfjsLib.getDocument(typedArray).promise;

      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
      setCurrentPage(1);
      setFileName(file.name);

      // Lưu vào lịch sử
      managePdfHistory({
        name: file.name,
        base64,
        lastOpened: Date.now(),
        currentPage: 1,
        scale: 0.5
      });

      toast.success(`Đã tải ${file.name}`);
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error('Tải PDF thất bại');
    } finally {
      setIsLoading(false);
    }
  }, [managePdfHistory]);

  // Mở PDF từ lịch sử
  const handleOpenPdfFromHistory = useCallback(async (historyItem: PdfHistory) => {
    setIsLoading(true);

    try {
      const typedArray = new Uint8Array(
        atob(historyItem.base64.split(',')[1])
          .split('')
          .map(char => char.charCodeAt(0))
      );

      const loadedPdf = await pdfjsLib.getDocument(typedArray).promise;

      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
      setCurrentPage(historyItem.currentPage);
      setScale(historyItem.scale);
      setFileName(historyItem.name);
      setShowHistory(false);

      toast.success(`Đã mở ${historyItem.name}`);
    } catch (error) {
      console.error("Error loading PDF from history:", error);

      toast.error('Mở PDF thất bại');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-100 p-6 sm:p-8 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-200">
        {/* Header */}
        <div className="bg-teal-400 text-white py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl font-semibold">
              {fileName || "PDF Viewer"}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <label
              htmlFor="file_upload"
              className="cursor-pointer hover:bg-teal-500 px-4 py-2 rounded-md flex items-center space-x-2">
              <Copy className="w-5 h-5" />
              <span className="hidden sm:block">Tải lên</span>
            </label>
            <input
              id="file_upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Body */}
        <div className="overflow-hidden relative">
          {/* Canvas for rendering PDF */}
          <canvas ref={canvasRef} className="block mx-auto" />
          
          {/* Text Layer for PDF */}
          <div ref={textLayerRef} className="absolute top-0 left-0 w-full h-full"></div>

          {/* Controls */}
          <div className="absolute bottom-4 left-0 right-0 bg-white bg-opacity-75 px-4 py-2 flex justify-between items-center text-teal-500">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="p-2 disabled:opacity-50"
              >
                <ChevronLeft />
              </button>
              <span>{currentPage}/{numPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
                disabled={currentPage === numPages || isLoading}
                className="p-2 disabled:opacity-50"
              >
                <ChevronRight />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setScale(scale => Math.max(scale - 0.05, 0.5))}
                className="p-2 disabled:opacity-50"
                disabled={scale === 0.5}
              >
                <ZoomOut />
              </button>
              <button
                onClick={() => setScale(scale => Math.min(scale + 0.01, 3))}
                className="p-2 disabled:opacity-50"
                disabled={scale === 3}
              >
                <ZoomIn />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="p-2 hover:bg-teal-300 rounded-md"
              >
                <Download />
              </button>
              <button
                onClick={() => {
                  if (canvasRef.current) {
                    const url = canvasRef.current.toDataURL();
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName || 'pdf-capture.png';
                    link.click();
                  }
                }}
                className="p-2 hover:bg-teal-300 rounded-md"
              >
                <Download />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 hover:bg-teal-300 rounded-md"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        </div>

        {/* History Modal */}
{showHistory && (
  <div className="fixed inset-0 bg-rose-100 bg-opacity-30 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-teal-500 text-white p-5 flex justify-between items-center rounded-t-2xl">
        <h3 className="text-xl font-semibold">Lịch sử PDF</h3>
        <button 
          onClick={() => setShowHistory(false)}
          className="hover:bg-teal-600 rounded-full p-2 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {pdfHistory.length === 0 ? (
          <div className="text-center text-gray-50  0 p-6">
            <FileText className="mx-auto w-12 h-12 text-teal-300 mb-4" />
            <p>Không có lịch sử PDF</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pdfHistory.map((historyItem) => (
              <li 
                key={historyItem.id} 
                className="p-4 flex justify-between items-center hover:bg-teal-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-teal-500" />
                  <span className="text-sm text-teal-600 truncate max-w-[220px]">
                    {historyItem.name}
                  </span>
                </div>
                <div className="flex space-x-3">
                  {/* Open Button */}
                  <button
                    onClick={() => handleOpenPdfFromHistory(historyItem)}
                    className="text-teal-500 hover:bg-teal-100 p-2 rounded-md transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => removePdfFromHistory(historyItem.id)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-md transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ChatbotClient2 />
    </div>
  );
};

export default PdfViewer;