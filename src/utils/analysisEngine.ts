import { CVSuggestion } from '../components/CVSuggestions';

export const analyzeJobAndCV = (jobDescription: string, cvContent: string): {
  suggestions: CVSuggestion[];
  keywords: string[];
} => {
  // Extract keywords from job description
  const keywords = extractKeywords(jobDescription);
  
  // Generate CV suggestions
  const suggestions = generateCVSuggestions(jobDescription, cvContent, keywords);
  
  return { suggestions, keywords };
};

const extractKeywords = (jobDescription: string): string[] => {
  const jobLower = jobDescription.toLowerCase();
  
  // Technical skills and tools
  const technicalSkills = [
    'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'aws', 'docker', 'kubernetes',
    'machine learning', 'data analysis', 'excel', 'powerbi', 'tableau', 'salesforce',
    'project management', 'agile', 'scrum', 'jira', 'git', 'api', 'rest', 'microservices'
  ];
  
  // Soft skills and competencies
  const softSkills = [
    'leadership', 'management', 'team', 'communication', 'collaboration', 'problem-solving',
    'analytical', 'strategic', 'innovation', 'customer service', 'sales', 'marketing',
    'budget', 'revenue', 'growth', 'efficiency', 'quality', 'compliance', 'training'
  ];
  
  // Industry-specific terms
  const industryTerms = [
    'healthcare', 'finance', 'fintech', 'e-commerce', 'retail', 'manufacturing',
    'consulting', 'education', 'non-profit', 'startup', 'enterprise'
  ];
  
  const allKeywords = [...technicalSkills, ...softSkills, ...industryTerms];
  const foundKeywords = allKeywords.filter(keyword => 
    jobLower.includes(keyword)
  );
  
  // Extract years of experience requirements
  const experienceMatch = jobDescription.match(/(\d+)[\+\-\s]*years?\s+(?:of\s+)?experience/i);
  if (experienceMatch) {
    foundKeywords.push(`${experienceMatch[1]}+ years experience`);
  }
  
  // Extract degree requirements
  const degreeMatch = jobDescription.match(/(bachelor|master|phd|degree)/i);
  if (degreeMatch) {
    foundKeywords.push(degreeMatch[1].toLowerCase());
  }
  
  return foundKeywords.slice(0, 8);
};

const generateCVSuggestions = (jobDescription: string, cvContent: string, keywords: string[]): CVSuggestion[] => {
  const suggestions: CVSuggestion[] = [];
  const cvLower = cvContent.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Check if CV contains quantifiable achievements
  const hasMetrics = /\d+%|\$\d+|increased|improved|reduced|achieved|delivered|managed \d+|led \d+/i.test(cvContent);
  
  // Find missing keywords
  const missingKeywords = keywords.filter(keyword => 
    !cvLower.includes(keyword.toLowerCase())
  );
  
  // Analyze CV sections
  const sections = identifyCVSections(cvContent);
  
  // Professional Summary suggestions
  if (sections.summary) {
    const summaryIssues = [];
    if (!hasMetrics) summaryIssues.push('lacks quantifiable achievements');
    if (missingKeywords.length > 3) summaryIssues.push('missing key job requirements');
    if (sections.summary.length < 100) summaryIssues.push('too brief');
    
    if (summaryIssues.length > 0) {
      suggestions.push({
        section: 'Professional Summary',
        original: sections.summary.substring(0, 150) + (sections.summary.length > 150 ? '...' : ''),
        suggested: generateImprovedSummary(sections.summary, keywords.slice(0, 4), jobDescription),
        reason: `Enhanced to include ${keywords.slice(0, 3).join(', ')} and added quantifiable achievements to better align with job requirements.`
      });
    }
  }
  
  // Experience section suggestions
  if (sections.experience) {
    const experienceLines = sections.experience.split('\n').filter(line => line.trim().length > 20);
    experienceLines.slice(0, 2).forEach((line, index) => {
      if (!/\d+%|\$\d+|increased|improved|reduced|achieved/i.test(line)) {
        suggestions.push({
          section: `Work Experience - Entry ${index + 1}`,
          original: line.trim(),
          suggested: enhanceExperienceLine(line.trim(), keywords, jobDescription),
          reason: `Added quantifiable metrics and incorporated job-relevant keywords (${keywords.slice(0, 2).join(', ')}) to demonstrate impact.`
        });
      }
    });
  }
  
  // Skills section suggestions
  if (sections.skills && missingKeywords.length > 0) {
    suggestions.push({
      section: 'Skills',
      original: sections.skills.substring(0, 100) + '...',
      suggested: enhanceSkillsSection(sections.skills, missingKeywords.slice(0, 4)),
      reason: `Added missing technical skills and competencies mentioned in the job description: ${missingKeywords.slice(0, 3).join(', ')}.`
    });
  }
  
  // If no specific suggestions, provide generic improvements
  if (suggestions.length === 0) {
    suggestions.push({
      section: 'Overall Enhancement',
      original: 'Current CV content lacks job-specific optimization',
      suggested: `Incorporate these key requirements: ${keywords.slice(0, 4).join(', ')}. Add quantifiable achievements (e.g., "Increased efficiency by 25%", "Managed team of 8 members", "Reduced costs by $50K annually").`,
      reason: 'Your CV needs better alignment with job requirements and more specific, measurable accomplishments to stand out to recruiters.'
    });
  }
  
  return suggestions.slice(0, 4);
};

const identifyCVSections = (cvContent: string) => {
  const sections: any = {};
  const lines = cvContent.split('\n');
  
  let currentSection = '';
  let sectionContent = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    
    if (trimmedLine.includes('summary') || trimmedLine.includes('profile') || trimmedLine.includes('objective')) {
      if (currentSection) sections[currentSection] = sectionContent;
      currentSection = 'summary';
      sectionContent = '';
    } else if (trimmedLine.includes('experience') || trimmedLine.includes('employment') || trimmedLine.includes('work history')) {
      if (currentSection) sections[currentSection] = sectionContent;
      currentSection = 'experience';
      sectionContent = '';
    } else if (trimmedLine.includes('skill') || trimmedLine.includes('competenc') || trimmedLine.includes('technical')) {
      if (currentSection) sections[currentSection] = sectionContent;
      currentSection = 'skills';
      sectionContent = '';
    } else if (trimmedLine.includes('education') || trimmedLine.includes('qualification')) {
      if (currentSection) sections[currentSection] = sectionContent;
      currentSection = 'education';
      sectionContent = '';
    } else {
      sectionContent += line + '\n';
    }
  }
  
  if (currentSection) sections[currentSection] = sectionContent;
  
  return sections;
};

const generateImprovedSummary = (originalSummary: string, keywords: string[], jobDescription: string): string => {
  const roleMatch = jobDescription.match(/(?:seeking|looking for|hiring)\s+(?:a\s+)?([^.]+?)(?:\s+to|\s+who|\s+with|\.)/i);
  const roleTitle = roleMatch ? roleMatch[1].trim() : 'professional';
  
  return `Results-driven ${roleTitle} with proven expertise in ${keywords.slice(0, 3).join(', ')}, delivering measurable business impact through strategic initiatives. Demonstrated track record of achieving 20%+ improvements in operational efficiency while leading cross-functional teams. Combines technical proficiency in ${keywords[3] || 'key technologies'} with strong analytical and communication skills to drive organizational success.`;
};

const enhanceExperienceLine = (originalLine: string, keywords: string[], jobDescription: string): string => {
  const relevantKeyword = keywords.find(k => !originalLine.toLowerCase().includes(k.toLowerCase())) || keywords[0];
  
  if (originalLine.includes('responsible for') || originalLine.includes('worked on')) {
    return originalLine.replace(
      /(responsible for|worked on)/i,
      `Successfully delivered`
    ) + ` utilizing ${relevantKeyword}, resulting in 15% efficiency improvement and enhanced team productivity.`;
  }
  
  return originalLine + ` Leveraged ${relevantKeyword} expertise to achieve 25% improvement in key performance metrics and streamline operational processes.`;
};

const enhanceSkillsSection = (originalSkills: string, missingKeywords: string[]): string => {
  return originalSkills + `\n\nAdditional Competencies: ${missingKeywords.join(' • ')} • Cross-functional collaboration • Process optimization • Data-driven decision making`;
};

export const generateCoverLetter = (
  jobDescription: string, 
  cvContent: string, 
  personalTouch: string = '',
  keywords: string[]
): string => {
  const companyName = extractCompanyName(jobDescription);
  const roleName = extractRoleName(jobDescription);
  const keyRequirements = extractKeyRequirements(jobDescription);
  const candidateStrengths = extractCandidateStrengths(cvContent, keywords);
  
  const opening = `Dear Hiring Manager,

I am writing to express my strong interest in the ${roleName} position at ${companyName}. With my proven background in ${candidateStrengths.slice(0, 2).join(' and ')}, I am excited to contribute to your team's continued success.`;

  const body = `My experience directly aligns with your key requirements:

• ${keyRequirements[0]}: ${candidateStrengths[0]} with demonstrated results including 25%+ efficiency improvements
• ${keyRequirements[1] || 'Technical expertise'}: Proficient in ${keywords.slice(0, 2).join(' and ')}, delivering scalable solutions
• ${keyRequirements[2] || 'Leadership'}: Successfully managed cross-functional teams and complex projects from conception to completion

${personalTouch ? personalTouch + ' This connection deepens my enthusiasm for this opportunity and ' + companyName + "'s mission." : `I am particularly drawn to ${companyName}'s innovative approach and commitment to excellence in the industry.`}`;

  const closing = `I would welcome the opportunity to discuss how my expertise in ${keywords[0]} and proven track record of ${candidateStrengths[0]} can contribute to ${companyName}'s objectives. Thank you for your consideration.

Best regards,
[Your Name]`;

  return `${opening}\n\n${body}\n\n${closing}`;
};

const extractCompanyName = (jobDescription: string): string => {
  // Try multiple patterns to find company name
  const patterns = [
    /(?:at|join|with)\s+([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Company|Ltd|Technologies|Solutions|Group|Systems)?)/i,
    /([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Company|Ltd|Technologies|Solutions|Group|Systems))/i,
    /Company:\s*([A-Z][a-zA-Z\s&]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = jobDescription.match(pattern);
    if (match) return match[1].trim();
  }
  
  return '[Company Name]';
};

const extractRoleName = (jobDescription: string): string => {
  const firstLines = jobDescription.split('\n').slice(0, 3).join(' ');
  const rolePatterns = [
    /(?:position|role|job):\s*([^.\n]+)/i,
    /(?:seeking|hiring|looking for)\s+(?:a\s+)?([^.\n]+?)(?:\s+to|\s+who|\s+with)/i,
    /([A-Za-z\s]+(?:Manager|Director|Analyst|Developer|Engineer|Specialist|Coordinator|Lead|Senior|Junior))/i
  ];
  
  for (const pattern of rolePatterns) {
    const match = firstLines.match(pattern);
    if (match) return match[1].trim();
  }
  
  return '[Position Title]';
};

const extractKeyRequirements = (jobDescription: string): string[] => {
  const requirements = [];
  const jobLower = jobDescription.toLowerCase();
  
  // Look for experience requirements
  const expMatch = jobDescription.match(/(\d+[\+\-\s]*years?[^.\n]*experience[^.\n]*)/i);
  if (expMatch) requirements.push(expMatch[1]);
  
  // Look for education requirements
  if (jobLower.includes('bachelor') || jobLower.includes('degree')) {
    requirements.push('Bachelor\'s degree or equivalent experience');
  }
  
  // Look for technical skills
  const techSkills = ['python', 'javascript', 'sql', 'aws', 'react', 'project management'];
  const foundTech = techSkills.find(skill => jobLower.includes(skill));
  if (foundTech) requirements.push(`${foundTech} proficiency`);
  
  // Default requirements if none found
  if (requirements.length === 0) {
    requirements.push('Relevant industry experience', 'Strong analytical skills', 'Team collaboration');
  }
  
  return requirements.slice(0, 3);
};

const extractCandidateStrengths = (cvContent: string, keywords: string[]): string[] => {
  const strengths = [];
  const cvLower = cvContent.toLowerCase();
  
  // Look for leadership experience
  if (cvLower.includes('manage') || cvLower.includes('lead') || cvLower.includes('supervise')) {
    strengths.push('team leadership and management');
  }
  
  // Look for technical skills
  const techKeywords = keywords.filter(k => 
    ['python', 'javascript', 'sql', 'aws', 'react', 'data', 'analysis'].some(tech => 
      k.toLowerCase().includes(tech)
    )
  );
  if (techKeywords.length > 0) {
    strengths.push(`technical expertise in ${techKeywords[0]}`);
  }
  
  // Look for project experience
  if (cvLower.includes('project') || cvLower.includes('initiative')) {
    strengths.push('project management and execution');
  }
  
  // Default strengths
  if (strengths.length === 0) {
    strengths.push('professional experience', 'analytical problem-solving', 'cross-functional collaboration');
  }
  
  return strengths.slice(0, 3);
};