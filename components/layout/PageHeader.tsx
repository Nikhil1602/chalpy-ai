import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex items-center justify-between mb-8', className)}
        >
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {description && (
                    <p className="text-gray-500 mt-1">{description}</p>
                )}
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </motion.div>
    );
}