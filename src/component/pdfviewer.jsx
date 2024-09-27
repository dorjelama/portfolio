// import { useState } from "react";
import { Document, Page } from "react-pdf";
import CV from "../assets/Dorje Lama CV.pdf";

const pdfviewer = () => {
  return (
    <div className="absolute top-40 left-40">
      <Document file={CV}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default pdfviewer;
