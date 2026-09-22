import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { FileText, Image, MoreVertical, UploadCloud, Trash2, Download, Loader2, AlertCircle } from 'lucide-react';
import { uploadFile, listFiles, getFileUrl, deleteFile } from '../../../lib/api';

interface FileRow {
  id: string;
  file_name: string;
  size_bytes: number;
  file_type: string;
  storage_path: string;
  created_at: string;
}

const formatFileSize = (size: number) => {
  if (!size) return '-';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getDisplayType = (fileType: string, name: string): 'pdf' | 'image' | 'doc' => {
  if (fileType?.startsWith('image/')) return 'image';
  if (fileType === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) return 'pdf';
  return 'doc';
};

const getIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="w-10 h-10 text-red-500" />;
    case 'image': return <Image className="w-10 h-10 text-purple-500" />;
    default: return <FileText className="w-10 h-10 text-blue-500" />;
  }
};

const FilesPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      const data = await listFiles();
      setFiles((data ?? []) as FileRow[]);
    } catch (e: any) {
      setError(e.message || 'Unable to load files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFiles(); }, []);

  const totalBytes = files.reduce((sum, file) => sum + (file.size_bytes || 0), 0);

  const addFiles = async (incoming: FileList | File[]) => {
    const nextFiles = Array.from(incoming);
    if (nextFiles.length === 0) return;
    setUploading(true);
    setError('');
    try {
      for (const file of nextFiles) await uploadFile(file);
      await loadFiles();
    } catch (e: any) {
      setError(e.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const openFile = async (file: FileRow) => {
    try {
      const url = await getFileUrl(file.storage_path);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setError('Could not open this file.');
    }
  };

  const handleDelete = async (file: FileRow) => {
    try {
      await deleteFile(file.id, file.storage_path);
      setFiles((current) => current.filter((item) => item.id !== file.id));
      setOpenMenuId(null);
    } catch {
      setError('Could not delete this file.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const triggerUpload = () => inputRef.current?.click();

  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary-600" /></div></DashboardLayout>;
  }

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
            <p className="text-sm font-bold text-slate-800">{formatFileSize(totalBytes)}</p>
          </div>
          <button type="button" onClick={triggerUpload} disabled={uploading} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <input ref={inputRef} type="file" className="hidden" multiple onChange={(e) => { if (e.target.files?.length) { addFiles(e.target.files); e.target.value = ''; } }} />
        </div>
      </div>

      {error && <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}

      <div className={`mb-8 border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:bg-slate-50'}`} onClick={triggerUpload} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <UploadCloud className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary-600' : 'text-slate-400'}`} />
        <h3 className="text-lg font-bold text-slate-800">Drag &amp; Drop files here</h3>
        <p className="text-slate-500 mt-1">or click the Upload button above</p>
      </div>

      {files.length === 0 ? <div className="text-center py-12 text-slate-400 text-sm">No files uploaded yet.</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {files.map((file) => {
            const displayType = getDisplayType(file.file_type, file.file_name);
            return <div key={file.id} onClick={() => openFile(file)} className="cursor-pointer bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                {getIcon(displayType)}
                <div className="relative" onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === file.id ? null : file.id); }}>
                  <button type="button" aria-label={`Actions for ${file.file_name}`} className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                  {openMenuId === file.id && <div className="absolute right-0 top-6 bg-white border border-slate-200 shadow-lg rounded-lg p-1 z-10 w-32">
                    <button type="button" onClick={(e) => { e.stopPropagation(); openFile(file); }} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"><Download className="w-3 h-3" /> Download</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(file); }} className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-2"><Trash2 className="w-3 h-3" /> Delete</button>
                  </div>}
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 truncate" title={file.file_name}>{file.file_name}</h4>
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500"><span>{new Date(file.created_at).toLocaleDateString()}</span><span>{formatFileSize(file.size_bytes)}</span></div>
            </div>;
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default FilesPage;
