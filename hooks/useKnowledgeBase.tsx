"use client";

import { MAX_FILE_SIZE } from '@/lib/constants';
import { KnowledgeFile } from '@/types';
import { Ref, useRef, useState } from 'react'
import { File, FileImage, FileText } from 'lucide-react';
import useToast from '@/hooks/useToast';

const useKnowledgeBase = () => {

    const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { showToast } = useToast();

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
            showToast(`${newFiles.length} file(s) added`, "success")
        }

    };

    const removeFile = (id: string) => {

        setKnowledgeFiles(knowledgeFiles.filter((f) => f.id !== id));
        setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });

    };

    const removeSelectedFile = () => {

        setKnowledgeFiles(knowledgeFiles.filter((f) => !selectedIds.has(f.id)));
        setSelectedIds(new Set());
        showToast("Files removed", "success");

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

    return { knowledgeFiles, inputRef, selectedIds, getFileIcon, handleFiles, handleDrop, removeFile, removeSelectedFile, toggleAllFiles, toggleSelectFile }

}

export default useKnowledgeBase