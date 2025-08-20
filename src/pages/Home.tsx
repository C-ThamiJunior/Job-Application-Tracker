import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  Calendar
} from 'lucide-react';

const Home: React.FC = () => {
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') as 'date' | 'company' | 'role' || 'date');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc');

  // Update URL params when filters change
  const updateUrlParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Filter and sort jobs based on current state
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
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

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter(job => job.status === 'Applied').length;
    const interviewed = jobs.filter(job => job.status === 'Interviewed').length;
    const rejected = jobs.filter(job => job.status === 'Rejected').length;
    
    return { total, applied, interviewed, rejected };
  }, [jobs]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateUrlParams({ search: value, status: statusFilter, sortBy, sortOrder });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    updateUrlParams({ search: searchTerm, status, sortBy, sortOrder });
  };

  const handleSortChange = (newSortBy: 'date' | 'company' | 'role') => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    updateUrlParams({ search: searchTerm, status: statusFilter, sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const handleAddJob = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (editingJob) {
      updateJob(editingJob.id, jobData);
    } else {
      addJob(jobData);
    }
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      deleteJob(id);
    }
  };

  const StatCard = ({ title, value, icon, color, bgColor }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }) => (
    <div className={`${bgColor} rounded-xl p-6 border border-opacity-20`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${color} opacity-80`}>{title}</p>
          <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
        </div>
        <div className={`p-3 ${color} bg-opacity-20 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Welcome back, <span className="text-blue-600">{user?.username}</span>!
          </h1>
          <p className="text-slate-600">Track your job applications and stay organized in your career journey.</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={<Briefcase className="w-6 h-6" />}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Applied"
            value={stats.applied}
            icon={<Clock className="w-6 h-6" />}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatCard
            title="Interviewed"
            value={stats.interviewed}
            icon={<CheckCircle className="w-6 h-6" />}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<XCircle className="w-6 h-6" />}
            color="text-red-600"
            bgColor="bg-red-50"
          />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by company or role..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="text-slate-500 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-1 border border-slate-300 rounded-lg">
                <button
                  onClick={() => handleSortChange('date')}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                    sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('company')}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                    sortBy === 'company' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Company</span>
                  {sortBy === 'company' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('role')}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                    sortBy === 'role' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Role</span>
                  {sortBy === 'role' && (
                    sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Add Job Button */}
              <button
                onClick={handleAddJob}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Job</span>
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div>
          {filteredAndSortedJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No jobs found' : 'No job applications yet'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start tracking your job applications by adding your first one.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <button
                  onClick={handleAddJob}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Job</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          )}
        </div>

        {/* Job Modal */}
        <JobModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveJob}
          job={editingJob}
        />
      </div>
    </div>
  );
};

export default Home;