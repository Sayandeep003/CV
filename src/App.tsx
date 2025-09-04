import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { CVSuggestions, CVSuggestion } from './components/CVSuggestions';
import { CoverLetter } from './components/CoverLetter';
import { analyzeJobAndCV, generateCoverLetter } from './utils/analysisEngine';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [cvContent, setCvContent] = useState('');
  const [personalTouch, setPersonalTouch] = useState('');
  const [suggestions, setSuggestions] = useState<CVSuggestion[]>([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !cvContent.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { suggestions: newSuggestions, keywords } = analyzeJobAndCV(jobDescription, cvContent);
    const newCoverLetter = generateCoverLetter(jobDescription, cvContent, personalTouch, keywords);
    
    setSuggestions(newSuggestions);
    setCoverLetter(newCoverLetter);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <InputSection
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        cvContent={cvContent}
        setCvContent={setCvContent}
        personalTouch={personalTouch}
        setPersonalTouch={setPersonalTouch}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
      />
      
      {suggestions.length > 0 && <CVSuggestions suggestions={suggestions} />}
      {coverLetter && <CoverLetter coverLetter={coverLetter} />}
      
      {(suggestions.length > 0 || coverLetter) && (
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-300">
              🚀 Your optimized application materials are ready! Review, customize, and land that dream job.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;