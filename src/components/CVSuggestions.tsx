import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export interface CVSuggestion {
  section: string;
  original: string;
  suggested: string;
  reason: string;
}

interface CVSuggestionsProps {
  suggestions: CVSuggestion[];
}

export const CVSuggestions: React.FC<CVSuggestionsProps> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">CV Improvement Suggestions</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {suggestion.section}
                  </span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Original:</h4>
                    <p className="bg-red-50 p-3 rounded border-l-4 border-red-200 text-gray-700">
                      "{suggestion.original}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                      Suggested Edit <ArrowRight className="w-4 h-4" />
                    </h4>
                    <p className="bg-green-50 p-3 rounded border-l-4 border-green-200 text-gray-700">
                      "{suggestion.suggested}"
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-200">
                  <h4 className="font-medium text-blue-700 mb-1">Why this improvement:</h4>
                  <p className="text-gray-700">{suggestion.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};