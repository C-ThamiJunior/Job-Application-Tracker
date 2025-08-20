import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const getStatusConfig = (status: Job['status']) => {
    switch (status) {
      case 'Applied':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4" />
        };
      case 'Interviewed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'Rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />
        };
    }
  };

  const statusConfig = getStatusConfig(job.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
              {job.role}
            </h3>
            <div className="flex items-center text-slate-600 mb-2">
              <Building2 className="w-4 h-4 mr-2" />
              <span className="font-medium">{job.companyName}</span>
            </div>
            {job.location && (
              <div className="flex items-center text-slate-500 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{job.location}</span>
              </div>
            )}
          </div>
          
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
            {statusConfig.icon}
            <span>{job.status}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-slate-500 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Applied on {format(new Date(job.dateApplied), 'MMM dd, yyyy')}</span>
        </div>

        {job.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Link
            to={`/job/${job.id}`}
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(job)}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit job"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;