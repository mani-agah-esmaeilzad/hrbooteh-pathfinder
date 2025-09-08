import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  path: string;
  status: 'completed' | 'current' | 'locked';
}

interface AssessmentContextType {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  updateAssessmentStatus: (id: string, status: Assessment['status']) => void;
  getCurrentAssessmentIndex: () => number;
  getNextAssessment: () => Assessment | null;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const initialAssessments: Assessment[] = [
  {
    id: 'independence',
    title: 'ارزیابی استقلال',
    description: 'ارزیابی میزان استقلال و خودکفایی شما در محیط کار',
    path: '/assessment/independence',
    status: 'current'
  },
  {
    id: 'confidence',
    title: 'ارزیابی اعتماد به نفس',
    description: 'بررسی سطح اعتماد به نفس و اعتماد در تصمیم‌گیری‌ها',
    path: '/assessment/confidence',
    status: 'locked'
  },
  {
    id: 'negotiation',
    title: 'ارزیابی مهارت‌های مذاکره',
    description: 'ارزیابی توانایی‌های مذاکره و ارتباطات موثر',
    path: '/assessment/negotiation',
    status: 'locked'
  },
  {
    id: 'leadership',
    title: 'ارزیابی مهارت‌های رهبری',
    description: 'بررسی قابلیت‌های رهبری و مدیریت تیم',
    path: '/assessment/leadership',
    status: 'locked'
  },
  {
    id: 'communication',
    title: 'ارزیابی مهارت‌های ارتباطی',
    description: 'ارزیابی مهارت‌های ارتباط مؤثر و کار تیمی',
    path: '/assessment/communication',
    status: 'locked'
  },
];

export const AssessmentProvider = ({ children }: { children: ReactNode }) => {
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);

  const updateAssessmentStatus = (id: string, status: Assessment['status']) => {
    setAssessments(prev => {
      const newAssessments = prev.map(assessment => 
        assessment.id === id ? { ...assessment, status } : assessment
      );
      
      // If an assessment is completed, unlock the next one
      if (status === 'completed') {
        const currentIndex = newAssessments.findIndex(a => a.id === id);
        if (currentIndex < newAssessments.length - 1) {
          newAssessments[currentIndex + 1].status = 'current';
        }
      }
      
      return newAssessments;
    });
  };

  const getCurrentAssessmentIndex = () => {
    return assessments.findIndex(a => a.status === 'current');
  };

  const getNextAssessment = () => {
    const currentIndex = getCurrentAssessmentIndex();
    return currentIndex < assessments.length - 1 ? assessments[currentIndex + 1] : null;
  };

  const currentAssessment = assessments.find(a => a.status === 'current') || null;

  return (
    <AssessmentContext.Provider value={{
      assessments,
      currentAssessment,
      updateAssessmentStatus,
      getCurrentAssessmentIndex,
      getNextAssessment
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};