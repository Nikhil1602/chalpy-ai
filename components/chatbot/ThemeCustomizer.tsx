import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FontFamily, ChatbotPosition, LauncherIcon, ThemeCustomizerProps } from '@/types';
import { ChatPreview } from '@/components/chatbot/ChatPreview';
import { Upload, MousePointerClick, MessageSquare, Bot, Sparkles, Headphones, HelpCircle, X } from 'lucide-react';
import { defaultLauncher, fonts, gradientPresets, positions } from '@/lib/constants';

const launcherIcons: { value: LauncherIcon; label: string; icon: React.ReactNode }[] = [
    { value: 'message', label: 'Message', icon: <MessageSquare className="w-4 h-4" /> },
    { value: 'bot', label: 'Bot', icon: <Bot className="w-4 h-4" /> },
    { value: 'sparkles', label: 'Sparkles', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'headphones', label: 'Support', icon: <Headphones className="w-4 h-4" /> },
    { value: 'help', label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
];

export function ThemeCustomizer({ theme, onChange, botName }: ThemeCustomizerProps) {

    const [logoPreview, setLogoPreview] = useState(theme.logoUrl);
    const [launcherLogoPreview, setLauncherLogoPreview] = useState(theme.launcher?.logoUrl || '');
    const launcher = theme.launcher || defaultLauncher;
    const isNoGradient = theme.gradient === 'none';

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                setLogoPreview(url);
                onChange({ ...theme, logoUrl: url });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLauncherLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                setLauncherLogoPreview(url);
                onChange({ ...theme, launcher: { ...launcher, logoUrl: url } });
            };
            reader.readAsDataURL(file);
        }
    };

    const setGradientPreset = (from: string, to: string) => {
        onChange({
            ...theme,
            gradient: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
            gradientFrom: from,
            gradientTo: to,
        });
    };

    const setNoGradient = () => {
        onChange({ ...theme, gradient: 'none', gradientFrom: '', gradientTo: '' });
    };

    const updateCustomGradient = (from: string, to: string) => {
        onChange({
            ...theme,
            gradient: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
            gradientFrom: from,
            gradientTo: to,
        });
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Controls */}
            <div className="space-y-4">
                {/* Colors & Gradient */}
                <Card>

                    <CardHeader>
                        <CardTitle className="text-base">
                            Colors & Gradient
                        </CardTitle>
                        <CardDescription className="text-gray-500">Customize the colors and header gradient of your chatbot</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Background</Label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={theme.backgroundColor} onChange={(e) => onChange({ ...theme, backgroundColor: e.target.value })} className="w-10 h-10 outline-none border-none cursor-pointer shrink-0" />
                                    <Input value={theme.backgroundColor} onChange={(e) => onChange({ ...theme, backgroundColor: e.target.value })} className="font-mono text-gray-500 text-xs h-8" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Text Color</Label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={theme.textColor} onChange={(e) => onChange({ ...theme, textColor: e.target.value })} className="w-10 h-10 outline-none border-none cursor-pointer shrink-0" />
                                    <Input value={theme.textColor} onChange={(e) => onChange({ ...theme, textColor: e.target.value })} className="font-mono text-gray-500 text-xs h-8" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Accent / Header</Label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={theme.headerColor} onChange={(e) => onChange({ ...theme, headerColor: e.target.value, accentColor: e.target.value })} className="w-10 h-10 outline-none border-none cursor-pointer shrink-0" />
                                    <Input value={theme.headerColor} onChange={(e) => onChange({ ...theme, headerColor: e.target.value, accentColor: e.target.value })} className="font-mono text-gray-500 text-xs h-8" />
                                </div>
                            </div>
                        </div>

                        {/* Gradient selection */}
                        <div className="space-y-2">
                            <Label className="text-xs">Header Gradient</Label>
                            <div className="flex flex-wrap gap-2">
                                {/* No gradient */}
                                <button onClick={setNoGradient} className={`w-9 h-9 cursor-pointer bg-transparent rounded-lg border-2 transition-all flex items-center justify-center text-xs font-medium ${isNoGradient ? 'border-white scale-110' : 'border'}`} title="No gradient (solid color)">
                                    <X className="w-3.5 h-3.5 text-white/80" />
                                </button>
                                {/* Presets */}
                                {gradientPresets.map((g, i) => (
                                    <button key={i} onClick={() => setGradientPreset(g.from, g.to)} className={`w-9 h-9 cursor-pointer rounded-lg border-2 transition-all ${!isNoGradient && theme.gradientFrom === g.from && theme.gradientTo === g.to ? 'border-white scale-110 shadow-lg' : 'border-border hover:border-white/50'}`} style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} title={`Gradient ${i + 1}`} />
                                ))}
                            </div>
                            {/* Custom gradient builder */}
                            {!isNoGradient && (
                                <div className="flex items-center gap-2 pt-1">
                                    <Label className="text-xs shrink-0">Custom:</Label>
                                    <input type="color" value={theme.gradientFrom || '#667eea'} onChange={(e) => updateCustomGradient(e.target.value, theme.gradientTo || '#764ba2')} className="w-8 h-8 rounded cursor-pointer" />
                                    <span className="text-xs text-gray-500">→</span>
                                    <input type="color" value={theme.gradientTo || '#764ba2'} onChange={(e) => updateCustomGradient(theme.gradientFrom || '#667eea', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                                    <div className="flex-1 h-7 rounded-sm" style={{ background: theme.gradient }} />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Typography & Shape */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Typography & Shape</CardTitle>
                        <CardDescription className="text-gray-500">Customize the font and border radius of your chatbot</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Font Family</Label>
                                <Select value={theme.fontFamily} onValueChange={(v: FontFamily) => onChange({ ...theme, fontFamily: v })}>
                                    <SelectTrigger className="h-9 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fonts.map((f) => (
                                            <SelectItem key={f.value} value={f.value}>
                                                <span style={{ fontFamily: f.value }}>{f.label}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Border Radius: <span className='text-orange-600'>{theme.borderRadius}px</span></Label>
                                <div className='h-9 flex'>
                                    <Slider value={[theme.borderRadius]} onValueChange={([v]: any) => onChange({ ...theme, borderRadius: v })} min={0} max={32} step={2} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logo & Position */}
                <Card>
                    <CardHeader >
                        <CardTitle className="text-base">Logo & Position</CardTitle>
                        <CardDescription className="text-gray-500">Upload a custom logo and choose where your chatbot appears on the screen</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 w-full flex gap-5">
                        <div className="space-y-2 w-full">
                            <Label>Chat Header Logo</Label>
                            <div className="flex items-center gap-3 flex-wrap">
                                {logoPreview && (
                                    <img src={logoPreview} alt="Logo" className="w-9 h-9 rounded-lg object-contain border border-border" />
                                )}
                                <label className="cursor-pointer">
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                    <Button className='bg-gray-800 text-gray-500' size="sm" asChild>
                                        <span><Upload className="w-3.5 h-3.5 mr-1" /> Upload</span>
                                    </Button>
                                </label>
                                {logoPreview && (
                                    <Button className='hover:text-red-500 text-red-300 cursor-pointer hover:underline' size="sm" onClick={() => { setLogoPreview(''); onChange({ ...theme, logoUrl: '' }); }}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2 w-full">
                            <Label>Widget Position</Label>
                            <Select value={theme.position} onValueChange={(v: ChatbotPosition) => onChange({ ...theme, position: v })}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {positions.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Launcher Button Customization */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MousePointerClick className="w-4 h-4 text-primary" />
                            Launcher Button
                        </CardTitle>
                        <CardDescription className="text-gray-500">Customize the floating button that opens your chatbot</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Button Color</Label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={launcher.backgroundColor} onChange={(e) => onChange({ ...theme, launcher: { ...launcher, backgroundColor: e.target.value } })} className="w-10 h-10 cursor-pointer shrink-0" />
                                    <Input value={launcher.backgroundColor} onChange={(e) => onChange({ ...theme, launcher: { ...launcher, backgroundColor: e.target.value } })} className="font-mono text-gray-500 h-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Roundness: {launcher.borderRadius}%</Label>
                                <div className='h-10 flex'>
                                    <Slider value={[launcher.borderRadius]} onValueChange={([v]: any) => onChange({ ...theme, launcher: { ...launcher, borderRadius: v } })} min={0} max={50} step={5} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Icon Style</Label>
                            <div className="flex flex-wrap gap-2">
                                {launcherIcons.map((item) => (
                                    <button key={item.value} onClick={() => onChange({ ...theme, launcher: { ...launcher, icon: item.value, logoUrl: '' } })} className={`flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all ${launcher.icon === item.value && !launcher.logoUrl ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-gray-800 text-gray-500 bg-gray-900 hover:border-gray-500/50'}`}>
                                        {item.icon}
                                        <span className="hidden sm:inline">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='flex w-full'>

                            <div className="space-y-2 w-full">
                                <Label>Or Upload Custom Icon</Label>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {launcherLogoPreview && (
                                        <img src={launcherLogoPreview} alt="Launcher" className="w-10 h-10 object-contain" />
                                    )}
                                    <label className="cursor-pointer">
                                        <input type="file" accept="image/*" onChange={handleLauncherLogoUpload} className="hidden" />
                                        <Button className='bg-gray-800 text-gray-500' asChild>
                                            <span><Upload className="w-3.5 h-3.5 mr-1" /> Upload</span>
                                        </Button>
                                    </label>
                                    {launcherLogoPreview && (
                                        <Button className='text-red-300 hover:text-red-500 hover:underline cursor-pointer' onClick={() => { setLauncherLogoPreview(''); onChange({ ...theme, launcher: { ...launcher, logoUrl: '' } }); }}>
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>


                            <div className="space-y-2 w-full">
                                <Label>Size: <span className="text-orange-600">{launcher.size}px</span></Label>
                                <div className='h-8 flex'>
                                    <Slider value={[launcher.size]} onValueChange={([v]: any) => onChange({ ...theme, launcher: { ...launcher, size: v } })} min={40} max={72} step={4} />
                                </div>
                            </div>


                        </div>
                        <div className="space-y-2 w-full">
                            <Label>Padding: <span className="text-orange-600">{launcher.padding ?? 12}px</span></Label>
                            <div className='h-8 flex'>
                                <Slider value={[launcher.padding ?? 12]} onValueChange={([v]) => onChange({ ...theme, launcher: { ...launcher, padding: v } })} min={4} max={18} step={2} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-6 self-start">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-3"><div className='w-2 h-2 bg-green-500 rounded-full' />Live Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ChatPreview theme={theme} botName={botName} />
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}