import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";

import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

const DownloadModal = ({setVisible}) => {
    const [filename, setFilename] = useState("");

    const downloadWord = () => {
        const editorContent = document.querySelector(".ql-editor").innerHTML;
        const textContent = editorContent.replace(/<[^>]+>/g, "");
      
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [new Paragraph(textContent)],
            },
          ],
        });
      
        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, `${filename == "" ? "document" : filename}.docx`);
        });
      };

    const handleDownload = async () => {

        const editorContent = document.querySelector(".ql-editor");
        const pdf = new jsPDF();
        const canvas = await html2canvas(editorContent);
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190; 
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        let heightLeft = imgHeight;
        let position = 0;
    
        // Add the first page
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    
        // If the content spans multiple pages
        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${filename == "" ? "document" : filename}.pdf`);
    
    }
  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">

            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">


                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">

                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-light-400 sm:mx-0 sm:size-10">
                            <svg className="animate-bounce size-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0l3-3m-3 3l-3-3M4.5 19.5h15" />
                            </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 className="text-base font-semibold text-gray-900" id="modal-title">Enter a name for your file :</h3>
                            <div className="mt-2">
                                <input
                                    id="file-name"
                                    type="text"
                                    placeholder="Enter file name"
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">

                        <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={downloadWord}>Download as Word</button>

                        <button onClick={handleDownload} className='bg-slate-500 text-white font-bold  px-4 rounded'>Download as PDF</button>

                        <button type="button" className="mt-3 mr-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => setVisible(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DownloadModal;
