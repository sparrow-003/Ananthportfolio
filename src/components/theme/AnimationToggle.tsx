import { Zap, ZapOff, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useAnimationPreference } from '@/contexts/AnimationContext';

export function AnimationToggle() {
    const { userPreference, setUserPreference, effectiveMode, reducedMotion } = useAnimationPreference();

    const getIcon = () => {
        if (effectiveMode === 'off') return <ZapOff className="h-[1.2rem] w-[1.2rem]" />;
        if (effectiveMode === 'reduced') return <Minimize2 className="h-[1.2rem] w-[1.2rem]" />;
        return <Zap className="h-[1.2rem] w-[1.2rem]" />;
    };

    const getLabel = () => {
        if (effectiveMode === 'off') return 'Animations Off';
        if (effectiveMode === 'reduced') return 'Reduced Motion';
        return 'Full Animations';
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full border border-primary/20 bg-background/50 hover:bg-primary/10 hover:text-primary transition-colors"
                    aria-label={`Toggle animations - Current: ${getLabel()}`}
                >
                    {getIcon()}
                    <span className="sr-only">Toggle animations</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover/95 border-primary/20 backdrop-blur-lg w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Animation Preference
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => setUserPreference('full')}
                    className={`cursor-pointer focus:bg-primary/10 focus:text-primary ${userPreference === 'full' ? 'bg-primary/5 text-primary' : ''
                        }`}
                >
                    <Zap className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                        <span>Full Effects</span>
                        <span className="text-xs text-muted-foreground">All 3D animations enabled</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setUserPreference('reduced')}
                    className={`cursor-pointer focus:bg-primary/10 focus:text-primary ${userPreference === 'reduced' ? 'bg-primary/5 text-primary' : ''
                        }`}
                >
                    <Minimize2 className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                        <span>Reduced Motion</span>
                        <span className="text-xs text-muted-foreground">Minimal, subtle effects</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setUserPreference('off')}
                    className={`cursor-pointer focus:bg-primary/10 focus:text-primary ${userPreference === 'off' ? 'bg-primary/5 text-primary' : ''
                        }`}
                >
                    <ZapOff className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                        <span>Disable All</span>
                        <span className="text-xs text-muted-foreground">No animations</span>
                    </div>
                </DropdownMenuItem>

                {reducedMotion && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                            ⚠️ System prefers reduced motion
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
