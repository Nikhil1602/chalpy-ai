"use client"

import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatSize, getFileExt } from '@/lib/constants';
import { RefreshCw, Trash2, Upload, X } from 'lucide-react';
import { Ref } from 'react';
import SidebarContainer from '@/components/layout/SidebarContainer';
import { useWorkspace } from '@/store/WorkspaceContext';
import { motion } from 'motion/react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const KnowledgeBase = () => {

    const { knowledgeFiles, inputRef, uploadProgress, selectedIds, getFileIcon, handleFiles, handleDrop, removeFile, removeSelectedFile, toggleAllFiles, toggleSelectFile, showLoader } = useWorkspace();

    return (
        <SidebarContainer>
            <PageHeader title="Knowledge Base" description="Manage documents and content for your chatbots">
                {/* <Button className="bg-orange-500 text-white cursor-pointer hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                </Button> */}
            </PageHeader>

            {/* Drop zone */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                <div className={`border-2 border-dashed border-gray-500 rounded-xl p-8 sm:p-12 text-center ${showLoader ? 'cursor-not-allowed' : 'hover:border-orange-500/50 cursor-pointer hover:bg-gray-800/30'} transition-colors`} onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                    <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-foreground mb-1">Upload Documents</h3>
                    <p className="text-sm text-gray-500 mb-3">Drag and drop files or click to browse</p>
                    <Button disabled={showLoader} className={`bg-gray-800 ${showLoader ? "cursor-not-allowed" : "hover:bg-gray-900 cursor-pointer"}`}>Choose Files</Button>
                    <p className="text-xs text-gray-500 mt-3">Supports PDF, TXT, DOCX, CSV, MD — up to 10MB each</p>
                    <input disabled={showLoader} ref={inputRef as Ref<HTMLInputElement>} type="file" multiple className="hidden" accept=".pdf,.txt,.docx,.csv,.md" onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
                </div>

                {showLoader ?
                    <div className='my-3'>
                        <Skeleton className='h-6 w-50 my-3 bg-gray-800' />
                        <Skeleton className='h-15 mb-3 w-full bg-gray-800' />
                        <Skeleton className='h-15 mb-3 w-full bg-gray-800' />
                        <Skeleton className='h-15 mb-3 w-full bg-gray-800' />
                    </div>
                    : knowledgeFiles.length > 0 ? (
                        <div className="my-3">
                            <div className="flex items-center justify-between">
                                <div className="flex h-3 my-3 items-center gap-3">
                                    <Checkbox checked={selectedIds.size === knowledgeFiles.length && knowledgeFiles.length > 0} onCheckedChange={toggleAllFiles} />
                                    <span className="text-sm text-muted-foreground">
                                        {knowledgeFiles.length} file{knowledgeFiles.length !== 1 ? 's' : ''} uploaded
                                        {selectedIds.size > 0 && <span className='text-gray-500'> · {selectedIds.size} selected</span>}
                                    </span>
                                </div>
                                {selectedIds.size > 0 && (
                                    <Button className='text-red-500 cursor-pointer hover:bg-red-500/20' size="sm" onClick={removeSelectedFile}>
                                        <Trash2 className="w-full h-full mr-1.5" /> Remove Selected
                                    </Button>
                                )}
                            </div>

                            <div className="divide-y mt-2 divide-border rounded-lg border overflow-hidden">
                                {knowledgeFiles.map((file) => (
                                    <div key={file.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${selectedIds.has(file.id) ? 'bg-orange-500/5' : 'hover:bg-gray-800/40'}`}>
                                        <Checkbox checked={selectedIds.has(file.id)} onCheckedChange={() => toggleSelectFile(file.id)} />
                                        {getFileIcon(file.type)}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                            {(uploadProgress > 0 && uploadProgress < 100) ?
                                                <Progress className="mt-1" value={55} /> :
                                                <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                                            }
                                        </div>
                                        {(uploadProgress > 0 && uploadProgress < 100) ?
                                            <RefreshCw className="w-4 h-4 animate-spin rotate-180 text-gray-500" />
                                            : <Badge className="text-[10px] bg-gray-700 shrink-0">
                                                {getFileExt(file.name)}
                                            </Badge>}
                                        {!(uploadProgress > 0 && uploadProgress < 100) && <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-gray-500 hover:text-red-500 cursor-pointer" onClick={() => removeFile(file.id)}>
                                            <X className="w-4 h-4" />
                                        </Button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

            </motion.div>

        </SidebarContainer>
    )
}

export default KnowledgeBase