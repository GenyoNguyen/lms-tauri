import React, { useRef, useEffect } from 'react';
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';

interface WebViewerComponentProps {
  file: File | null;
}

const WebViewerComponent: React.FC<WebViewerComponentProps> = ({ file }) => {
  const viewerDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let viewerInstance: WebViewerInstance | null = null;

    if (viewerDiv.current) {
      WebViewer(
        {
          path: 'lib',
        },
        viewerDiv.current
      )
        .then((wvInstance) => {
          viewerInstance = wvInstance;
          const { Feature } = wvInstance.UI;
          wvInstance.UI.enableFeatures([Feature.FilePicker]);
          if (file) {
            wvInstance.UI.loadDocument(file, { filename: file.name });
          }
        })
        .catch((error) => {
          console.error('Error loading PDF document:', error);
        });
    }

    return () => {
      // Hủy instance khi component unmount
      if (viewerInstance) {
        viewerInstance.UI.dispose();
      }
    };
  }, [file]);

  return <div className="webviewer" ref={viewerDiv}></div>;
};

export default WebViewerComponent;


