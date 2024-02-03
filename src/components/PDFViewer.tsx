import React from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  const encoded_url = encodeURIComponent(pdf_url);
  return (
    <object
      data={`https://docs.google.com/gview?url=${encoded_url}&embedded=true`}
      className="w-full h-full"
      type="text/html"
    ></object>
    // <p>Hello</p>
  );
};

export default PDFViewer;