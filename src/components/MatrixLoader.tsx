import { useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationPreference } from '@/contexts/AnimationContext';

const MatrixLoader = memo(({ onComplete, duration = 500 }: { onComplete?: () => void, duration?: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { effectiveMode } = useAnimationPreference();

    useEffect(() => {
        if (effectiveMode !== 'full') {
            const timer = window.setTimeout(() => onComplete?.(), Math.min(duration, 600));
            return () => window.clearTimeout(timer);
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Matrix characters - mixing katakana, alphabets, and numbers for authenticity
        const chars = 'アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレゲゼデベペオコソトノホモヨロヲゴゾドボポ1234567890ABCDEF';
        const charArray = chars.split('');

        const fontSize = 16;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);
        let lastFrame = 0;
        const frameInterval = 1000 / 24;

        const draw = (timestamp = 0) => {
            if (timestamp - lastFrame < frameInterval) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }
            lastFrame = timestamp;
            // Semi-transparent black to create trailing effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];

                // Dynamic green gradient for "expensive" look
                const y = drops[i] * fontSize;

                // Head character is white/bright green
                ctx.fillStyle = '#fff';
                ctx.fillText(text, i * fontSize, y);

                // Tail characters are emerald green
                ctx.fillStyle = '#10b981'; // emerald-500
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#10b981';
                ctx.fillText(text, i * fontSize, y - fontSize);

                // Reset shadow for performance
                ctx.shadowBlur = 0;

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        // Timer for completion
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, duration);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timer);
        };
    }, [duration, effectiveMode, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-critical bg-black flex items-center justify-center overflow-hidden"
        >
            {effectiveMode === 'full' ? <canvas ref={canvasRef} className="absolute inset-0 opacity-60" /> : null}

            {/* Central Genesis Logo/Text */}
            <div className="relative z-content flex flex-col items-center gap-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1, type: 'spring' }}
                    className="relative"
                >
                    <div className="absolute -inset-10 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                    <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] text-white italic drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        GENESIS
                    </h1>
                    <div className="mt-2 h-1 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                </motion.div>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-emerald-500 font-mono text-sm tracking-[0.5em] uppercase animate-pulse">
                        System Initialize
                    </p>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                                className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />
        </motion.div>
    );
});

MatrixLoader.displayName = 'MatrixLoader';

export default MatrixLoader;
