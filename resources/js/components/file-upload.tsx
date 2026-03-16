import { X, ImagePlus, FileText, FileImage, FileVideo, File as FileIcon } from 'lucide-react';
import React, { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';

import { cn } from '@/lib/utils';

const FILE_TYPE_ICONS = {
    'application/pdf': FileText,
    'text/csv': FileText,
    'application/vnd.ms-excel': FileText,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileText,
    'application/msword': FileText,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
    'text/plain': FileText,
    'image': FileImage,
    'video': FileVideo,
    'default': FileIcon,
};

interface ExistingFile {
    id: number | string;
    path: string;
    url: string;
    mime_type: string;
    name?: string;
    size?: number;
}

interface FilePreview {
    file: File;
    preview: string;
    type: 'image' | 'video' | 'other';
}

interface FileUploadProps {
    value?: File | File[] | null;
    onChange: (files: File | File[] | null) => void;
    existingFiles?: ExistingFile[];
    onRemoveExisting?: (fileId: number | string) => void;
    multiple?: boolean;
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
    disabled?: boolean;
    className?: string;
    innerClassName?: string;
    error?: string;
    required?: boolean;
}

export default function FileUpload({
    value,
    onChange,
    existingFiles = [],
    onRemoveExisting,
    multiple = false,
    accept,
    maxSize = 10,
    maxFiles,
    disabled = false,
    className,
    innerClassName,
    error,
    required = false,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Build flat slides array for all images and videos (existing first, then new)
    const lightboxSlides = [
        ...existingFiles
            .filter(f => f.mime_type.startsWith('image/') || f.mime_type.startsWith('video/'))
            .map(f =>
                f.mime_type.startsWith('video/')
                    ? { type: 'video' as const, sources: [{ src: f.url, type: f.mime_type }] }
                    : { src: f.url, alt: f.name ?? f.path.split('/').pop() ?? '' }
            ),
        ...filePreviews
            .filter(p => p.type === 'image' || p.type === 'video')
            .map(p =>
                p.type === 'video'
                    ? { type: 'video' as const, sources: [{ src: p.preview, type: p.file.type }] }
                    : { src: p.preview, alt: p.file.name }
            ),
    ];

    const openLightbox = (source: 'existing' | 'new', localIndex: number) => {
        const existingMediaCount = existingFiles.filter(f =>
            f.mime_type.startsWith('image/') || f.mime_type.startsWith('video/')
        ).length;

        const slideIndex =
            source === 'existing'
                ? localIndex
                : existingMediaCount + localIndex;

        setLightboxIndex(slideIndex);
        setLightboxOpen(true);
    };

    const createFilePreview = (file: File): Promise<FilePreview> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                let type: 'image' | 'video' | 'other' = 'other';
                if (file.type.startsWith('image/')) type = 'image';
                else if (file.type.startsWith('video/')) type = 'video';
                resolve({ file, preview: result, type });
            };
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                reader.readAsDataURL(file);
            } else {
                resolve({ file, preview: '', type: 'other' });
            }
        });
    };

    const processFiles = async (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => file.size / (1024 * 1024) <= maxSize);

        if (validFiles.length !== fileArray.length) {
            alert(`Some files exceed the ${maxSize}MB size limit and were not added.`);
        }

        let filesToProcess = validFiles;
        if (maxFiles && !multiple) {
            filesToProcess = validFiles.slice(0, 1);
        } else if (maxFiles) {
            const currentCount =
                (Array.isArray(value) ? value.length : value ? 1 : 0) + existingFiles.length;
            const remaining = maxFiles - currentCount;
            filesToProcess = validFiles.slice(0, remaining);
            if (validFiles.length > remaining) {
                alert(`Maximum ${maxFiles} files allowed. Only first ${remaining} files were added.`);
            }
        }

        const previews = await Promise.all(filesToProcess.map(createFilePreview));

        if (multiple) {
            const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
            setFilePreviews(prev => [...prev, ...previews]);
            onChange([...currentFiles, ...filesToProcess]);
        } else {
            setFilePreviews(previews);
            onChange(filesToProcess[0] || null);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) processFiles(e.target.files);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (!disabled && e.dataTransfer.files) processFiles(e.dataTransfer.files);
    };

    const handleRemoveFile = (index: number) => {
        if (multiple) {
            const currentFiles = Array.isArray(value) ? value : [];
            const newFiles = currentFiles.filter((_, i) => i !== index);
            setFilePreviews(prev => prev.filter((_, i) => i !== index));
            onChange(newFiles.length > 0 ? newFiles : null);
        } else {
            setFilePreviews([]);
            onChange(null);
        }
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return FILE_TYPE_ICONS['image'];
        if (mimeType.startsWith('video/')) return FILE_TYPE_ICONS['video'];
        return FILE_TYPE_ICONS[mimeType as keyof typeof FILE_TYPE_ICONS] ?? FILE_TYPE_ICONS['default'];
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const showUploadArea =
        (!multiple && filePreviews.length === 0 && existingFiles.length === 0) ||
        (multiple && (!maxFiles || filePreviews.length + existingFiles.length < maxFiles));

    useEffect(() => {
        if (!value) {
            setFilePreviews([]);
        } else if (!multiple && value instanceof File && filePreviews.length === 0) {
            createFilePreview(value).then(preview => setFilePreviews([preview]));
        }
    }, [value]);

    // Running counter for existing media (images + videos) to get correct slide index
    let existingMediaCounter = -1;

    return (
        <div className={cn('w-full', className)}>

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={lightboxSlides}
                index={lightboxIndex}
                plugins={[Zoom, Video]}
                zoom={{ maxZoomPixelRatio: 4 }}
            />

            {/* Upload Area */}
            {showUploadArea && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={cn(
                        'border-2 rounded-lg transition-all cursor-pointer border-input',
                        'hover:border-primary hover:bg-primary/10',
                        'dark:border-gray-700 dark:hover:border-primary',
                        isDragging && 'border-primary bg-accent/50 scale-[1.02]',
                        disabled && 'opacity-50 cursor-not-allowed',
                        error && 'border-red-500',
                        !multiple && filePreviews.length === 0 ? 'p-12' : 'p-6',
                        innerClassName
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        multiple={multiple}
                        accept={accept}
                        disabled={disabled}
                        className="hidden"
                        required={required}
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                        {/* <ImagePlus className="h-5 w-5 text-input" /> */}
                        <span className="text-xl text-[#110304B8] font-medium">
                            Add Photo
                        </span>
                    </div>
                </div>
            )}

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

            {/* Preview Section */}
            {(existingFiles.length > 0 || filePreviews.length > 0) && (
                <div className={cn(
                    'border-2 border-primary rounded-lg p-1',
                    'dark:border-gray-700',
                    error && 'border-red-500'
                )}>

                    {/* Existing Files */}
                    {existingFiles.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                Existing Files
                            </h3>
                            <div className={cn(
                                'grid gap-4',
                                multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
                            )}>
                                {existingFiles.map((file) => {
                                    const isImage = file.mime_type.startsWith('image/');
                                    const isVideo = file.mime_type.startsWith('video/');
                                    const Icon = getFileIcon(file.mime_type);

                                    if (isImage || isVideo) existingMediaCounter++;
                                    const mediaIndex = existingMediaCounter;

                                    return (
                                        <div
                                            key={file.id}
                                            className="relative group border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            <div className="aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                                {isImage ? (
                                                    <img
                                                        src={file.url}
                                                        alt={file.name || 'File'}
                                                        className="w-full h-full object-cover cursor-zoom-in"
                                                        onClick={() => openLightbox('existing', mediaIndex)}
                                                    />
                                                ) : isVideo ? (
                                                    <video
                                                        src={file.url}
                                                        className="w-full h-full object-cover cursor-pointer"
                                                        onClick={() => openLightbox('existing', mediaIndex)}
                                                    />
                                                ) : (
                                                    <Icon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                                                )}
                                            </div>

                                            <div className="p-2">
                                                <p className="text-xs font-medium truncate dark:text-gray-200">
                                                    {file.name || file.path.split('/').pop()}
                                                </p>
                                                {file.size && (
                                                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                )}
                                            </div>

                                            {onRemoveExisting && (
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveExisting(file.id)}
                                                    className={cn(
                                                        'absolute top-2 right-2 p-1.5 rounded-full',
                                                        'bg-red-500 text-white opacity-0 group-hover:opacity-100',
                                                        'transition-opacity hover:bg-red-600'
                                                    )}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* New Files */}
                    {filePreviews.length > 0 && (
                        <div>
                            {existingFiles.length > 0 && (
                                <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                    New Files
                                </h3>
                            )}
                            <div className={cn(
                                'grid gap-4',
                                multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
                            )}>
                                {filePreviews.map((preview, index) => {
                                    const Icon = getFileIcon(preview.file.type);

                                    // Image-only index offset for new media
                                    const newMediaIndex = filePreviews
                                        .slice(0, index)
                                        .filter(p => p.type === 'image' || p.type === 'video').length;

                                    return (
                                        <div
                                            key={index}
                                            className="relative group border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            <div className="aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                                {preview.type === 'image' ? (
                                                    <img
                                                        src={preview.preview}
                                                        alt={preview.file.name}
                                                        className="w-full h-full object-cover cursor-zoom-in"
                                                        onClick={() => openLightbox('new', newMediaIndex)}
                                                    />
                                                ) : preview.type === 'video' ? (
                                                    <video
                                                        src={preview.preview}
                                                        className="w-full h-full object-cover cursor-pointer"
                                                        onClick={() => openLightbox('new', newMediaIndex)}
                                                    />
                                                ) : (
                                                    <Icon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                                                )}
                                            </div>

                                            <div className="p-2">
                                                <p className="text-xs font-medium truncate dark:text-gray-200">
                                                    {preview.file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground dark:text-gray-400">
                                                    {formatFileSize(preview.file.size)}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className={cn(
                                                    'absolute top-2 right-2 p-1.5 rounded-full',
                                                    'bg-red-500 text-white opacity-0 group-hover:opacity-100',
                                                    'transition-opacity hover:bg-red-600'
                                                )}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}