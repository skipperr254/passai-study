'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Upload,
  FileText,
  Video,
  Book,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  File,
  Image as ImageIcon,
  Trash2,
  ChevronDown,
  Filter,
  Search,
  FolderOpen,
  Calendar,
  Download,
  Eye,
  MoreVertical,
  Sparkles,
  Info,
  Zap,
  FileCheck,
  BookOpen,
  PenTool,
  GraduationCap,
  ClipboardCheck,
  Edit3,
  Tag,
  AlertTriangle,
  Camera,
  Clock,
  RotateCw,
} from 'lucide-react';
import { useAuth } from '../common/AuthContext';
import { useSubjects } from '@/hooks/useSubjects';
import { useMaterials } from '@/hooks/useMaterials';
import { useMaterialUpload } from '@/hooks/useMaterialUpload';
import { formatFileSize } from '@/lib/upload.utils';
import { MaterialPreviewModal } from '../generated/MaterialPreviewModal'; // TODO - stop using generated components. Import from somewhere else
import type { Subject } from '@/types/subject';
import type { Material } from '@/types/material';

const UPLOAD_LIMITS = {
  maxFiles: 10,
  maxSizePerFile: 50 * 1024 * 1024, // 50MB in bytes
  maxTotalSize: 200 * 1024 * 1024, // 200MB in bytes
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/heic',
    'video/mp4',
    'video/quicktime',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/markdown',
  ],
};
const uploadTips = [
  {
    icon: FileText,
    text: 'Class notes (handwritten or typed)',
  },
  {
    icon: BookOpen,
    text: 'Textbook pages/chapters',
  },
  {
    icon: FileCheck,
    text: 'Lecture slides',
  },
  {
    icon: GraduationCap,
    text: "Teacher's study guide",
  },
  {
    icon: ClipboardCheck,
    text: 'Past quizzes/tests',
  },
  {
    icon: PenTool,
    text: 'Your own study materials',
  },
];

type MaterialsPageProps = {
  preSelectedSubjectId?: string;
};

export const MaterialsPage = ({ preSelectedSubjectId }: MaterialsPageProps) => {
  // Navigation & Auth Hooks
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const {
    materials,
    loading: materialsLoading,
    fetchMaterials,
    removeMaterial,
    downloadMaterial,
    getMaterialUrl,
  } = useMaterials(); // No subjectId = fetch all materials
  const {
    uploads,
    isUploading,
    uploadFiles,
    removeUpload,
    clearUploads,
    stats: uploadStats,
  } = useMaterialUpload(user?.id || '');

  // UI State
  const [uploadSubject, setUploadSubject] = useState<Subject | null>(
    preSelectedSubjectId ? subjects.find(s => s.id === preSelectedSubjectId) || null : null
  );
  const [filterSubject, setFilterSubject] = useState<Subject | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [showSubjectSelector, setShowSubjectSelector] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Update upload subject when pre-selected subject changes
  useEffect(() => {
    if (preSelectedSubjectId && subjects.length > 0) {
      const subject = subjects.find(s => s.id === preSelectedSubjectId);
      if (subject) {
        setUploadSubject(subject);
      }
    }
  }, [preSelectedSubjectId, subjects]);

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSubject = !filterSubject || material.subjectId === filterSubject.id;
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: filteredMaterials.length,
    totalSize: filteredMaterials.reduce((acc, m) => acc + m.fileSize, 0),
    processing: uploadStats.uploading + uploadStats.extracting,
    pending: uploadStats.pending,
  };
  const handleOpenUpload = () => {
    if (!uploadSubject) {
      setShowSubjectSelector(true);
    } else {
      setShowUploadZone(true);
    }
  };

  const handleSubjectSelected = (subject: Subject) => {
    setUploadSubject(subject);
    setShowSubjectSelector(false);
    setShowUploadZone(true);
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || isUploading || !uploadSubject || !user) return;

    const fileArray = Array.from(files);

    // Validate file count
    if (fileArray.length > UPLOAD_LIMITS.maxFiles) {
      toast.error(`You can only upload up to ${UPLOAD_LIMITS.maxFiles} files at once.`);
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      if (!UPLOAD_LIMITS.allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: File type not supported`);
        return;
      }
      if (file.size > UPLOAD_LIMITS.maxSizePerFile) {
        errors.push(
          `${file.name}: File size exceeds ${formatFileSize(UPLOAD_LIMITS.maxSizePerFile)}`
        );
        return;
      }
      validFiles.push(file);
    });

    // Check total size
    const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > UPLOAD_LIMITS.maxTotalSize) {
      toast.error(`Total upload size exceeds ${formatFileSize(UPLOAD_LIMITS.maxTotalSize)} limit`);
      return;
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      // Start upload immediately with backend
      setShowUploadZone(false);
      toast.success(`Uploading ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}...`);
      await uploadFiles(uploadSubject.id, validFiles);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!user) return;

    if (confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      try {
        await removeMaterial(materialId);
        toast.success('Material deleted successfully');
      } catch (error) {
        console.error('Error deleting material:', error);
        toast.error('Failed to delete material. Please try again.');
      }
    }
  };

  const handlePreviewMaterial = async (material: Material) => {
    setPreviewMaterial(material);

    // Get the file URL from Supabase storage
    try {
      const url = await getMaterialUrl(material);
      setPreviewFileUrl(url);
    } catch (error) {
      console.error('Error getting file URL:', error);
      setPreviewFileUrl(null);
    }
  };

  const handleClosePreview = () => {
    setPreviewMaterial(null);
    setPreviewFileUrl(null);
  };

  const handleDownloadPreview = async () => {
    if (!previewMaterial) return;

    try {
      // Use downloadMaterial for actual download (triggers browser download)
      await downloadMaterial(previewMaterial);
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading material:', error);
      toast.error('Failed to download material. Please try again.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading && uploadSubject) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isUploading && uploadSubject) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const getMaterialIcon = (type: Material['fileType']) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'video':
        return Video;
      case 'image':
        return ImageIcon;
      case 'document':
      case 'presentation':
        return File;
      case 'text':
        return Book;
      default:
        return File;
    }
  };

  const getMaterialColor = (type: Material['fileType']) => {
    switch (type) {
      case 'pdf':
        return 'from-red-500 to-pink-600';
      case 'video':
        return 'from-purple-500 to-indigo-600';
      case 'image':
        return 'from-blue-500 to-cyan-600';
      case 'document':
        return 'from-green-500 to-emerald-600';
      case 'presentation':
        return 'from-orange-500 to-amber-600';
      case 'text':
        return 'from-slate-500 to-slate-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return FileText;
    if (file.type.includes('video')) return Video;
    if (file.type.includes('image')) return ImageIcon;
    if (file.type.includes('presentation') || file.type.includes('powerpoint')) return File;
    if (file.type.includes('document') || file.type.includes('word')) return File;
    if (file.type.includes('text')) return Book;
    return File;
  };

  const getFileColor = (file: File) => {
    if (file.type.includes('pdf')) return 'from-red-500 to-pink-600';
    if (file.type.includes('video')) return 'from-purple-500 to-indigo-600';
    if (file.type.includes('image')) return 'from-blue-500 to-cyan-600';
    if (file.type.includes('presentation') || file.type.includes('powerpoint'))
      return 'from-orange-500 to-amber-600';
    if (file.type.includes('document') || file.type.includes('word'))
      return 'from-green-500 to-emerald-600';
    return 'from-slate-500 to-slate-600';
  };

  const getSubjectById = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  // Check if device has camera (mobile detection)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Loading state
  if (subjectsLoading || materialsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  // No subjects state
  if (subjects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No subjects yet</h3>
          <p className="text-slate-600 mb-6">Create a subject first before uploading materials</p>
          <button
            onClick={() => navigate('/app/subjects')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Subject
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
                Study Materials
              </h1>
              <p className="text-sm lg:text-base text-slate-600">
                Upload and manage your learning resources
              </p>
            </div>
            <button
              onClick={handleOpenUpload}
              disabled={isUploading}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span>Upload Materials</span>
            </button>
          </div>

          {/* Current Upload Subject Banner (if selected) */}
          {uploadSubject && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${uploadSubject.color} flex items-center justify-center shadow-sm`}
                  >
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-600 mb-0.5">UPLOADING FOR</p>
                    <p className="text-sm font-bold text-slate-900">{uploadSubject.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!isUploading) {
                      setUploadSubject(null);
                      setShowSubjectSelector(true);
                    }
                  }}
                  disabled={isUploading}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Subject Filter & Search */}
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            {/* Subject Filter - Desktop */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${filterSubject ? `bg-gradient-to-r ${filterSubject.color} text-white shadow-md hover:shadow-lg` : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
              >
                <Book className="w-5 h-5" />
                <span className="font-semibold">{filterSubject?.name || 'All Subjects'}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isSubjectDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-xl z-10">
                  <button
                    onClick={() => {
                      setFilterSubject(null);
                      setIsSubjectDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors first:rounded-t-xl ${!filterSubject ? 'bg-blue-50' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <Book className="w-5 h-5 text-white" />
                    </div>
                    <span className="flex-1 text-left font-semibold text-slate-900">
                      All Subjects
                    </span>
                    {!filterSubject && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </button>
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setFilterSubject(subject);
                        setIsSubjectDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors last:rounded-b-xl ${filterSubject?.id === subject.id ? 'bg-blue-50' : ''}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`}
                      >
                        <Book className="w-5 h-5 text-white" />
                      </div>
                      <span className="flex-1 text-left font-semibold text-slate-900">
                        {subject.name}
                      </span>
                      {filterSubject?.id === subject.id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Subject Scroll */}
            <div className="lg:hidden -mx-4 px-4 overflow-x-auto hide-scrollbar">
              <div className="flex gap-2 pb-1">
                <button
                  onClick={() => setFilterSubject(null)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${!filterSubject ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md' : 'bg-white border-2 border-slate-200 text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    <span className="text-sm font-semibold whitespace-nowrap">All</span>
                  </div>
                </button>
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => setFilterSubject(subject)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${filterSubject?.id === subject.id ? `bg-gradient-to-r ${subject.color} text-white shadow-md` : 'bg-white border-2 border-slate-200 text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {subject.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Total Materials</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">Storage Used</p>
              <p className="text-xl lg:text-3xl font-bold text-blue-600">
                {formatFileSize(stats.totalSize)}
              </p>
            </div>
            <div
              className={`rounded-xl p-3 lg:p-4 text-white ${isUploading ? 'bg-gradient-to-br from-amber-500 to-orange-600 animate-pulse' : stats.pending > 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`}
            >
              <p className="text-xs lg:text-sm font-medium mb-1 text-white/90">
                {isUploading ? 'Uploading' : 'Queued'}
              </p>
              <p className="text-xl lg:text-3xl font-bold">
                {isUploading ? stats.processing : uploadStats.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Processing Warning Banner */}
          {isUploading && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 lg:p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-amber-900 mb-1">
                    Uploading & Processing Materials
                  </h3>
                  <p className="text-sm text-amber-800">
                    Please do not close or exit the app until all materials are uploaded and
                    processed.
                    {uploadStats.total > 0 &&
                      ` ${uploadStats.uploading + uploadStats.extracting} of ${uploadStats.total} file${uploadStats.total > 1 ? 's' : ''} remaining.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Tips Banner */}
          {materials.length === 0 && uploads.size === 0 && !isUploading && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 lg:p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    What materials should you upload?
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Upload any study materials to help PassAI create personalized quizzes:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {uploadTips.map((tip, idx) => {
                      const Icon = tip.icon;
                      return (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <Icon className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          <span className="font-medium">{tip.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-900 mb-1">Pro tip:</p>
                      <p className="text-sm text-amber-800">
                        Upload the teacher's emphasis! If your teacher said "This will definitely be
                        on the test," add a note about it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress Section */}
          {uploads.size > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base lg:text-lg font-bold text-slate-900 flex items-center gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      Uploading {uploadStats.uploading + uploadStats.extracting} of{' '}
                      {uploadStats.total} file{uploadStats.total > 1 ? 's' : ''}...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      {uploadStats.completed} file{uploadStats.completed > 1 ? 's' : ''} uploaded
                    </>
                  )}
                </h3>
                {!isUploading && uploadStats.total > 0 && (
                  <button
                    onClick={clearUploads}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Array.from(uploads.entries()).map(([fileId, upload]) => {
                  const Icon = getFileIcon(upload.file);
                  const subject = getSubjectById(uploadSubject?.id || '');
                  const statusConfig = {
                    pending: { color: 'bg-slate-100', text: 'text-slate-600', icon: Clock },
                    uploading: { color: 'bg-blue-100', text: 'text-blue-600', icon: Loader2 },
                    extracting: { color: 'bg-purple-100', text: 'text-purple-600', icon: Loader2 },
                    completed: {
                      color: 'bg-green-100',
                      text: 'text-green-600',
                      icon: CheckCircle2,
                    },
                    error: { color: 'bg-red-100', text: 'text-red-600', icon: AlertCircle },
                  };
                  const config = statusConfig[upload.status];
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={fileId}
                      className="bg-white border-2 border-slate-200 rounded-xl p-3 lg:p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getFileColor(upload.file)} flex items-center justify-center flex-shrink-0 shadow-sm`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate text-sm lg:text-base">
                            {upload.file.name}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {subject && (
                              <div
                                className={`px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r ${subject.color} text-white`}
                              >
                                {subject.name}
                              </div>
                            )}
                            <span className="text-xs text-slate-600">
                              {formatFileSize(upload.file.size)}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${config.color}`}
                        >
                          <StatusIcon
                            className={`w-4 h-4 ${config.text} ${upload.status === 'uploading' || upload.status === 'extracting' ? 'animate-spin' : ''}`}
                          />
                          <span className={`text-xs font-semibold ${config.text} capitalize`}>
                            {upload.status}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {(upload.status === 'uploading' ||
                        upload.status === 'extracting' ||
                        upload.status === 'pending') && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-600">
                              {upload.statusMessage}
                            </span>
                            <span className="font-bold text-slate-900">
                              {Math.round(upload.progress)}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Error Message with Retry Button */}
                      {upload.error && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs text-red-600 mb-2">{upload.error}</p>
                              <button
                                onClick={async () => {
                                  if (!uploadSubject) return;
                                  // Remove the failed upload
                                  removeUpload(fileId);
                                  // Retry the upload
                                  toast.loading(`Retrying ${upload.file.name}...`);
                                  await uploadFiles(uploadSubject.id, [upload.file]);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                <RotateCw className="w-3 h-3" />
                                Retry Upload
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Success Message */}
                      {upload.status === 'completed' && upload.result && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            Uploaded & processed
                            {upload.result.extractedTextLength &&
                              ` • ${upload.result.extractedTextLength} characters extracted`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Materials Grid */}
          {filteredMaterials.length === 0 && uploads.size === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No materials yet</h3>
              <p className="text-slate-600 mb-6">
                {filterSubject
                  ? `Upload materials for ${filterSubject.name}`
                  : 'Start by uploading your study materials'}
              </p>
              <button
                onClick={handleOpenUpload}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                Upload Materials
              </button>
            </div>
          ) : filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMaterials.map(material => {
                const Icon = getMaterialIcon(material.fileType);
                const subject = getSubjectById(material.subjectId);

                return (
                  <div
                    key={material.id}
                    className="bg-white rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-4 lg:p-5 transition-all hover:shadow-lg group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getMaterialColor(material.fileType)} flex items-center justify-center flex-shrink-0 shadow-md`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {material.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {subject && (
                            <div
                              className={`px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r ${subject.color} text-white`}
                            >
                              {subject.name}
                            </div>
                          )}
                          <span className="text-xs text-slate-600">
                            {formatFileSize(material.fileSize)}
                          </span>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>

                    {material.status === 'processing' && (
                      <div className="mb-3 p-2 bg-blue-50 rounded-lg flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-xs font-medium text-blue-600">Processing...</span>
                      </div>
                    )}

                    {material.pageCount && (
                      <div className="mb-3 text-xs text-slate-600">
                        {material.pageCount}{' '}
                        {material.fileType === 'presentation' ? 'slides' : 'pages'}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(material.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePreviewMaterial(material)}
                          className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors"
                          title="Preview material"
                        >
                          <Eye className="w-4 h-4 text-slate-600 hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                          title="Delete material"
                        >
                          <Trash2 className="w-4 h-4 text-slate-600 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Subject Selector Modal */}
      {showSubjectSelector && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowSubjectSelector(false)}
        >
          <div
            className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 lg:p-6">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden"></div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Select Subject</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Choose which subject you're uploading materials for
                  </p>
                </div>
                <button
                  onClick={() => setShowSubjectSelector(false)}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelected(subject)}
                    className="w-full flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-95 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md`}
                    >
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {subject.name}
                      </p>
                      <p className="text-xs text-slate-600">Upload materials for this subject</p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400 -rotate-90" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Zone Modal */}
      {showUploadZone && uploadSubject && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => !isUploading && setShowUploadZone(false)}
        >
          <div
            className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 lg:p-6">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden"></div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Upload Materials</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${uploadSubject.color} text-white text-sm font-semibold`}
                    >
                      {uploadSubject.name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadZone(false)}
                  disabled={isUploading}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Limits Info */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Upload Limits:</p>
                    <ul className="space-y-0.5 text-xs">
                      <li>• Maximum {UPLOAD_LIMITS.maxFiles} files per upload</li>
                      <li>• Maximum {formatFileSize(UPLOAD_LIMITS.maxSizePerFile)} per file</li>
                      <li>• Maximum {formatFileSize(UPLOAD_LIMITS.maxTotalSize)} total</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center transition-all ${
                  isUploading
                    ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    : isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={UPLOAD_LIMITS.allowedTypes.join(',')}
                  onChange={e => handleFileSelect(e.target.files)}
                  className="hidden"
                  disabled={isUploading}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={e => handleFileSelect(e.target.files)}
                  className="hidden"
                  disabled={isUploading}
                />

                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isUploading ? 'bg-slate-100' : 'bg-blue-100'}`}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-blue-600" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">or choose from the options below</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                    Choose Files
                  </button>

                  {isMobile && (
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Camera className="w-5 h-5" />
                      Use Camera
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-4">
                  Supported: PDF, DOCX, PPTX, Images, Text files
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={handleOpenUpload}
        disabled={isUploading}
        className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Material Preview Modal */}
      {previewMaterial && (
        <MaterialPreviewModal
          material={previewMaterial}
          subject={subjects.find(s => s.id === previewMaterial.subjectId)}
          fileUrl={previewFileUrl}
          onClose={handleClosePreview}
          onDownload={handleDownloadPreview}
        />
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
