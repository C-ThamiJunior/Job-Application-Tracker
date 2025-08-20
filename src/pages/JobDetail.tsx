import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  FileText,
  ClipboardList,
  StickyNote,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById, deleteJob } = useJobs();

  const job = id ? getJobById(id) : undefined;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Not Found</h2>
          <p className="text-slate-600 mb-6">The job application you're looking for doesn't exist.</p>
          <Link
            to="/home"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: typeof job.status) => {
    switch (status) {
      case 'Applied':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-5 h-5" />
        };
      case 'Interviewed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-5 h-5" />
        };
      case 'Rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-5 h-5" />
        };
    }
  };

  const statusConfig = getStatusConfig(job.status);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      deleteJob(job.id);
      navigate('/home');
    }
  };

  const DetailCard = ({ icon, title, content, className = "" }: {
    icon: React.ReactNode;
    title: string;
    content: string;
    className?: string;
  }) => (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{content || 'Not specified'}</p>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{job.role}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-slate-600">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">{job.companyName}</span>
                </div>
                {job.location && (
                  <div className="flex items-center text-slate-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-medium border ${statusConfig.color}`}>
              {statusConfig.icon}
              <span>{job.status}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/home?edit=${job.id}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Application</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Application Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Date Applied</p>
                  <p className="text-slate-900">{format(new Date(job.dateApplied), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
              
              {job.salary && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Salary Range</p>
                    <p className="text-slate-900">{job.salary}</p>
                  </div>
                </div>
              )}

              {job.contactEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Contact Email</p>
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {job.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {job.contactPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Contact Phone</p>
                    <a
                      href={`tel:${job.contactPhone}`}
                      className="text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {job.contactPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-1">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Application Submitted</p>
                  <p className="text-sm text-slate-500">{format(new Date(job.dateApplied), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              
              {job.createdAt !== job.updatedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mt-1">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Last Updated</p>
                    <p className="text-sm text-slate-500">{format(new Date(job.updatedAt), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="space-y-6">
          {job.description && (
            <DetailCard
              icon={<FileText className="w-5 h-5" />}
              title="Job Description"
              content={job.description}
            />
          )}

          {job.requirements && (
            <DetailCard
              icon={<ClipboardList className="w-5 h-5" />}
              title="Requirements"
              content={job.requirements}
            />
          )}

          {job.notes && (
            <DetailCard
              icon={<StickyNote className="w-5 h-5" />}
              title="Notes"
              content={job.notes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;