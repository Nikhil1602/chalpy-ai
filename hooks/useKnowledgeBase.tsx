"use client";

import { MAX_FILE_SIZE } from '@/lib/constants';
import { KnowledgeFile } from '@/types';
import { useRef, useState, useEffect } from 'react'
import { File, FileImage, FileText } from 'lucide-react';
import useToast from '@/hooks/useToast';
import axios from 'axios';

const useKnowledgeBase = (workspaceId: string = "") => {

    const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<Set<string>>(new Set());
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { showToast } = useToast();

    const loadFiles = async () => {

        try {

            setShowLoader(true);
            const resp = await axios.get(`/api/knowledge/files?workspaceId=${workspaceId}`);

            if (!resp.data.success) return;

            setKnowledgeFiles(resp.data.files);

        } catch (error) {

            console.error("Failed to load files", error);

        } finally {

            setShowLoader(false);

        }

    };

    const getSelectiveFiles = async (ids: string[]) => {

        try {

            setShowLoader(true);
            const reqBody = { knowledgeIds: ids }
            const resp = await axios.post(`/api/knowledge/files?workspaceId=${workspaceId}`, reqBody);

            if (!resp.data.success) return [];

            return resp.data.files;

        } catch (error) {

            console.error("Failed to load files", error);

        } finally {

            setShowLoader(false);

        }

        return [];


    };

    useEffect(() => {
        workspaceId !== "" && loadFiles();
    }, []);

    const uploadFiles = async (fileList: FileList) => {

        try {

            const formData = new FormData();

            Array.from(fileList).forEach((file) => {
                formData.append("files", file);
            });

            formData.append("workspaceId", workspaceId);

            setShowLoader(true);

            const resp = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    console.log("Upload progress:", percent);
                    setUploadProgress(percent);
                },
            });

            const result = resp.data;

            if (!result.success) {
                showToast("Upload failed", "error");
                return;
            }

            loadFiles();
            showToast("Files uploaded successfully", "success");

        } catch (error) {

            console.error("Upload error:", error);
            showToast("File upload failed", "error");

        } finally {

            setShowLoader(false);

        }

    };

    const deleteFiles = async (id: string | string[]) => {

        const ids = typeof id === "string" ? [id] : id;

        const previousFiles = [...knowledgeFiles];

        try {

            setShowLoader(true);

            const resp = await axios.post("/api/upload/delete", { fileIds: [...ids] });

            if (!resp.data.success) {

                setKnowledgeFiles(previousFiles);
                showToast("Failed to delete files", "error");
                return;

            }

            showToast(ids.length === 1 ? "File deleted successfully" : "Files deleted successfully", "success");

        } catch (error) {

            console.error("Delete error:", error);

            setKnowledgeFiles(previousFiles);
            showToast("File deletion failed", "error");

        } finally {

            setShowLoader(false);

        }

    };

    const handleFiles = (fileList: FileList | null) => {

        if (!fileList) return;
        const newFiles: KnowledgeFile[] = [];
        const errors: string[] = [];

        Array.from(fileList).forEach((f) => {

            if (f.size > MAX_FILE_SIZE) {
                errors.push(`${f.name} exceeds 10MB limit`);
                return;
            }

            if (knowledgeFiles.some((ef) => ef.name === f.name && ef.size === f.size)) {
                errors.push(`${f.name} already added`);
                return;
            }

            newFiles.push({
                id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: f.name,
                size: f.size,
                type: f.type,
            });

        });

        if (errors.length) showToast(errors.join(', '), "error");
        if (newFiles.length) {
            setKnowledgeFiles([...knowledgeFiles, ...newFiles]);
            // showToast(`${newFiles.length} file(s) added`, "success");
            uploadFiles(fileList);
        }

    };

    const removeFile = async (id: string) => {

        await deleteFiles(id);
        setKnowledgeFiles(knowledgeFiles.filter((f) => f.id !== id));
        setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });

    };

    const removeSelectedFile = async () => {

        await deleteFiles(knowledgeFiles.filter((f) => selectedIds.has(f.id)).map((x: any) => x.id));

        setKnowledgeFiles(knowledgeFiles.filter((f) => !selectedIds.has(f.id)));
        setSelectedIds(new Set());

    };

    const toggleSelectFile = (id: string) => {

        setSelectedIds((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id); else n.add(id);
            return n;
        });

    };

    const toggleAllFiles = () => {

        if (selectedIds.size === knowledgeFiles.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(knowledgeFiles.map((f) => f.id)));

    };

    function getFileIcon(type: string) {
        if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
        if (type.includes('image')) return <FileImage className="w-5 h-5 text-blue-500" />;
        return <File className="w-5 h-5 text-muted-foreground" />;
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const toggleSelectKnowledgeFile = (id: string) => {

        setSelectedKnowledgeIds((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id); else n.add(id);
            return n;
        });

    };

    return { knowledgeFiles, inputRef, selectedIds, uploadProgress, getSelectiveFiles, showLoader, selectedKnowledgeIds, toggleSelectKnowledgeFile, getFileIcon, handleFiles, handleDrop, removeFile, removeSelectedFile, toggleAllFiles, toggleSelectFile }

}

export default useKnowledgeBase