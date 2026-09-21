import React, { useRef, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Folder, FileText, Image, MoreVertical, UploadCloud, Trash2, Download } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'folder' | 'pdf' | 'image' | 'doc';
  date: string;
  source?: File;
}

const FilesPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'Pitch Deck.pdf', size: '2.4 MB', type: 'pdf', date: 'Oct 12, 2024' },
    { id: '2', name: 'Logo Assets', size: '-', type: 'folder', date: 'Oct 10, 2024' },
    { id: '3', name: 'App Mockup_v2.png', size: '4.1 MB', type: 'image', date: 'Oct 08, 2024' },
    { id: '4', name: 'Market Research.docx', size: '1.2 MB', type: 'doc', date: 'Oct 05, 2024' },
  ]);

  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileType = (name: string): FileItem['type'] => {
    const lower = name.toLowerCase();
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.gif') || lower.endsWith('.webp')) return 'image';
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'doc';
    return 'doc';
  };

  const addFiles = (incomingFiles: FileList | File[]) => {
    const nextFiles = Array.from(incomingFiles);
    if (nextFiles.length === 0) return;

    const mappedFiles: FileItem[] = nextFiles.map((file) => ({
      id: `${Date.now()}-${file.name}-${Math.random().toString(16).slice(2)}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name),
      date: 'Just now',
      source: file,
    }));

    setFiles((currentFiles) => [...mappedFiles, ...currentFiles]);
  };

  const openFile = (file: FileItem) => {
    const previewText = [
      `Document: ${file.name}`,
      `Created: ${file.date}`,
      '',
      'This is a preview of the selected file.',
      'The file can be opened in a browser tab for quick review.',
      '',
      'In a real app, this would render the actual document content or PDF file.',
    ].join('\n');

    const previewBlob = file.source
      ? file.source
      : new Blob([previewText], { type: file.type === 'image' ? 'image/png' : 'text/plain' });

    const previewUrl = file.source ? URL.createObjectURL(file.source) : URL.createObjectURL(previewBlob);

    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  const deleteFile = (id: string) => {
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return <Folder className="w-10 h-10 text-blue-400" fill="currentColor" fillOpacity={0.2} />;
      case 'pdf': return <FileText className="w-10 h-10 text-red-500" />;
      case 'image': return <Image className="w-10 h-10 text-purple-500" />;
      case 'doc': return <FileText className="w-10 h-10 text-blue-500" />;
      default: return <FileText className="w-10 h-10 text-slate-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">File Storage</h1>
          <p className="text-slate-500 mt-1">Manage your project assets and documents.</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500 font-medium">Storage Used</p>
                <p className="text-sm font-bold text-slate-800">2.1 GB / 10 GB</p>
            </div>
            <button
                type="button"
                onClick={triggerUpload}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
                <UploadCloud className="w-5 h-5" /> Upload
            </button>
            <input
                ref={inputRef}
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        addFiles(e.target.files);
                        e.target.value = '';
                    }
                }}
            />
        </div>
      </div>

      {/* Drag Drop Zone */}
      <div
        className={`mb-8 border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:bg-slate-50'
        }`}
        onClick={triggerUpload}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary-600' : 'text-slate-400'}`} />
        <h3 className="text-lg font-bold text-slate-800">Drag & Drop files here</h3>
        <p className="text-slate-500 mt-1">or click the Upload button above</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {files.map((file) => (
            <div
                key={file.id}
                onClick={() => openFile(file)}
                className="cursor-pointer bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative"
            >
                <div className="flex justify-between items-start mb-4">
                    {getIcon(file.type)}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button className="text-slate-400 hover:text-slate-600">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        {/* Simple Hover Menu Simulation */}
                        <div className="absolute right-0 top-6 bg-white border border-slate-200 shadow-lg rounded-lg p-1 hidden group-hover:block z-10 w-32">
                             <button className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2">
                                <Download className="w-3 h-3" /> Download
                             </button>
                             <button
                                onClick={() => deleteFile(file.id)}
                                className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                             >
                                <Trash2 className="w-3 h-3" /> Delete
                             </button>
                        </div>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-900 truncate" title={file.name}>{file.name}</h4>
                <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                    <span>{file.date}</span>
                    <span>{file.size}</span>
                </div>
            </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default FilesPage;