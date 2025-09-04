import React from 'react';
import { FileText, Heart, Upload } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.js`;

interface InputSectionProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  cvContent: string;
  setCvContent: (value: string) => void;
  personalTouch: string;
  setPersonalTouch: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  jobDescription,
  setJobDescription,
  cvContent,
  setCvContent,
  personalTouch,
  setPersonalTouch,
  onAnalyze,
  isAnalyzing
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      extractPDFText(file);
    } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      // For Word documents, we'll read as text for now (limited support)
      alert('Word document support is limited. For best results, please save your CV as a PDF or plain text file.');
      readAsText(file);
    } else {
      readAsText(file);
    }
  };

  const readAsText = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCvContent(content);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  const extractPDFText = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      setCvContent(fullText.trim());
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      alert('Error reading PDF file. Please try a different file or convert to text format.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Job Description</h3>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Upload className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Upload Your CV</h3>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Click to upload your CV
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Supports PDF, DOC, DOCX, and TXT files
                </p>
              </label>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {cvContent && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">CV Content Preview:</h4>
                <div className="max-h-32 overflow-y-auto text-sm text-gray-600 bg-white p-3 rounded border">
                  {cvContent.substring(0, 300)}...
                </div>
                <button
                  onClick={() => setCvContent('')}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Heart className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Personal Touch (Optional)</h3>
        </div>
        <input
          type="text"
          value={personalTouch}
          onChange={(e) => setPersonalTouch(e.target.value)}
          placeholder="Add a personal connection to the company or role..."
          className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onAnalyze}
          disabled={!jobDescription.trim() || !cvContent.trim() || isAnalyzing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze & Generate'}
        </button>
      </div>
    </div>
  );
};