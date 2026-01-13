import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificatePage = () => {
  const certificateRef = useRef(null);

  const downloadPDF = () => {
    const input = certificateRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape, millimeters, A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Blood_Donation_Certificate.pdf');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Blood Donation Certificate</h1>
        <p className="mt-2 text-gray-600">Preview and download your official certificate.</p>
        <button
          onClick={downloadPDF}
          className="mt-4 bg-blood-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blood-700 transition flex items-center gap-2 mx-auto"
        >
          <span>📥</span> Download PDF
        </button>
      </div>

      {/* Certificate Preview Area */}
      <div className="overflow-auto w-full flex justify-center">
        <div
          ref={certificateRef}
          className="bg-white w-[1123px] h-[794px] p-16 shadow-2xl relative flex flex-col items-center justify-between text-center border-[20px] border-double border-blood-800"
          style={{ minWidth: '1123px', minHeight: '794px' }} // Standard web pixels roughly A4 @ 96dpi * scale
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-96 h-96 text-blood-600 fill-current">
              <path d="M100 15a85 85 0 100 170 85 85 0 100-170zm0 150a65 65 0 110-130 65 65 0 010 130z" />
              <path d="M100 45l-15 25h30l-15-25zm-25 40l-15 25h30l-15-25zm50 0l-15 25h30l-15-25z" />
            </svg>
          </div>

          {/* Setup Header */}
          <div className="w-full">
            <div className="text-6xl font-serif text-blood-700 font-bold uppercase tracking-widest mb-4">Certificate</div>
            <div className="text-3xl font-serif text-gray-500 uppercase tracking-widest">Of Appreciation</div>
            <div className="w-32 h-1 bg-blood-600 mx-auto mt-6"></div>
          </div>

          {/* Body */}
          <div className="w-full max-w-4xl">
            <p className="text-2xl text-gray-600 font-serif italic mb-4">This certificate is proudly presented to</p>
            <div className="text-5xl font-handwriting text-gray-900 border-b-2 border-gray-400 pb-2 mb-8 inline-block min-w-[500px]">
              {JSON.parse(localStorage.getItem('userInfo'))?.name || 'Valued Donor'}
            </div>
            <p className="text-xl text-gray-700 leading-relaxed font-serif">
              In recognition of your noble gesture of donating blood. 
              <br />
              Your voluntary contribution has helped save a life and offered hope to those in need.
              <br />
              We deeply appreciate your kindness and solidarity.
            </p>
          </div>

          {/* Footer / Signatures */}
          <div className="w-full flex justify-between items-end px-20 pb-10">
            <div className="text-center">
              <div className="w-64 border-t-2 border-gray-800 pt-2 mb-1">
                <span className="font-signature text-3xl">Dr. Smith</span>
              </div>
              <p className="text-gray-600 font-bold uppercase text-sm">Chief Medical Officer</p>
            </div>

            <div className="mb-4">
               {/* Seal */}
               <div className="w-32 h-32 rounded-full border-4 border-blood-700 flex items-center justify-center text-blood-700 font-bold text-center text-xs p-2 transform rotate-12">
                 OFFICIAL SEAL
                 <br />
                 LifeFlow System
               </div>
            </div>

            <div className="text-center">
              <div className="w-64 border-t-2 border-gray-800 pt-2 mb-1">
                <span className="text-xl">{new Date().toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 font-bold uppercase text-sm">Date</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
