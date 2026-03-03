import { useState, useEffect, useRef } from 'react';
import {
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUser,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiUploadCloud,
  FiFile,
  FiTrash2,
  FiDownload,
  FiImage,
} from 'react-icons/fi';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';
import { useToast } from '../context/ToastContext';
import { Alert, LoadingSpinner, EmptyState, StatsCard, Button } from '../components/ui';

const MedicalHistory = () => {
  const { toast } = useToast();

  // Main tab: 'history' or 'records'
  const [mainTab, setMainTab] = useState('records');

  // --- APPOINTMENT HISTORY STATE ---
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Expanded cards
  const [expandedId, setExpandedId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- MEDICAL RECORDS STATE ---
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAppointments();
    fetchRecords();
  }, []);

  // --- APPOINTMENT HISTORY LOGIC ---

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/appointments/my-appointments');
      const historyStatuses = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];
      const history = response.data.filter((apt) =>
        historyStatuses.includes(apt.status)
      );
      setAppointments(history);
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to load your medical history. Please refresh the page.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
    cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
    noShow: appointments.filter((a) => a.status === 'NO_SHOW').length,
  };

  // Filter and sort
  const getFilteredAppointments = () => {
    let filtered = [...appointments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.doctorName?.toLowerCase().includes(search) ||
          apt.departmentName?.toLowerCase().includes(search) ||
          apt.specialty?.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate + 'T' + a.startTime);
      const dateB = new Date(b.appointmentDate + 'T' + b.startTime);
      return sortBy === 'date-asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, sortBy]);

  // Format helpers
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusConfig = (status) => {
    const config = {
      COMPLETED: {
        bg: 'bg-success-100',
        text: 'text-success-700',
        icon: FiCheckCircle,
        label: 'Completed',
      },
      CANCELLED: {
        bg: 'bg-error-100',
        text: 'text-error-700',
        icon: FiXCircle,
        label: 'Cancelled',
      },
      NO_SHOW: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        icon: FiAlertCircle,
        label: 'No Show',
      },
    };
    return config[status] || config.COMPLETED;
  };

  const historyTabs = [
    { value: 'all', label: 'All History', count: stats.total },
    { value: 'COMPLETED', label: 'Completed', count: stats.completed },
    { value: 'CANCELLED', label: 'Cancelled', count: stats.cancelled },
    { value: 'NO_SHOW', label: 'No Show', count: stats.noShow },
  ];

  // --- MEDICAL RECORDS LOGIC ---

  const fetchRecords = async () => {
    setRecordsLoading(true);
    setRecordsError(null);
    try {
      const response = await api.get('/medical-records');
      setRecords(response.data);
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to load your medical records.');
      setRecordsError(message);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPEG, and PNG files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (uploadDescription.trim()) {
        formData.append('description', uploadDescription.trim());
      }

      const response = await api.post('/medical-records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60 seconds — Gemini AI text extraction takes time
      });

      const hasExtractedText = response.data?.extractedText;
      toast.success(hasExtractedText
        ? 'File uploaded and text extracted successfully!'
        : 'File uploaded successfully!'
      );
      setSelectedFile(null);
      setUploadDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchRecords();
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to upload file. Please try again.');
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (record) => {
    try {
      const response = await api.get(`/medical-records/${record.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', record.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download file.');
    }
  };

  const handleDeleteConfirm = async (recordId) => {
    setDeletingId(recordId);
    setConfirmDeleteId(null);
    try {
      await api.delete(`/medical-records/${recordId}`);
      toast.success('Record deleted successfully.');
      fetchRecords();
    } catch (err) {
      toast.error('Failed to delete record.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType) => {
    if (fileType && fileType.startsWith('image/')) {
      return FiImage;
    }
    return FiFile;
  };

  const formatRecordDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- RENDER ---

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Medical History</h1>
        <p className="text-gray-600 mt-1">View your past appointments and upload medical records</p>
      </div>

      {/* Main Tabs: Records vs History */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setMainTab('records')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            mainTab === 'records'
              ? 'bg-white text-primary-600 shadow-soft'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FiUploadCloud className="h-4 w-4" />
          My Records
          {records.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              mainTab === 'records' ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'
            }`}>
              {records.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setMainTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            mainTab === 'history'
              ? 'bg-white text-primary-600 shadow-soft'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FiActivity className="h-4 w-4" />
          Appointment History
          {stats.total > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              mainTab === 'history' ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'
            }`}>
              {stats.total}
            </span>
          )}
        </button>
      </div>

      {/* --- MEDICAL RECORDS TAB --- */}
      {mainTab === 'records' && (
        <div>
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Medical Record</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload prescriptions, lab reports, discharge summaries, or any medical documents (PDF, JPEG, PNG — max 5MB)
            </p>

            <div className="space-y-4">
              {/* File Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  selectedFile
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <FiFile className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="ml-2 text-gray-400 hover:text-error-500 transition-colors"
                    >
                      <FiXCircle className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Click to select a file</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPEG, or PNG up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="e.g., Blood test results from January 2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  maxLength={500}
                />
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full sm:w-auto"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="small" />
                    Uploading & Extracting Text...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiUploadCloud className="h-4 w-4" />
                    Upload Record
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Records Error */}
          {recordsError && (
            <Alert type="error" message={recordsError} onClose={() => setRecordsError(null)} className="mb-6" />
          )}

          {/* Records List */}
          {recordsLoading ? (
            <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-soft">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-500">Loading your records...</p>
            </div>
          ) : records.length > 0 ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {records.length} record{records.length !== 1 ? 's' : ''} uploaded
              </p>
              <div className="space-y-4">
                {records.map((record) => {
                  const FileIcon = getFileIcon(record.fileType);
                  const isRecordExpanded = expandedRecordId === record.id;
                  return (
                    <div
                      key={record.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden hover:shadow-soft-md transition-all duration-200"
                    >
                      {/* Main Row */}
                      <div className="p-4 flex items-center gap-4">
                        {/* File Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          record.fileType?.startsWith('image/')
                            ? 'bg-purple-50 border border-purple-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <FileIcon className={`h-6 w-6 ${
                            record.fileType?.startsWith('image/') ? 'text-purple-500' : 'text-red-500'
                          }`} />
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {record.fileName}
                          </h4>
                          {record.description && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{record.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>{formatFileSize(record.fileSize)}</span>
                            <span>{formatRecordDate(record.uploadedAt)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {record.extractedText && (
                            <button
                              onClick={() => setExpandedRecordId(isRecordExpanded ? null : record.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                isRecordExpanded
                                  ? 'text-primary-600 bg-primary-50'
                                  : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
                              }`}
                              title={isRecordExpanded ? 'Hide extracted text' : 'Show extracted text'}
                            >
                              {isRecordExpanded ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(record)}
                            className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Download"
                          >
                            <FiDownload className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(record.id)}
                            disabled={deletingId === record.id}
                            className="p-2 rounded-lg text-gray-500 hover:text-error-600 hover:bg-error-50 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === record.id ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <FiTrash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirmation */}
                      {confirmDeleteId === record.id && (
                        <div className="px-4 pb-3">
                          <div className="bg-error-50 border border-error-200 rounded-xl p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                              <FiAlertCircle className="h-5 w-5 text-error-500 flex-shrink-0" />
                              <p className="text-sm text-error-700 font-medium">
                                Are you sure you want to delete this record? This cannot be undone.
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(record.id)}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-error-600 rounded-lg hover:bg-error-700 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* AI Extracted Text Badge — always visible if text exists */}
                      {record.extractedText && (
                        <div className="px-4 pb-2">
                          <button
                            onClick={() => setExpandedRecordId(isRecordExpanded ? null : record.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors"
                          >
                            <FiFileText className="h-3.5 w-3.5" />
                            AI-Extracted Text Available
                            {isRecordExpanded ? <FiChevronUp className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />}
                          </button>
                        </div>
                      )}

                      {/* Extracted Text Content */}
                      {isRecordExpanded && record.extractedText && (
                        <div className="px-4 pb-4 pt-2">
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                              <div className="bg-primary-100 p-1.5 rounded-lg">
                                <FiFileText className="h-4 w-4 text-primary-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Extracted Text</p>
                                <p className="text-xs text-gray-500">Powered by Google Gemini AI</p>
                              </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {record.extractedText}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-soft">
              <EmptyState
                icon={FiFileText}
                title="No medical records uploaded"
                description="Upload your prescriptions, lab reports, or discharge summaries to keep them organized."
              />
            </div>
          )}
        </div>
      )}

      {/* --- APPOINTMENT HISTORY TAB --- */}
      {mainTab === 'history' && (
        <div>
          {/* Error Alert */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard icon={FiActivity} label="Total Visits" value={stats.total} color="blue" loading={loading} />
            <StatsCard icon={FiCheckCircle} label="Completed" value={stats.completed} color="green" loading={loading} />
            <StatsCard icon={FiXCircle} label="Cancelled" value={stats.cancelled} color="red" loading={loading} />
            <StatsCard icon={FiAlertCircle} label="No Show" value={stats.noShow} color="yellow" loading={loading} />
          </div>

          {/* Tab Filters */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
            {historyTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === tab.value
                    ? 'bg-white text-primary-600 shadow-soft'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    statusFilter === tab.value
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Sort Bar */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <p className="text-sm text-gray-500 mb-4">
              Showing {paginatedAppointments.length} of {filteredAppointments.length} records
            </p>
          )}

          {/* Appointment List */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-soft">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-500">Loading your medical history...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <>
              <div className="space-y-3">
                {paginatedAppointments.map((appointment) => {
                  const statusConfig = getStatusConfig(appointment.status);
                  const StatusIcon = statusConfig.icon;
                  const isExpanded = expandedId === appointment.id;

                  return (
                    <div
                      key={appointment.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden transition-all duration-200 hover:shadow-soft-md"
                    >
                      {/* Main Row */}
                      <div
                        className="flex items-center p-4 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : appointment.id)}
                      >
                        {/* Date Badge */}
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex flex-col items-center justify-center mr-4 border border-primary-200">
                          <span className="text-lg font-bold text-primary-600">
                            {new Date(appointment.appointmentDate + 'T00:00:00').getDate()}
                          </span>
                          <span className="text-xs text-primary-500 uppercase">
                            {new Date(appointment.appointmentDate + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              Dr. {appointment.doctorName}
                            </h4>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text} flex-shrink-0 ml-2`}>
                              <StatusIcon className="inline h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 space-x-3">
                            <span className="flex items-center">
                              <FiClock className="h-3 w-3 mr-1" />
                              {formatTime(appointment.startTime)}
                              {appointment.endTime && ` - ${formatTime(appointment.endTime)}`}
                            </span>
                            {appointment.departmentName && (
                              <span className="flex items-center">
                                <FiMapPin className="h-3 w-3 mr-1" />
                                {appointment.departmentName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expand Toggle */}
                        <div className="ml-3 text-gray-400">
                          {isExpanded ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Visit Details */}
                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Visit Details</p>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <FiUser className="h-4 w-4 mr-2 text-gray-400" />
                                  Dr. {appointment.doctorName}
                                </div>
                                {appointment.specialty && (
                                  <div className="flex items-center text-gray-600">
                                    <FiActivity className="h-4 w-4 mr-2 text-gray-400" />
                                    {appointment.specialty}
                                  </div>
                                )}
                                <div className="flex items-center text-gray-600">
                                  <FiClock className="h-4 w-4 mr-2 text-gray-400" />
                                  {formatDate(appointment.appointmentDate)}, {formatTime(appointment.startTime)}
                                </div>
                                {appointment.departmentName && (
                                  <div className="flex items-center text-gray-600">
                                    <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
                                    {appointment.departmentName}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Notes */}
                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                              <div className="space-y-3">
                                {appointment.doctorNotes && (
                                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                    <p className="text-xs font-medium text-blue-700 mb-1 flex items-center">
                                      <FiFileText className="h-3 w-3 mr-1" />
                                      Doctor Notes
                                    </p>
                                    <p className="text-sm text-blue-800">{appointment.doctorNotes}</p>
                                  </div>
                                )}
                                {appointment.patientNotes && (
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <p className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                                      <FiFileText className="h-3 w-3 mr-1" />
                                      Your Notes
                                    </p>
                                    <p className="text-sm text-gray-700">{appointment.patientNotes}</p>
                                  </div>
                                )}
                                {appointment.cancellationReason && (
                                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                    <p className="text-xs font-medium text-red-700 mb-1 flex items-center">
                                      <FiXCircle className="h-3 w-3 mr-1" />
                                      Cancellation Reason
                                    </p>
                                    <p className="text-sm text-red-800">{appointment.cancellationReason}</p>
                                  </div>
                                )}
                                {!appointment.doctorNotes && !appointment.patientNotes && !appointment.cancellationReason && (
                                  <p className="text-sm text-gray-400 italic">No notes available</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-gray-100 shadow-soft px-4 py-3">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white shadow-primary-sm'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-soft">
              <EmptyState
                icon={FiActivity}
                title="No medical history found"
                description={
                  searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters to find records.'
                    : "You don't have any past appointments yet."
                }
                actionLabel={searchTerm || statusFilter !== 'all' ? 'Clear Filters' : undefined}
                onAction={
                  searchTerm || statusFilter !== 'all'
                    ? () => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }
                    : undefined
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
