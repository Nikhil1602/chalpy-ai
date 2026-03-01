import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: LucideIcon;
    index?: number;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, index = 0 }: StatCardProps) {

    const changeColors = {
        positive: 'text-emerald-500',
        negative: 'text-red-500',
        neutral: 'text-muted-foreground',
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{title}</p>
                            <p className="text-3xl font-bold text-foreground">{value}</p>
                            {change && (
                                <p className={cn('text-sm mt-1', changeColors[changeType])}>
                                    {change}
                                </p>
                            )}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}