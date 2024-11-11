// App.tsx
"use client"; // Add this directive at the top to make the component a client component

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PdfViewer and ChatbotClient for client-side only
const PdfViewer = dynamic(() => import('./PDFReader'), { ssr: false });

const App: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // Ensure this code only runs in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient && <PdfViewer />}
    </div>
  );
};

export default App;
