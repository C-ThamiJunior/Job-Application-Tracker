export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Job {
  id: string;
  userId: string;
  companyName: string;
  role: string;
  status: 'Applied' | 'Interviewed' | 'Rejected';
  dateApplied: string;
  location: string;
  description: string;
  requirements: string;
  contactEmail: string;
  contactPhone: string;
  salary: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface JobContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => Job | undefined;
  searchJobs: (query: string) => Job[];
  filterJobs: (status: string) => Job[];
  sortJobs: (sortBy: 'date' | 'company' | 'role', order: 'asc' | 'desc') => Job[];
}