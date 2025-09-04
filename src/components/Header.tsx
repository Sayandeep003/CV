import React from 'react';
import { Briefcase, Target } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-purple-700 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/10 p-3 rounded-lg">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Career Co-Pilot</h1>
            <p className="text-blue-100 text-lg">Optimize your job applications with intelligent CV analysis</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Target className="w-6 h-6 text-orange-300 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-2">How it works</h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-orange-300">1. Upload Content:</span> Paste your job description and CV
                </div>
                <div>
                  <span className="font-medium text-orange-300">2. Get Analysis:</span> Receive targeted improvement suggestions
                </div>
                <div>
                  <span className="font-medium text-orange-300">3. Generate Letter:</span> Get a personalized cover letter
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};