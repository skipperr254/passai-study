export type MaterialType = 'pdf' | 'video' | 'image' | 'document' | 'notes';

export interface Material {
  id: string;
  userId: string;
  subjectId: string;
  name: string;
  type: MaterialType;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  processedAt?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  thumbnail?: string;
  metadata?: MaterialMetadata;
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
