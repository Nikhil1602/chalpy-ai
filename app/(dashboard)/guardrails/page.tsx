"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Shield, Plus, Pencil, Trash2 } from 'lucide-react';
import { useWorkspace } from '@/store/WorkspaceContext';
import { GuardrailRule } from '@/types';
import { useToast } from '@/hooks';
import SidebarContainer from "@/components/layout/SidebarContainer";
import { PageHeader } from '@/components/layout/PageHeader';
import { motion } from "motion/react";
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';

export default function Guardrails() {

    const searchParams = useSearchParams();
    const addGuardrails = searchParams.get("add");

    const { guardrails, addGuardrail, updateGuardrail, deleteGuardrail, isGuardrailLoading } = useWorkspace();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<GuardrailRule | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const { showToast } = useToast();

    const openCreate = () => {

        setEditingRule(null);
        setName('');
        setDescription('');
        setDialogOpen(true);

    };

    const openEdit = (rule: GuardrailRule) => {

        setEditingRule(rule);
        setName(rule.name);
        setDescription(rule.description);
        setDialogOpen(true);

    };

    const handleSave = () => {

        if (!name.trim()) { showToast("Name is required", "error"); return; }
        if (!description.trim()) { showToast("Description is required", "error"); return; }

        if (editingRule) {
            updateGuardrail(editingRule.id, { name: name.trim(), description: description.trim() });
            showToast("Guardrail updated", "success");
        } else {
            addGuardrail({ name: name.trim(), description: description.trim() });
            showToast("Guardrail created", "success");
        }

        setDialogOpen(false);

    };

    const handleDelete = (id: string) => {

        deleteGuardrail(id);
        setDeleteConfirmId(null);

        showToast("Guardrail deleted", "success");
    };

    return (
        <SidebarContainer>

            <PageHeader back={!!addGuardrails} title="Guardrails" description="Manage safety rules for your chatbots">
                <Button disabled={isGuardrailLoading as boolean} onClick={openCreate} className={`${isGuardrailLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-orange-600"} bg-orange-500 text-white`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guardrail
                </Button>
            </PageHeader>

            {isGuardrailLoading ?
                <div className='my-3'>
                    <Skeleton className='h-15 mb-3 w-full bg-gray-800' />
                    <Skeleton className='h-15 mb-3 w-full bg-gray-800' />
                    <Skeleton className='h-15 mb-3 w-full bg-gray-800' />
                </div>
                : <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                    {guardrails.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className='bg-orange-500/20 mb-4 p-2 rounded-lg'>
                                    <Shield className="w-12 h-12 text-orange-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">No guardrails yet</h3>
                                <p className="text-gray-500 mb-4">Create your first safety rule to protect your chatbots.</p>
                                <Button className='bg-orange-500 hover:bg-orange-700 cursor-pointer' onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Create Guardrail</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-3">
                            {guardrails.map((rule) => (
                                <Card key={rule.id} className="group">
                                    <CardContent className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground truncate">{rule.name}</p>
                                                <p className="text-sm text-gray-500 truncate">{rule.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button size="icon" onClick={() => openEdit(rule)} className="h-8 w-8 cursor-pointer bg-blue-500/30 transition-colors duration-150 hover:text-blue-500">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            {deleteConfirmId === rule.id ? (
                                                <div className="flex items-center gap-1">
                                                    <Button className='bg-red-500 cursor-pointer hover:bg-red-600' size="sm" onClick={() => handleDelete(rule.id)}>Delete</Button>
                                                    <Button className='bg-gray-800 cursor-pointer hover:bg-gray-900' size="sm" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                                                </div>
                                            ) : (
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(rule.id)} className="h-8 w-8 hover:text-red-500 text-white cursor-pointer bg-red-500/20">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                </motion.div>}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-gray-300'>{editingRule ? 'Edit Guardrail' : 'New Guardrail'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-gray-400" htmlFor="gr-name">Name <span className='text-red-500'>*</span></Label>
                            <Input className='text-white' id="gr-name" placeholder="e.g., No harmful content" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400" htmlFor="gr-desc">Description <span className='text-red-500'>*</span></Label>
                            <Textarea className='text-white' id="gr-desc" placeholder="Describe what this guardrail does..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className='bg-gray-600 text-white hover:bg-gray-700 cursor-pointer' onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button className='bg-orange-500 hover:bg-orange-700 text-white cursor-pointer' onClick={handleSave}>{editingRule ? 'Update' : 'Create'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </SidebarContainer>
    );

}