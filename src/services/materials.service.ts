import { supabase } from '@/lib/supabase';
import type { Material, MaterialType } from '@/types/material';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Database row type for materials table
 */
interface MaterialDbRow {
  id: string;
  user_id: string;
  subject_id: string;
  name: string;
  file_path: string;
  file_size: number;
  type: MaterialType;
  mime_type: string;
  status: Material['status'];
  thumbnail_url: string | null;
  page_count: number | null;
  duration_seconds: number | null;
  extracted_text: string | null;
  uploaded_at: string;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * DTO for creating a new material record
 */
export interface CreateMaterialDto {
  subjectId: string;
  name: string;
  filePath: string;
  fileSize: number;
  fileType: MaterialType;
  mimeType: string;
}

/**
 * DTO for updating material metadata
 */
export interface UpdateMaterialDto {
  name?: string;
  status?: Material['status'];
  thumbnailUrl?: string;
  pageCount?: number;
  durationSeconds?: number;
  extractedText?: string;
  processedAt?: string;
}

/**
 * Result type for file upload operations
 */
export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl?: string;
}

// ============================================================================
// Materials CRUD Operations
// ============================================================================

/**
 * Get all materials for a specific subject
 * @param userId - The authenticated user's ID
 * @param subjectId - The subject ID to filter by
 * @returns Array of materials
 */
export async function getMaterialsBySubject(
  userId: string,
  subjectId: string
): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('user_id', userId)
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching materials:', error);
    throw new Error(`Failed to fetch materials: ${error.message}`);
  }

  return (data || []).map(mapMaterialFromDb);
}

/**
 * Get all materials for the user (across all subjects)
 * @param userId - The authenticated user's ID
 * @returns Array of materials
 */
export async function getAllMaterials(userId: string): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching materials:', error);
    throw new Error(`Failed to fetch materials: ${error.message}`);
  }

  return (data || []).map(mapMaterialFromDb);
}

/**
 * Get a single material by ID
 * @param materialId - The material ID
 * @param userId - The authenticated user's ID
 * @returns Material or null if not found
 */
export async function getMaterialById(
  materialId: string,
  userId: string
): Promise<Material | null> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('id', materialId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching material:', error);
    throw new Error(`Failed to fetch material: ${error.message}`);
  }

  return mapMaterialFromDb(data);
}

/**
 * Create a new material record in the database
 * @param userId - The authenticated user's ID
 * @param dto - Material creation data
 * @returns Created material
 */
export async function createMaterial(userId: string, dto: CreateMaterialDto): Promise<Material> {
  const { data, error } = await supabase
    .from('materials')
    .insert({
      user_id: userId,
      subject_id: dto.subjectId,
      name: dto.name,
      file_path: dto.filePath,
      file_size: dto.fileSize,
      type: dto.fileType,
      mime_type: dto.mimeType,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating material:', error);
    throw new Error(`Failed to create material: ${error.message}`);
  }

  return mapMaterialFromDb(data);
}

/**
 * Update an existing material's metadata
 * @param materialId - The material ID
 * @param userId - The authenticated user's ID
 * @param dto - Material update data
 * @returns Updated material
 */
export async function updateMaterial(
  materialId: string,
  userId: string,
  dto: UpdateMaterialDto
): Promise<Material> {
  const updateData: Record<string, string | number | null> = {};

  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.status !== undefined) updateData.status = dto.status;
  if (dto.thumbnailUrl !== undefined) updateData.thumbnail_url = dto.thumbnailUrl || null;
  if (dto.pageCount !== undefined) updateData.page_count = dto.pageCount;
  if (dto.durationSeconds !== undefined) updateData.duration_seconds = dto.durationSeconds;
  if (dto.extractedText !== undefined) updateData.extracted_text = dto.extractedText || null;
  if (dto.processedAt !== undefined) updateData.processed_at = dto.processedAt;

  const { data, error } = await supabase
    .from('materials')
    .update(updateData)
    .eq('id', materialId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating material:', error);
    throw new Error(`Failed to update material: ${error.message}`);
  }

  return mapMaterialFromDb(data);
}

/**
 * Delete a material record and its associated file
 * @param materialId - The material ID
 * @param userId - The authenticated user's ID
 */
export async function deleteMaterial(materialId: string, userId: string): Promise<void> {
  // First, get the material to retrieve file path
  const material = await getMaterialById(materialId, userId);
  if (!material) {
    throw new Error('Material not found');
  }

  // Delete the file from storage
  try {
    await deleteFile(material.filePath);
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    // Continue with database deletion even if file deletion fails
  }

  // Delete the database record
  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', materialId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting material:', error);
    throw new Error(`Failed to delete material: ${error.message}`);
  }
}

// ============================================================================
// File Storage Operations
// ============================================================================

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param userId - The authenticated user's ID
 * @param subjectId - The subject ID for organization
 * @returns Upload result with file path
 */
export async function uploadFile(
  file: File,
  userId: string,
  subjectId: string
): Promise<UploadResult> {
  // Generate unique file path: {userId}/{subjectId}/{timestamp}_{filename}
  const timestamp = Date.now();
  const sanitizedFileName = sanitizeFileName(file.name);
  const filePath = `${userId}/${subjectId}/${timestamp}_${sanitizedFileName}`;

  const { data, error } = await supabase.storage.from('materials').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return {
    path: data.path,
    fullPath: data.fullPath,
  };
}

/**
 * Download a file from Supabase Storage
 * @param filePath - The file path in storage
 * @returns File blob
 */
export async function downloadFile(filePath: string): Promise<Blob> {
  const { data, error } = await supabase.storage.from('materials').download(filePath);

  if (error) {
    console.error('Error downloading file:', error);
    throw new Error(`Failed to download file: ${error.message}`);
  }

  return data;
}

/**
 * Get a public URL for a file (for display/preview)
 * @param filePath - The file path in storage
 * @returns Public URL
 */
export async function getFileUrl(filePath: string): Promise<string> {
  const { data } = supabase.storage.from('materials').getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param filePath - The file path to delete
 */
export async function deleteFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage.from('materials').remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sanitize file name to prevent path traversal and invalid characters
 * @param fileName - Original file name
 * @returns Sanitized file name
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .slice(0, 255); // Limit length
}

/**
 * Detect material type from MIME type
 * @param mimeType - The file's MIME type
 * @returns Material type
 */
export function detectMaterialType(mimeType: string): MaterialType {
  if (mimeType.startsWith('application/pdf')) return 'pdf';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('image/')) return 'image';
  if (
    mimeType.includes('presentation') ||
    mimeType.includes('powerpoint') ||
    mimeType.includes('slides')
  ) {
    return 'presentation';
  }
  if (mimeType.includes('document') || mimeType.includes('word')) {
    return 'document';
  }
  if (mimeType.includes('text/')) {
    return 'text';
  }
  return 'other';
}

/**
 * Validate file size and type
 * @param file - The file to validate
 * @throws Error if validation fails
 */
export function validateFile(file: File): void {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds 50MB limit. Current size: ${formatFileSize(file.size)}`);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type not supported: ${file.type}`);
  }
}

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Map database row to Material interface
 * @param dbMaterial - Database row
 * @returns Material object
 */
function mapMaterialFromDb(dbMaterial: MaterialDbRow): Material {
  return {
    id: dbMaterial.id,
    userId: dbMaterial.user_id,
    subjectId: dbMaterial.subject_id,
    name: dbMaterial.name,
    fileType: dbMaterial.type,
    mimeType: dbMaterial.mime_type || 'application/octet-stream',
    filePath: dbMaterial.file_path,
    fileSize: dbMaterial.file_size,
    status: dbMaterial.status,
    uploadedAt: dbMaterial.uploaded_at,
    processedAt: dbMaterial.processed_at || null,
    createdAt: dbMaterial.created_at,
    updatedAt: dbMaterial.updated_at,
    thumbnailUrl: dbMaterial.thumbnail_url || null,
    pageCount: dbMaterial.page_count || null,
    durationSeconds: dbMaterial.duration_seconds || null,
    extractedText: dbMaterial.extracted_text || null,
  };
}
