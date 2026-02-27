// Animation helper utilities

export function useRequestAnimationFrame(callback: () => void, enabled: boolean = true) {
    let rafId: number;

    const tick = () => {
        callback();
        if (enabled) {
            rafId = requestAnimationFrame(tick);
        }
    };

    if (enabled) {
        rafId = requestAnimationFrame(tick);
    }

    return () => {
        if (rafId) cancelAnimationFrame(rafId);
    };
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, amount: number): number {
    return start + (end - start) * amount;
}

// FLIP animation helper (First, Last, Invert, Play)
export interface FLIPState {
    first: DOMRect;
    last: DOMRect;
}

export function getFLIPState(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
}

export function calculateFLIPInvert(first: DOMRect, last: DOMRect) {
    return {
        x: first.left - last.left,
        y: first.top - last.top,
        scaleX: first.width / last.width,
        scaleY: first.height / last.height,
    };
}

// Perlin-like noise for organic movement
export class SimplexNoise {
    private seed: number;

    constructor(seed: number = Math.random()) {
        this.seed = seed;
    }

    // Simplified noise function (not true Perlin, but fast and looks organic)
    noise2D(x: number, y: number): number {
        const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1; // Range: -1 to 1
    }

    noise3D(x: number, y: number, z: number): number {
        const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164 + this.seed) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1;
    }
}

// Easing functions
export const easing = {
    linear: (t: number) => t,
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOut: (t: number) => t * (2 - t),
    easeIn: (t: number) => t * t,
    bounce: (t: number) => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    },
};

// Throttle for performance
export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Debounce for resize events
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
