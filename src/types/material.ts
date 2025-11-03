export type MaterialType =
  | 'pdf'
  | 'video'
  | 'image'
  | 'document'
  | 'presentation'
  | 'text'
  | 'audio'
  | 'other';

export interface Material {
  id: string;
  userId: string;
  subjectId: string;
  name: string;
  fileType: MaterialType;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  thumbnailUrl: string | null;
  pageCount: number | null;
  durationSeconds: number | null;
  extractedText: string | null;
  uploadedAt: string;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialMetadata {
  pageCount?: number;
  duration?: number; // for videos
  dimensions?: {
    width: number;
    height: number;
  };
  extractedText?: string;
}

export interface MaterialUpload {
  file: File;
  subjectId: string;
  name?: string;
}

export interface MaterialProcessingStatus {
  materialId: string;
  status: Material['status'];
  progress: number; // 0-100
  message?: string;
}
