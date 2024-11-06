import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import ChatbotClient from './ChatbotClient';
import './PDF.css';

const PdfViewer: React.FC = () => {
  const viewerDiv = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isViewerInitialized, setIsViewerInitialized] = useState(false);

  useEffect(() => {
    if (isViewerInitialized && viewerDiv.current) {
      WebViewer(
        {
          path: 'lib', // Path to the 'lib' folder of WebViewer
        },
        viewerDiv.current
      )
        .then(instance => {
          const { Feature } = instance.UI;
          instance.UI.enableFeatures([Feature.FilePicker]);

          // Listen for file selection events from the input
          fileInputRef.current?.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
              instance.UI.loadDocument(file, { filename: file.name });
            }
          });
        })
        .catch(error => {
          console.error("Error loading PDF document:", error);
        });
    }
  }, [isViewerInitialized]);

  const handleFileInputClick = () => {
    // Initialize WebViewer only when a file is selected
    setIsViewerInitialized(true);
  };

  return (
    <div className="PdfViewer bg-gray-100 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-gray-200">
            <label
              htmlFor="file_upload"
              className="font-medium text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-300 group"
            >
              <span className="inline-flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:text-gray-800 transition-colors duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Choose a File</span>
              </span>
            </label>
            <input
              type="file"
              id="file_upload"
              ref={fileInputRef}
              accept=".pdf"
              onClick={handleFileInputClick}
              className="hidden"
            />
          </div>

          {/* The viewer div is only rendered when WebViewer is initialized */}
          {isViewerInitialized && (
            <div className="webviewer h-[80vh] relative">
              <div
                ref={viewerDiv}
                className="absolute top-0 left-0 w-full h-full transition-opacity duration-500 opacity-0 animate-fade-in"
              ></div>
            </div>
          )}
        </div>
      </div>

      <ChatbotClient />
    </div>
  );
};

export default PdfViewer;