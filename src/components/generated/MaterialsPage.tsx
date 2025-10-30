"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, Video, Book, Plus, X, CheckCircle2, AlertCircle, Loader2, File, Image as ImageIcon, Trash2, ChevronDown, Filter, Search, FolderOpen, Calendar, Download, Eye, MoreVertical, Sparkles, Info, Zap, FileCheck, BookOpen, PenTool, GraduationCap, ClipboardCheck, Edit3, Tag, AlertTriangle, Camera } from 'lucide-react';
type Subject = {
  id: string;
  name: string;
  color: string;
};
type MaterialType = 'pdf' | 'video' | 'image' | 'document' | 'notes';
type Material = {
  id: string;
  name: string;
  type: MaterialType;
  subject: string;
  subjectColor: string;
  uploadedDate: string;
  size: string;
  pageCount?: number;
  duration?: string;
  status: 'processing' | 'ready' | 'error';
  processingProgress?: number;
  tags?: string[];
};
type PendingFile = {
  id: string;
  file: File;
  subject: string;
  subjectColor: string;
};
type ProcessingFile = {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'extracting' | 'complete' | 'error';
  currentStep: string;
  error?: string;
  subject: string;
  subjectColor: string;
};
const UPLOAD_LIMITS = {
  maxFiles: 10,
  maxSizePerFile: 50,
  // MB
  maxTotalSize: 200,
  // MB
  allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'video/mp4', 'video/quicktime', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
};
const mockSubjects: Subject[] = [{
  id: '1',
  name: 'History',
  color: 'from-blue-500 to-blue-600'
}, {
  id: '2',
  name: 'English',
  color: 'from-purple-500 to-purple-600'
}, {
  id: '3',
  name: 'Mathematics',
  color: 'from-green-500 to-green-600'
}, {
  id: '4',
  name: 'Science',
  color: 'from-orange-500 to-orange-600'
}];
const mockMaterials: Material[] = [{
  id: '1',
  name: 'World War II Timeline.pdf',
  type: 'pdf',
  subject: 'History',
  subjectColor: 'from-blue-500 to-blue-600',
  uploadedDate: '2 hours ago',
  size: '4.2 MB',
  pageCount: 45,
  status: 'ready',
  tags: ['WWII', 'Timeline', 'Europe']
}, {
  id: '2',
  name: 'Calculus Lecture Video.mp4',
  type: 'video',
  subject: 'Mathematics',
  subjectColor: 'from-green-500 to-green-600',
  uploadedDate: '1 day ago',
  size: '125 MB',
  duration: '45:30',
  status: 'ready',
  tags: ['Calculus', 'Derivatives']
}, {
  id: '3',
  name: 'Chemistry Lab Notes.pdf',
  type: 'pdf',
  subject: 'Science',
  subjectColor: 'from-orange-500 to-orange-600',
  uploadedDate: '3 days ago',
  size: '2.8 MB',
  pageCount: 12,
  status: 'ready'
}];
const uploadTips = [{
  icon: FileText,
  text: 'Class notes (handwritten or typed)'
}, {
  icon: BookOpen,
  text: 'Textbook pages/chapters'
}, {
  icon: FileCheck,
  text: 'Lecture slides'
}, {
  icon: GraduationCap,
  text: "Teacher's study guide"
}, {
  icon: ClipboardCheck,
  text: 'Past quizzes/tests'
}, {
  icon: PenTool,
  text: 'Your own study materials'
}];
type MaterialsPageProps = {
  preSelectedSubjectId?: string;
};
export const MaterialsPage = ({
  preSelectedSubjectId
}: MaterialsPageProps) => {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(preSelectedSubjectId ? mockSubjects.find(s => s.id === preSelectedSubjectId) || null : null);
  const [uploadSubject, setUploadSubject] = useState<Subject | null>(preSelectedSubjectId ? mockSubjects.find(s => s.id === preSelectedSubjectId) || null : null);
  const [filterSubject, setFilterSubject] = useState<Subject | null>(null);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [showSubjectSelector, setShowSubjectSelector] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const filteredMaterials = materials.filter(material => {
    const matchesSubject = !filterSubject || material.subject === filterSubject.name;
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });
  const stats = {
    total: filteredMaterials.length,
    totalSize: filteredMaterials.reduce((acc, m) => {
      const size = parseFloat(m.size);
      return acc + (m.size.includes('GB') ? size * 1024 : size);
    }, 0),
    processing: processingFiles.length,
    pending: pendingFiles.length
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
  const handleFileSelect = (files: FileList | null) => {
    if (!files || isProcessing || !uploadSubject) return;
    const fileArray = Array.from(files);

    // Validate file count
    const totalFiles = pendingFiles.length + fileArray.length;
    if (totalFiles > UPLOAD_LIMITS.maxFiles) {
      alert(`You can only upload up to ${UPLOAD_LIMITS.maxFiles} files at once. You currently have ${pendingFiles.length} pending.`);
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
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > UPLOAD_LIMITS.maxSizePerFile) {
        errors.push(`${file.name}: File size exceeds ${UPLOAD_LIMITS.maxSizePerFile}MB`);
        return;
      }
      validFiles.push(file);
    });

    // Check total size
    const existingSize = pendingFiles.reduce((acc, pf) => acc + pf.file.size / (1024 * 1024), 0);
    const newSize = validFiles.reduce((acc, file) => acc + file.size / (1024 * 1024), 0);
    if (existingSize + newSize > UPLOAD_LIMITS.maxTotalSize) {
      alert(`Total upload size exceeds ${UPLOAD_LIMITS.maxTotalSize}MB limit`);
      return;
    }
    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    // Add valid files to pending list with subject info
    const newPendingFiles: PendingFile[] = validFiles.map(file => ({
      id: `pending-${Date.now()}-${Math.random()}`,
      file,
      subject: uploadSubject.name,
      subjectColor: uploadSubject.color
    }));
    setPendingFiles(prev => [...prev, ...newPendingFiles]);
  };
  const removePendingFile = (id: string) => {
    if (isProcessing) return;
    setPendingFiles(prev => prev.filter(f => f.id !== id));
  };
  const startProcessing = async () => {
    if (pendingFiles.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setShowUploadZone(false);

    // Process files one by one
    for (const pendingFile of pendingFiles) {
      await processFile(pendingFile);
    }
    setIsProcessing(false);
  };
  const processFile = (pendingFile: PendingFile): Promise<void> => {
    return new Promise(resolve => {
      const processingFile: ProcessingFile = {
        id: pendingFile.id,
        file: pendingFile.file,
        progress: 0,
        status: 'uploading',
        currentStep: 'Uploading to cloud...',
        subject: pendingFile.subject,
        subjectColor: pendingFile.subjectColor
      };

      // Add to processing list
      setProcessingFiles(prev => [...prev, processingFile]);

      // Simulate upload stages
      const stages = [{
        status: 'uploading' as const,
        step: 'Uploading to cloud...',
        duration: 2000
      }, {
        status: 'processing' as const,
        step: 'Processing file...',
        duration: 2500
      }, {
        status: 'extracting' as const,
        step: 'Extracting text content...',
        duration: 3000
      }, {
        status: 'complete' as const,
        step: 'Complete!',
        duration: 500
      }];
      let currentStage = 0;
      let progress = 0;
      const updateProgress = () => {
        const stage = stages[currentStage];
        setProcessingFiles(prev => prev.map(f => f.id === pendingFile.id ? {
          ...f,
          status: stage.status,
          currentStep: stage.step,
          progress
        } : f));
        progress += 15;
        if (progress >= 100) {
          currentStage++;
          progress = 0;
          if (currentStage >= stages.length) {
            // Upload complete - add to materials
            setTimeout(() => {
              const newMaterial: Material = {
                id: `material-${Date.now()}`,
                name: pendingFile.file.name,
                type: pendingFile.file.type.includes('pdf') ? 'pdf' : pendingFile.file.type.includes('video') ? 'video' : pendingFile.file.type.includes('image') ? 'image' : 'document',
                subject: pendingFile.subject,
                subjectColor: pendingFile.subjectColor,
                uploadedDate: 'Just now',
                size: `${(pendingFile.file.size / (1024 * 1024)).toFixed(1)} MB`,
                status: 'ready'
              };
              setMaterials(prevMaterials => [newMaterial, ...prevMaterials]);

              // Remove from processing and pending
              setProcessingFiles(prev => prev.filter(f => f.id !== pendingFile.id));
              setPendingFiles(prev => prev.filter(f => f.id !== pendingFile.id));
              resolve();
            }, 500);
            return;
          }
        }
        setTimeout(updateProgress, stage.duration / 7);
      };
      updateProgress();
    });
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing && uploadSubject) {
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
    if (!isProcessing && uploadSubject) {
      handleFileSelect(e.dataTransfer.files);
    }
  };
  const getMaterialIcon = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'video':
        return Video;
      case 'image':
        return ImageIcon;
      case 'document':
        return File;
      case 'notes':
        return Book;
      default:
        return File;
    }
  };
  const getMaterialColor = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return 'from-red-500 to-pink-600';
      case 'video':
        return 'from-purple-500 to-indigo-600';
      case 'image':
        return 'from-blue-500 to-cyan-600';
      case 'document':
        return 'from-green-500 to-emerald-600';
      case 'notes':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };
  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return FileText;
    if (file.type.includes('video')) return Video;
    if (file.type.includes('image')) return ImageIcon;
    return File;
  };
  const getFileColor = (file: File) => {
    if (file.type.includes('pdf')) return 'from-red-500 to-pink-600';
    if (file.type.includes('video')) return 'from-purple-500 to-indigo-600';
    if (file.type.includes('image')) return 'from-blue-500 to-cyan-600';
    return 'from-green-500 to-emerald-600';
  };

  // Check if device has camera (mobile detection)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return <div className="h-full overflow-y-auto pb-4" data-magicpath-id="0" data-magicpath-path="MaterialsPage.tsx">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 border-b border-slate-200/60" data-magicpath-id="1" data-magicpath-path="MaterialsPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="MaterialsPage.tsx">
          <div className="flex items-start justify-between mb-4 lg:mb-6" data-magicpath-id="3" data-magicpath-path="MaterialsPage.tsx">
            <div data-magicpath-id="4" data-magicpath-path="MaterialsPage.tsx">
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2" data-magicpath-id="5" data-magicpath-path="MaterialsPage.tsx">Study Materials</h1>
              <p className="text-sm lg:text-base text-slate-600" data-magicpath-id="6" data-magicpath-path="MaterialsPage.tsx">Upload and manage your learning resources</p>
            </div>
            <button onClick={handleOpenUpload} disabled={isProcessing} className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed" data-magicpath-id="7" data-magicpath-path="MaterialsPage.tsx">
              <Plus className="w-5 h-5" data-magicpath-id="8" data-magicpath-path="MaterialsPage.tsx" />
              <span data-magicpath-id="9" data-magicpath-path="MaterialsPage.tsx">Upload Materials</span>
            </button>
          </div>

          {/* Current Upload Subject Banner (if selected) */}
          {uploadSubject && <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl" data-magicpath-id="10" data-magicpath-path="MaterialsPage.tsx">
              <div className="flex items-center justify-between" data-magicpath-id="11" data-magicpath-path="MaterialsPage.tsx">
                <div className="flex items-center gap-3" data-magicpath-id="12" data-magicpath-path="MaterialsPage.tsx">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${uploadSubject.color} flex items-center justify-center shadow-sm`} data-magicpath-id="13" data-magicpath-path="MaterialsPage.tsx">
                    <Book className="w-5 h-5 text-white" data-magicpath-id="14" data-magicpath-path="MaterialsPage.tsx" />
                  </div>
                  <div data-magicpath-id="15" data-magicpath-path="MaterialsPage.tsx">
                    <p className="text-xs font-semibold text-blue-600 mb-0.5" data-magicpath-id="16" data-magicpath-path="MaterialsPage.tsx">UPLOADING FOR</p>
                    <p className="text-sm font-bold text-slate-900" data-magicpath-id="17" data-magicpath-path="MaterialsPage.tsx">{uploadSubject.name}</p>
                  </div>
                </div>
                <button onClick={() => {
              if (!isProcessing && pendingFiles.length === 0) {
                setUploadSubject(null);
                setShowSubjectSelector(true);
              }
            }} disabled={isProcessing || pendingFiles.length > 0} className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed" data-magicpath-id="18" data-magicpath-path="MaterialsPage.tsx">
                  Change
                </button>
              </div>
            </div>}

          {/* Subject Filter & Search */}
          <div className="flex flex-col lg:flex-row gap-3 mb-4" data-magicpath-id="19" data-magicpath-path="MaterialsPage.tsx">
            {/* Subject Filter - Desktop */}
            <div className="hidden lg:block relative" data-magicpath-id="20" data-magicpath-path="MaterialsPage.tsx">
              <button onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${filterSubject ? `bg-gradient-to-r ${filterSubject.color} text-white shadow-md hover:shadow-lg` : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`} data-magicpath-id="21" data-magicpath-path="MaterialsPage.tsx">
                <Book className="w-5 h-5" data-magicpath-id="22" data-magicpath-path="MaterialsPage.tsx" />
                <span className="font-semibold" data-magicpath-id="23" data-magicpath-path="MaterialsPage.tsx">{filterSubject?.name || 'All Subjects'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} data-magicpath-id="24" data-magicpath-path="MaterialsPage.tsx" />
              </button>

              {isSubjectDropdownOpen && <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-xl z-10" data-magicpath-id="25" data-magicpath-path="MaterialsPage.tsx">
                  <button onClick={() => {
                setFilterSubject(null);
                setIsSubjectDropdownOpen(false);
              }} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors first:rounded-t-xl ${!filterSubject ? 'bg-blue-50' : ''}`} data-magicpath-id="26" data-magicpath-path="MaterialsPage.tsx">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center" data-magicpath-id="27" data-magicpath-path="MaterialsPage.tsx">
                      <Book className="w-5 h-5 text-white" data-magicpath-id="28" data-magicpath-path="MaterialsPage.tsx" />
                    </div>
                    <span className="flex-1 text-left font-semibold text-slate-900" data-magicpath-id="29" data-magicpath-path="MaterialsPage.tsx">All Subjects</span>
                    {!filterSubject && <CheckCircle2 className="w-5 h-5 text-blue-600" data-magicpath-id="30" data-magicpath-path="MaterialsPage.tsx" />}
                  </button>
                  {mockSubjects.map(subject => <button key={subject.id} onClick={() => {
                setFilterSubject(subject);
                setIsSubjectDropdownOpen(false);
              }} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors last:rounded-b-xl ${filterSubject?.id === subject.id ? 'bg-blue-50' : ''}`} data-magicpath-id="31" data-magicpath-path="MaterialsPage.tsx">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`} data-magicpath-id="32" data-magicpath-path="MaterialsPage.tsx">
                        <Book className="w-5 h-5 text-white" data-magicpath-id="33" data-magicpath-path="MaterialsPage.tsx" />
                      </div>
                      <span className="flex-1 text-left font-semibold text-slate-900" data-magicpath-id="34" data-magicpath-path="MaterialsPage.tsx">{subject.name}</span>
                      {filterSubject?.id === subject.id && <CheckCircle2 className="w-5 h-5 text-blue-600" data-magicpath-id="35" data-magicpath-path="MaterialsPage.tsx" />}
                    </button>)}
                </div>}
            </div>

            {/* Mobile Subject Scroll */}
            <div className="lg:hidden -mx-4 px-4 overflow-x-auto hide-scrollbar" data-magicpath-id="36" data-magicpath-path="MaterialsPage.tsx">
              <div className="flex gap-2 pb-1" data-magicpath-id="37" data-magicpath-path="MaterialsPage.tsx">
                <button onClick={() => setFilterSubject(null)} className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${!filterSubject ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md' : 'bg-white border-2 border-slate-200 text-slate-700'}`} data-magicpath-id="38" data-magicpath-path="MaterialsPage.tsx">
                  <div className="flex items-center gap-2" data-magicpath-id="39" data-magicpath-path="MaterialsPage.tsx">
                    <Book className="w-4 h-4" data-magicpath-id="40" data-magicpath-path="MaterialsPage.tsx" />
                    <span className="text-sm font-semibold whitespace-nowrap" data-magicpath-id="41" data-magicpath-path="MaterialsPage.tsx">All</span>
                  </div>
                </button>
                {mockSubjects.map(subject => <button key={subject.id} onClick={() => setFilterSubject(subject)} className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${filterSubject?.id === subject.id ? `bg-gradient-to-r ${subject.color} text-white shadow-md` : 'bg-white border-2 border-slate-200 text-slate-700'}`} data-magicpath-id="42" data-magicpath-path="MaterialsPage.tsx">
                    <div className="flex items-center gap-2" data-magicpath-id="43" data-magicpath-path="MaterialsPage.tsx">
                      <Book className="w-4 h-4" data-magicpath-id="44" data-magicpath-path="MaterialsPage.tsx" />
                      <span className="text-sm font-semibold whitespace-nowrap" data-magicpath-id="45" data-magicpath-path="MaterialsPage.tsx">{subject.name}</span>
                    </div>
                  </button>)}
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative" data-magicpath-id="46" data-magicpath-path="MaterialsPage.tsx">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" data-magicpath-id="47" data-magicpath-path="MaterialsPage.tsx" />
              <input type="text" placeholder="Search materials..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" data-magicpath-id="48" data-magicpath-path="MaterialsPage.tsx" />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3" data-magicpath-id="49" data-magicpath-path="MaterialsPage.tsx">
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200" data-magicpath-id="50" data-magicpath-path="MaterialsPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="51" data-magicpath-path="MaterialsPage.tsx">Total Materials</p>
              <p className="text-xl lg:text-3xl font-bold text-slate-900" data-magicpath-id="52" data-magicpath-path="MaterialsPage.tsx">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-3 lg:p-4 border-2 border-slate-200" data-magicpath-id="53" data-magicpath-path="MaterialsPage.tsx">
              <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1" data-magicpath-id="54" data-magicpath-path="MaterialsPage.tsx">Storage Used</p>
              <p className="text-xl lg:text-3xl font-bold text-blue-600" data-magicpath-id="55" data-magicpath-path="MaterialsPage.tsx">{stats.totalSize.toFixed(0)}MB</p>
            </div>
            <div className={`rounded-xl p-3 lg:p-4 text-white ${isProcessing ? 'bg-gradient-to-br from-amber-500 to-orange-600 animate-pulse' : stats.pending > 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`} data-magicpath-id="56" data-magicpath-path="MaterialsPage.tsx">
              <p className="text-xs lg:text-sm font-medium mb-1 text-white/90" data-magicpath-id="57" data-magicpath-path="MaterialsPage.tsx">
                {isProcessing ? 'Processing' : 'Pending'}
              </p>
              <p className="text-xl lg:text-3xl font-bold" data-magicpath-id="58" data-magicpath-path="MaterialsPage.tsx">{isProcessing ? stats.processing : stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 lg:px-8 lg:py-6" data-magicpath-id="59" data-magicpath-path="MaterialsPage.tsx">
        <div className="max-w-7xl mx-auto space-y-6" data-magicpath-id="60" data-magicpath-path="MaterialsPage.tsx">
          {/* Processing Warning Banner */}
          {isProcessing && <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 lg:p-5" data-magicpath-id="61" data-magicpath-path="MaterialsPage.tsx">
              <div className="flex items-start gap-3" data-magicpath-id="62" data-magicpath-path="MaterialsPage.tsx">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0" data-magicpath-id="63" data-magicpath-path="MaterialsPage.tsx">
                  <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" data-magicpath-id="64" data-magicpath-path="MaterialsPage.tsx" />
                </div>
                <div className="flex-1" data-magicpath-id="65" data-magicpath-path="MaterialsPage.tsx">
                  <h3 className="text-base lg:text-lg font-bold text-amber-900 mb-1" data-magicpath-id="66" data-magicpath-path="MaterialsPage.tsx">Processing Materials</h3>
                  <p className="text-sm text-amber-800" data-magicpath-id="67" data-magicpath-path="MaterialsPage.tsx">
                    Please do not close or exit the app until all materials are uploaded and processed. 
                    {processingFiles.length > 0 && ` ${processingFiles.length} file${processingFiles.length > 1 ? 's' : ''} remaining.`}
                  </p>
                </div>
              </div>
            </div>}

          {/* Upload Tips Banner */}
          {materials.length === 0 && pendingFiles.length === 0 && !isProcessing && <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 lg:p-6" data-magicpath-id="68" data-magicpath-path="MaterialsPage.tsx">
              <div className="flex items-start gap-4 mb-4" data-magicpath-id="69" data-magicpath-path="MaterialsPage.tsx">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0" data-magicpath-id="70" data-magicpath-path="MaterialsPage.tsx">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div data-magicpath-id="71" data-magicpath-path="MaterialsPage.tsx">
                  <h3 className="text-lg font-bold text-slate-900 mb-2" data-magicpath-id="72" data-magicpath-path="MaterialsPage.tsx">What materials should you upload?</h3>
                  <p className="text-sm text-slate-600 mb-4" data-magicpath-id="73" data-magicpath-path="MaterialsPage.tsx">Upload any study materials to help PassAI create personalized quizzes:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4" data-magicpath-id="74" data-magicpath-path="MaterialsPage.tsx">
                    {uploadTips.map((tip, idx) => {
                  const Icon = tip.icon;
                  return <div key={idx} className="flex items-center gap-2 text-sm text-slate-700" data-magicpath-id="75" data-magicpath-path="MaterialsPage.tsx">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" data-magicpath-id="76" data-magicpath-path="MaterialsPage.tsx" />
                          <Icon className="w-4 h-4 text-slate-600 flex-shrink-0" data-magicpath-id="77" data-magicpath-path="MaterialsPage.tsx" />
                          <span className="font-medium" data-magicpath-id="78" data-magicpath-path="MaterialsPage.tsx">{tip.text}</span>
                        </div>;
                })}
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg" data-magicpath-id="79" data-magicpath-path="MaterialsPage.tsx">
                    <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" data-magicpath-id="80" data-magicpath-path="MaterialsPage.tsx" />
                    <div data-magicpath-id="81" data-magicpath-path="MaterialsPage.tsx">
                      <p className="text-sm font-bold text-amber-900 mb-1" data-magicpath-id="82" data-magicpath-path="MaterialsPage.tsx">Pro tip:</p>
                      <p className="text-sm text-amber-800" data-magicpath-id="83" data-magicpath-path="MaterialsPage.tsx">Upload the teacher's emphasis! If your teacher said "This will definitely be on the test," add a note about it.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

          {/* Pending Files Section */}
          {pendingFiles.length > 0 && !isProcessing && <div className="space-y-3" data-magicpath-id="84" data-magicpath-path="MaterialsPage.tsx">
              <div className="flex items-center justify-between" data-magicpath-id="85" data-magicpath-path="MaterialsPage.tsx">
                <h3 className="text-base lg:text-lg font-bold text-slate-900 flex items-center gap-2" data-magicpath-id="86" data-magicpath-path="MaterialsPage.tsx">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" data-magicpath-id="87" data-magicpath-path="MaterialsPage.tsx"></div>
                  {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''} ready to upload
                </h3>
                <button onClick={startProcessing} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all" data-magicpath-id="88" data-magicpath-path="MaterialsPage.tsx">
                  <Upload className="w-4 h-4" data-magicpath-id="89" data-magicpath-path="MaterialsPage.tsx" />
                  <span className="hidden sm:inline" data-magicpath-id="90" data-magicpath-path="MaterialsPage.tsx">Process All</span>
                  <span className="sm:hidden" data-magicpath-id="91" data-magicpath-path="MaterialsPage.tsx">Process</span>
                </button>
              </div>

              <div className="space-y-2" data-magicpath-id="92" data-magicpath-path="MaterialsPage.tsx">
                {pendingFiles.map(pending => {
              const Icon = getFileIcon(pending.file);
              return <div key={pending.id} className="bg-white border-2 border-blue-200 rounded-xl p-3 lg:p-4 hover:border-blue-300 transition-all group" data-magicpath-id="93" data-magicpath-path="MaterialsPage.tsx">
                      <div className="flex items-center gap-3" data-magicpath-id="94" data-magicpath-path="MaterialsPage.tsx">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${getFileColor(pending.file)} flex items-center justify-center flex-shrink-0 shadow-sm`} data-magicpath-id="95" data-magicpath-path="MaterialsPage.tsx">
                          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" data-magicpath-id="96" data-magicpath-path="MaterialsPage.tsx" />
                        </div>
                        <div className="flex-1 min-w-0" data-magicpath-id="97" data-magicpath-path="MaterialsPage.tsx">
                          <p className="font-bold text-slate-900 truncate text-sm lg:text-base" data-magicpath-id="98" data-magicpath-path="MaterialsPage.tsx">{pending.file.name}</p>
                          <div className="flex items-center gap-2" data-magicpath-id="99" data-magicpath-path="MaterialsPage.tsx">
                            <div className={`px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r ${pending.subjectColor} text-white`} data-magicpath-id="100" data-magicpath-path="MaterialsPage.tsx">
                              {pending.subject}
                            </div>
                            <span className="text-xs lg:text-sm text-slate-600" data-magicpath-id="101" data-magicpath-path="MaterialsPage.tsx">{(pending.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                          </div>
                        </div>
                        <button onClick={() => removePendingFile(pending.id)} className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0" title="Remove file" data-magicpath-id="102" data-magicpath-path="MaterialsPage.tsx">
                          <X className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" data-magicpath-id="103" data-magicpath-path="MaterialsPage.tsx" />
                        </button>
                      </div>
                    </div>;
            })}
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg" data-magicpath-id="104" data-magicpath-path="MaterialsPage.tsx">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" data-magicpath-id="105" data-magicpath-path="MaterialsPage.tsx" />
                <p className="text-sm text-blue-800" data-magicpath-id="106" data-magicpath-path="MaterialsPage.tsx">
                  Review your files and click <span className="font-bold" data-magicpath-id="107" data-magicpath-path="MaterialsPage.tsx">"Process All"</span> to start uploading. You can add more files or remove any before processing.
                </p>
              </div>
            </div>}

          {/* Processing Files Progress */}
          {processingFiles.length > 0 && <div className="space-y-3" data-magicpath-id="108" data-magicpath-path="MaterialsPage.tsx">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2" data-magicpath-id="109" data-magicpath-path="MaterialsPage.tsx">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" data-magicpath-id="110" data-magicpath-path="MaterialsPage.tsx" />
                Processing {processingFiles.length} file{processingFiles.length > 1 ? 's' : ''}...
              </h3>
              
              {processingFiles.map(file => <div key={file.id} className="bg-white border-2 border-blue-200 rounded-xl p-4 lg:p-5" data-magicpath-id="111" data-magicpath-path="MaterialsPage.tsx">
                  <div className="flex items-start gap-3 mb-3" data-magicpath-id="112" data-magicpath-path="MaterialsPage.tsx">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0" data-magicpath-id="113" data-magicpath-path="MaterialsPage.tsx">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" data-magicpath-id="114" data-magicpath-path="MaterialsPage.tsx" />
                    </div>
                    <div className="flex-1 min-w-0" data-magicpath-id="115" data-magicpath-path="MaterialsPage.tsx">
                      <p className="font-bold text-slate-900 truncate" data-magicpath-id="116" data-magicpath-path="MaterialsPage.tsx">{file.file.name}</p>
                      <div className="flex items-center gap-2" data-magicpath-id="117" data-magicpath-path="MaterialsPage.tsx">
                        <div className={`px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r ${file.subjectColor} text-white`} data-magicpath-id="118" data-magicpath-path="MaterialsPage.tsx">
                          {file.subject}
                        </div>
                        <span className="text-xs text-slate-600" data-magicpath-id="119" data-magicpath-path="MaterialsPage.tsx">{(file.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2" data-magicpath-id="120" data-magicpath-path="MaterialsPage.tsx">
                    <div className="flex items-center justify-between text-sm" data-magicpath-id="121" data-magicpath-path="MaterialsPage.tsx">
                      <span className="font-semibold text-blue-600" data-magicpath-id="122" data-magicpath-path="MaterialsPage.tsx">{file.currentStep}</span>
                      <span className="font-bold text-slate-900" data-magicpath-id="123" data-magicpath-path="MaterialsPage.tsx">{file.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden" data-magicpath-id="124" data-magicpath-path="MaterialsPage.tsx">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300" style={{
                  width: `${file.progress}%`
                }} data-magicpath-id="125" data-magicpath-path="MaterialsPage.tsx" />
                    </div>
                  </div>
                </div>)}
            </div>}

          {/* Materials Grid */}
          {filteredMaterials.length === 0 && pendingFiles.length === 0 && processingFiles.length === 0 ? <div className="text-center py-12" data-magicpath-id="126" data-magicpath-path="MaterialsPage.tsx">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4" data-magicpath-id="127" data-magicpath-path="MaterialsPage.tsx">
                <FolderOpen className="w-8 h-8 text-slate-400" data-magicpath-id="128" data-magicpath-path="MaterialsPage.tsx" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" data-magicpath-id="129" data-magicpath-path="MaterialsPage.tsx">No materials yet</h3>
              <p className="text-slate-600 mb-6" data-magicpath-id="130" data-magicpath-path="MaterialsPage.tsx">
                {filterSubject ? `Upload materials for ${filterSubject.name}` : 'Start by uploading your study materials'}
              </p>
              <button onClick={handleOpenUpload} disabled={isProcessing} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50" data-magicpath-id="131" data-magicpath-path="MaterialsPage.tsx">
                <Plus className="w-5 h-5" data-magicpath-id="132" data-magicpath-path="MaterialsPage.tsx" />
                Upload Materials
              </button>
            </div> : filteredMaterials.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4" data-magicpath-id="133" data-magicpath-path="MaterialsPage.tsx">
              {filteredMaterials.map(material => {
            const Icon = getMaterialIcon(material.type);
            return <div key={material.id} className="bg-white rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-4 lg:p-5 transition-all hover:shadow-lg group" data-magicpath-id="134" data-magicpath-path="MaterialsPage.tsx">
                    <div className="flex items-start gap-3 mb-3" data-magicpath-id="135" data-magicpath-path="MaterialsPage.tsx">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getMaterialColor(material.type)} flex items-center justify-center flex-shrink-0 shadow-md`} data-magicpath-id="136" data-magicpath-path="MaterialsPage.tsx">
                        <Icon className="w-6 h-6 text-white" data-magicpath-id="137" data-magicpath-path="MaterialsPage.tsx" />
                      </div>
                      <div className="flex-1 min-w-0" data-magicpath-id="138" data-magicpath-path="MaterialsPage.tsx">
                        <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors" data-magicpath-id="139" data-magicpath-path="MaterialsPage.tsx">
                          {material.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1" data-magicpath-id="140" data-magicpath-path="MaterialsPage.tsx">
                          <div className={`px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r ${material.subjectColor} text-white`} data-magicpath-id="141" data-magicpath-path="MaterialsPage.tsx">
                            {material.subject}
                          </div>
                          <span className="text-xs text-slate-600" data-magicpath-id="142" data-magicpath-path="MaterialsPage.tsx">{material.size}</span>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100" data-magicpath-id="143" data-magicpath-path="MaterialsPage.tsx">
                        <MoreVertical className="w-4 h-4 text-slate-600" data-magicpath-id="144" data-magicpath-path="MaterialsPage.tsx" />
                      </button>
                    </div>

                    {material.tags && material.tags.length > 0 && <div className="flex flex-wrap gap-1.5 mb-3" data-magicpath-id="145" data-magicpath-path="MaterialsPage.tsx">
                        {material.tags.map((tag, idx) => <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded" data-magicpath-id="146" data-magicpath-path="MaterialsPage.tsx">
                            {tag}
                          </span>)}
                      </div>}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200" data-magicpath-id="147" data-magicpath-path="MaterialsPage.tsx">
                      <div className="flex items-center gap-1 text-xs text-slate-600" data-magicpath-id="148" data-magicpath-path="MaterialsPage.tsx">
                        <Calendar className="w-3.5 h-3.5" data-magicpath-id="149" data-magicpath-path="MaterialsPage.tsx" />
                        <span data-magicpath-id="150" data-magicpath-path="MaterialsPage.tsx">{material.uploadedDate}</span>
                      </div>
                      <div className="flex items-center gap-1" data-magicpath-id="151" data-magicpath-path="MaterialsPage.tsx">
                        <button className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors" data-magicpath-id="152" data-magicpath-path="MaterialsPage.tsx">
                          <Eye className="w-4 h-4 text-slate-600 hover:text-blue-600" data-magicpath-id="153" data-magicpath-path="MaterialsPage.tsx" />
                        </button>
                        <button className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors" data-magicpath-id="154" data-magicpath-path="MaterialsPage.tsx">
                          <Trash2 className="w-4 h-4 text-slate-600 hover:text-red-600" data-magicpath-id="155" data-magicpath-path="MaterialsPage.tsx" />
                        </button>
                      </div>
                    </div>
                  </div>;
          })}
            </div>}
        </div>
      </div>

      {/* Subject Selector Modal */}
      {showSubjectSelector && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSubjectSelector(false)} data-magicpath-id="156" data-magicpath-path="MaterialsPage.tsx">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="157" data-magicpath-path="MaterialsPage.tsx">
            <div className="p-4 lg:p-6" data-magicpath-id="158" data-magicpath-path="MaterialsPage.tsx">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="159" data-magicpath-path="MaterialsPage.tsx"></div>
              
              <div className="flex items-center justify-between mb-6" data-magicpath-id="160" data-magicpath-path="MaterialsPage.tsx">
                <div data-magicpath-id="161" data-magicpath-path="MaterialsPage.tsx">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900" data-magicpath-id="162" data-magicpath-path="MaterialsPage.tsx">Select Subject</h2>
                  <p className="text-sm text-slate-600 mt-1" data-magicpath-id="163" data-magicpath-path="MaterialsPage.tsx">Choose which subject you're uploading materials for</p>
                </div>
                <button onClick={() => setShowSubjectSelector(false)} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors" data-magicpath-id="164" data-magicpath-path="MaterialsPage.tsx">
                  <X className="w-5 h-5" data-magicpath-id="165" data-magicpath-path="MaterialsPage.tsx" />
                </button>
              </div>

              <div className="space-y-2" data-magicpath-id="166" data-magicpath-path="MaterialsPage.tsx">
                {mockSubjects.map(subject => <button key={subject.id} onClick={() => handleSubjectSelected(subject)} className="w-full flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-95 group" data-magicpath-id="167" data-magicpath-path="MaterialsPage.tsx">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md`} data-magicpath-id="168" data-magicpath-path="MaterialsPage.tsx">
                      <Book className="w-6 h-6 text-white" data-magicpath-id="169" data-magicpath-path="MaterialsPage.tsx" />
                    </div>
                    <div className="flex-1 text-left" data-magicpath-id="170" data-magicpath-path="MaterialsPage.tsx">
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors" data-magicpath-id="171" data-magicpath-path="MaterialsPage.tsx">{subject.name}</p>
                      <p className="text-xs text-slate-600" data-magicpath-id="172" data-magicpath-path="MaterialsPage.tsx">Upload materials for this subject</p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400 -rotate-90" data-magicpath-id="173" data-magicpath-path="MaterialsPage.tsx" />
                  </button>)}
              </div>
            </div>
          </div>
        </div>}

      {/* Upload Zone Modal */}
      {showUploadZone && uploadSubject && <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !isProcessing && setShowUploadZone(false)} data-magicpath-id="174" data-magicpath-path="MaterialsPage.tsx">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300" onClick={e => e.stopPropagation()} data-magicpath-id="175" data-magicpath-path="MaterialsPage.tsx">
            <div className="p-4 lg:p-6" data-magicpath-id="176" data-magicpath-path="MaterialsPage.tsx">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden" data-magicpath-id="177" data-magicpath-path="MaterialsPage.tsx"></div>
              
              <div className="flex items-center justify-between mb-6" data-magicpath-id="178" data-magicpath-path="MaterialsPage.tsx">
                <div data-magicpath-id="179" data-magicpath-path="MaterialsPage.tsx">
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-900" data-magicpath-id="180" data-magicpath-path="MaterialsPage.tsx">Upload Materials</h2>
                  <div className="flex items-center gap-2 mt-2" data-magicpath-id="181" data-magicpath-path="MaterialsPage.tsx">
                    <div className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${uploadSubject.color} text-white text-sm font-semibold`} data-magicpath-id="182" data-magicpath-path="MaterialsPage.tsx">
                      {uploadSubject.name}
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowUploadZone(false)} disabled={isProcessing} className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors disabled:opacity-50" data-magicpath-id="183" data-magicpath-path="MaterialsPage.tsx">
                  <X className="w-5 h-5" data-magicpath-id="184" data-magicpath-path="MaterialsPage.tsx" />
                </button>
              </div>

              {/* Upload Limits Info */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl" data-magicpath-id="185" data-magicpath-path="MaterialsPage.tsx">
                <div className="flex items-start gap-2" data-magicpath-id="186" data-magicpath-path="MaterialsPage.tsx">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" data-magicpath-id="187" data-magicpath-path="MaterialsPage.tsx" />
                  <div className="text-sm text-blue-800" data-magicpath-id="188" data-magicpath-path="MaterialsPage.tsx">
                    <p className="font-semibold mb-1" data-magicpath-id="189" data-magicpath-path="MaterialsPage.tsx">Upload Limits:</p>
                    <ul className="space-y-0.5 text-xs" data-magicpath-id="190" data-magicpath-path="MaterialsPage.tsx">
                      <li data-magicpath-id="191" data-magicpath-path="MaterialsPage.tsx">• Maximum {UPLOAD_LIMITS.maxFiles} files per upload</li>
                      <li data-magicpath-id="192" data-magicpath-path="MaterialsPage.tsx">• Maximum {UPLOAD_LIMITS.maxSizePerFile}MB per file</li>
                      <li data-magicpath-id="193" data-magicpath-path="MaterialsPage.tsx">• Maximum {UPLOAD_LIMITS.maxTotalSize}MB total</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center transition-all ${isProcessing ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed' : isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'}`} data-magicpath-id="194" data-magicpath-path="MaterialsPage.tsx">
                <input ref={fileInputRef} type="file" multiple accept={UPLOAD_LIMITS.allowedTypes.join(',')} onChange={e => handleFileSelect(e.target.files)} className="hidden" disabled={isProcessing} data-magicpath-id="195" data-magicpath-path="MaterialsPage.tsx" />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={e => handleFileSelect(e.target.files)} className="hidden" disabled={isProcessing} data-magicpath-id="196" data-magicpath-path="MaterialsPage.tsx" />
                
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isProcessing ? 'bg-slate-100' : 'bg-blue-100'}`} data-magicpath-id="197" data-magicpath-path="MaterialsPage.tsx">
                  {isProcessing ? <Loader2 className="w-8 h-8 text-slate-400 animate-spin" data-magicpath-id="198" data-magicpath-path="MaterialsPage.tsx" /> : <Upload className="w-8 h-8 text-blue-600" data-magicpath-id="199" data-magicpath-path="MaterialsPage.tsx" />}
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2" data-magicpath-id="200" data-magicpath-path="MaterialsPage.tsx">
                  {isProcessing ? 'Processing files...' : isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-sm text-slate-600 mb-4" data-magicpath-id="201" data-magicpath-path="MaterialsPage.tsx">
                  {isProcessing ? 'Please wait while we process your materials' : 'or choose from the options below'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center" data-magicpath-id="202" data-magicpath-path="MaterialsPage.tsx">
                  <button onClick={() => fileInputRef.current?.click()} disabled={isProcessing} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed" data-magicpath-id="203" data-magicpath-path="MaterialsPage.tsx">
                    <Plus className="w-5 h-5" data-magicpath-id="204" data-magicpath-path="MaterialsPage.tsx" />
                    Choose Files
                  </button>

                  {isMobile && <button onClick={() => cameraInputRef.current?.click()} disabled={isProcessing} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed" data-magicpath-id="205" data-magicpath-path="MaterialsPage.tsx">
                      <Camera className="w-5 h-5" />
                      Use Camera
                    </button>}
                </div>

                <p className="text-xs text-slate-500 mt-4" data-magicpath-id="206" data-magicpath-path="MaterialsPage.tsx">
                  Supported: PDF, Images, Videos, Documents
                </p>
              </div>

              {/* Pending Files in Modal */}
              {pendingFiles.length > 0 && <div className="mt-4" data-magicpath-id="207" data-magicpath-path="MaterialsPage.tsx">
                  <div className="flex items-center justify-between mb-3" data-magicpath-id="208" data-magicpath-path="MaterialsPage.tsx">
                    <h4 className="text-sm font-bold text-slate-900" data-magicpath-id="209" data-magicpath-path="MaterialsPage.tsx">
                      {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''} ready
                    </h4>
                    {!isProcessing && <button onClick={startProcessing} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1" data-magicpath-id="210" data-magicpath-path="MaterialsPage.tsx">
                      <Upload className="w-4 h-4" data-magicpath-id="211" data-magicpath-path="MaterialsPage.tsx" />
                      Process All
                    </button>}
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto" data-magicpath-id="212" data-magicpath-path="MaterialsPage.tsx">
                    {pendingFiles.map(pending => {
                const Icon = getFileIcon(pending.file);
                return <div key={pending.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg" data-magicpath-id="213" data-magicpath-path="MaterialsPage.tsx">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getFileColor(pending.file)} flex items-center justify-center flex-shrink-0`} data-magicpath-id="214" data-magicpath-path="MaterialsPage.tsx">
                            <Icon className="w-4 h-4 text-white" data-magicpath-id="215" data-magicpath-path="MaterialsPage.tsx" />
                          </div>
                          <div className="flex-1 min-w-0" data-magicpath-id="216" data-magicpath-path="MaterialsPage.tsx">
                            <p className="text-sm font-semibold text-slate-900 truncate" data-magicpath-id="217" data-magicpath-path="MaterialsPage.tsx">{pending.file.name}</p>
                            <p className="text-xs text-slate-600" data-magicpath-id="218" data-magicpath-path="MaterialsPage.tsx">{(pending.file.size / (1024 * 1024)).toFixed(1)} MB</p>
                          </div>
                          {!isProcessing && <button onClick={() => removePendingFile(pending.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0" data-magicpath-id="219" data-magicpath-path="MaterialsPage.tsx">
                            <X className="w-4 h-4 text-red-600" data-magicpath-id="220" data-magicpath-path="MaterialsPage.tsx" />
                          </button>}
                        </div>;
              })}
                  </div>
                </div>}
            </div>
          </div>
        </div>}

      {/* Mobile FAB */}
      <button onClick={handleOpenUpload} disabled={isProcessing} className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed" data-magicpath-id="221" data-magicpath-path="MaterialsPage.tsx">
        <Plus className="w-6 h-6" data-magicpath-id="222" data-magicpath-path="MaterialsPage.tsx" />
      </button>

      <style data-magicpath-id="223" data-magicpath-path="MaterialsPage.tsx">{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>;
};