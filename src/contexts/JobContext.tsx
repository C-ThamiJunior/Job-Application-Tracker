import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobContextType } from '../types';
import { useAuth } from './AuthContext';
import { v4 } from '../utils/uuid';

const JobContext = createContext<JobContextType | undefined>(undefined);

const JOBS_KEY = 'job_tracker_jobs';

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = () => {
    const savedJobs = localStorage.getItem(JOBS_KEY);
    if (savedJobs && user) {
      const allJobs: Job[] = JSON.parse(savedJobs);
      const userJobs = allJobs.filter(job => job.userId === user.id);
      setJobs(userJobs);
    }
  };

  const saveJobs = (updatedJobs: Job[]) => {
    const savedJobs = localStorage.getItem(JOBS_KEY);
    const allJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : [];
    
    // Remove current user's jobs and add updated ones
    const otherUserJobs = allJobs.filter(job => job.userId !== user?.id);
    const newAllJobs = [...otherUserJobs, ...updatedJobs];
    
    localStorage.setItem(JOBS_KEY, JSON.stringify(newAllJobs));
    setJobs(updatedJobs);
  };

  const addJob = (jobData: Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    const newJob: Job = {
      ...jobData,
      id: v4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedJobs = [...jobs, newJob];
    saveJobs(updatedJobs);
  };

  const updateJob = (id: string, jobData: Partial<Job>) => {
    const updatedJobs = jobs.map(job => 
      job.id === id 
        ? { ...job, ...jobData, updatedAt: new Date().toISOString() }
        : job
    );
    saveJobs(updatedJobs);
  };

  const deleteJob = (id: string) => {
    const updatedJobs = jobs.filter(job => job.id !== id);
    saveJobs(updatedJobs);
  };

  const getJobById = (id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
  };

  const searchJobs = (query: string): Job[] => {
    return jobs.filter(job => 
      job.companyName.toLowerCase().includes(query.toLowerCase()) ||
      job.role.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterJobs = (status: string): Job[] => {
    if (status === 'all') return jobs;
    return jobs.filter(job => job.status === status);
  };

  const sortJobs = (sortBy: 'date' | 'company' | 'role', order: 'asc' | 'desc'): Job[] => {
    const sorted = [...jobs].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.dateApplied);
          bValue = new Date(b.dateApplied);
          break;
        case 'company':
          aValue = a.companyName.toLowerCase();
          bValue = b.companyName.toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  return (
    <JobContext.Provider value={{
      jobs,
      addJob,
      updateJob,
      deleteJob,
      getJobById,
      searchJobs,
      filterJobs,
      sortJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};