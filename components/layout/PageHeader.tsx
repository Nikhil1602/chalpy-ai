import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { PageHeaderProps } from '@/types';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PageHeader({ title, description, children, className, back = false }: PageHeaderProps) {

    const router = useRouter();

    if (back) {

        return (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={cn('flex items-center justify-between mb-8', className)}>
                <div className='flex items-center gap-3'>
                    <Button onClick={() => router.back()} className='bg-gray-800 cursor-pointer hover:bg-gray-900 text-white' size="icon">
                        <ArrowLeft className="w-8 h-8" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                        {description && (<p className="text-gray-500 text-sm">{description}</p>)}
                    </div>
                </div>
                {children && <div className="flex items-center gap-3">{children}</div>}
            </motion.div>
        );

    }

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={cn('flex items-center justify-between mb-8', className)}>
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {description && (<p className="text-gray-500 mt-1">{description}</p>)}
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </motion.div>
    );

}