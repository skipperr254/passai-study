import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Calendar,
  Database,
  Eye,
  Code,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react';
import type { Material } from '@/types/material';
import type { Subject } from '@/types/subject';
import { formatFileSize } from '@/lib/upload.utils';

interface MaterialPreviewModalProps {
  material: Material;
  subject: Subject | undefined;
  fileUrl: string | null;
  onClose: () => void;
  onDownload: () => void;
}

type TabType = 'preview' | 'extracted' | 'info';

export function MaterialPreviewModal({
  material,
  subject,
  fileUrl,
  onClose,
  onDownload,
}: MaterialPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [imageZoom, setImageZoom] = useState(100);
  const [imageRotation, setImageRotation] = useState(0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMaterialIcon = (type: Material['fileType']) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'image':
        return '🖼️';
      case 'document':
        return '📝';
      case 'presentation':
        return '📊';
      case 'text':
        return '📃';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      default:
        return '📎';
    }
  };

  const canPreview = () => {
    return ['pdf', 'image', 'text'].includes(material.fileType);
  };

  const renderPreview = () => {
    if (!fileUrl || !canPreview()) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="text-6xl mb-4">{getMaterialIcon(material.fileType)}</div>
            <p className="text-lg font-semibold text-slate-900 mb-2">{material.name}</p>
            <p className="text-sm text-slate-600 mb-4">Preview not available for this file type</p>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download to view
            </button>
          </div>
        </div>
      );
    }

    // PDF Preview
    if (material.fileType === 'pdf') {
      return (
        <div className="flex-1 bg-slate-900">
          <iframe src={fileUrl} className="w-full h-full" title={material.name} />
        </div>
      );
    }

    // Image Preview
    if (material.fileType === 'image') {
      return (
        <div className="flex-1 bg-slate-900 overflow-auto">
          <div className="sticky top-0 z-10 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setImageZoom(Math.max(25, imageZoom - 25))}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-white" />
              </button>
              <span className="text-sm text-white font-medium min-w-[60px] text-center">
                {imageZoom}%
              </span>
              <button
                onClick={() => setImageZoom(Math.min(200, imageZoom + 25))}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-white" />
              </button>
              <div className="w-px h-6 bg-slate-600 mx-2" />
              <button
                onClick={() => setImageRotation((imageRotation + 90) % 360)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Rotate"
              >
                <RotateCw className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => {
                  setImageZoom(100);
                  setImageRotation(0);
                }}
                className="ml-2 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-[calc(100%-48px)] p-4">
            <img
              src={fileUrl}
              alt={material.name}
              style={{
                transform: `scale(${imageZoom / 100}) rotate(${imageRotation}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      );
    }

    // Text Preview
    if (material.fileType === 'text') {
      return (
        <div className="flex-1 bg-white overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <iframe
              src={fileUrl}
              className="w-full h-full min-h-[600px] border-0"
              title={material.name}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderExtractedText = () => {
    if (!material.extractedText) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center max-w-md">
            <Code className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-900 mb-2">No extracted text</p>
            <p className="text-sm text-slate-600">
              {material.status === 'processing'
                ? 'Text is currently being extracted...'
                : material.status === 'failed'
                  ? 'Text extraction failed for this file'
                  : 'This file type does not support text extraction'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 bg-white overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">Extracted Text</p>
              <p className="text-blue-700">
                {material.extractedText.length.toLocaleString()} characters extracted
                {material.pageCount &&
                  ` from ${material.pageCount} ${material.fileType === 'presentation' ? 'slides' : 'pages'}`}
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
              {material.extractedText}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  const renderInfo = () => {
    return (
      <div className="flex-1 bg-slate-50 overflow-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              File Information
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">Name</dt>
                <dd className="text-sm text-slate-900 font-semibold text-right max-w-xs truncate">
                  {material.name}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">Type</dt>
                <dd className="text-sm text-slate-900">
                  <span className="px-2 py-1 bg-slate-100 rounded capitalize">
                    {material.fileType}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">Size</dt>
                <dd className="text-sm text-slate-900 font-mono">
                  {formatFileSize(material.fileSize)}
                </dd>
              </div>
              {subject && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-slate-600">Subject</dt>
                  <dd className="text-sm">
                    <span
                      className={`px-2 py-1 rounded text-white bg-gradient-to-r ${subject.color} font-semibold`}
                    >
                      {subject.name}
                    </span>
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">Status</dt>
                <dd className="text-sm">
                  <span
                    className={`px-2 py-1 rounded font-semibold ${
                      material.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : material.status === 'processing'
                          ? 'bg-blue-100 text-blue-700'
                          : material.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {material.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Timestamps
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">Uploaded</dt>
                <dd className="text-sm text-slate-900">{formatDate(material.uploadedAt)}</dd>
              </div>
              {material.processedAt && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-slate-600">Processed</dt>
                  <dd className="text-sm text-slate-900">{formatDate(material.processedAt)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">Created</dt>
                <dd className="text-sm text-slate-900">{formatDate(material.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">Last Modified</dt>
                <dd className="text-sm text-slate-900">{formatDate(material.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          {/* Extracted Data */}
          {(material.pageCount || material.extractedText) && (
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Extracted Data
              </h3>
              <dl className="space-y-3">
                {material.pageCount && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">
                      {material.fileType === 'presentation' ? 'Slides' : 'Pages'}
                    </dt>
                    <dd className="text-sm text-slate-900 font-semibold">{material.pageCount}</dd>
                  </div>
                )}
                {material.durationSeconds && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Duration</dt>
                    <dd className="text-sm text-slate-900 font-semibold">
                      {Math.floor(material.durationSeconds / 60)}:
                      {(material.durationSeconds % 60).toString().padStart(2, '0')}
                    </dd>
                  </div>
                )}
                {material.extractedText && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Extracted Text</dt>
                    <dd className="text-sm text-slate-900 font-semibold">
                      {material.extractedText.length.toLocaleString()} characters
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Technical Info */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Technical Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">MIME Type</dt>
                <dd className="text-xs text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded">
                  {material.mimeType}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-slate-600">Material ID</dt>
                <dd className="text-xs text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded">
                  {material.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-6xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 truncate mb-1">{material.name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {subject && (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r ${subject.color} text-white`}
                >
                  {subject.name}
                </span>
              )}
              <span className="text-xs text-slate-600">{formatFileSize(material.fileSize)}</span>
              {material.pageCount && (
                <span className="text-xs text-slate-600">
                  • {material.pageCount} {material.fileType === 'presentation' ? 'slides' : 'pages'}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onDownload}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('extracted')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'extracted'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Code className="w-4 h-4 inline mr-2" />
            Extracted Text
            {material.extractedText && (
              <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
                {material.extractedText.length > 1000
                  ? `${(material.extractedText.length / 1000).toFixed(1)}k`
                  : material.extractedText.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'info'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Info
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'preview' && renderPreview()}
          {activeTab === 'extracted' && renderExtractedText()}
          {activeTab === 'info' && renderInfo()}
        </div>
      </div>
    </div>
  );
}
