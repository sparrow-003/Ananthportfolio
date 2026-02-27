// Device capability detection for progressive enhancement

export interface DeviceCapabilities {
    webGL: boolean;
    gpuTier: 'low' | 'mid' | 'high';
    reducedMotion: boolean;
    deviceMemory: number;
    hardwareConcurrency: number;
    isMobile: boolean;
    isLowPower: boolean;
}

function detectWebGL(): boolean {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    } catch {
        return false;
    }
}

function detectGPUTier(): 'low' | 'mid' | 'high' {
    const memory = (navigator as any).deviceMemory || 4;
    const concurrency = navigator.hardwareConcurrency || 2;

    // Low tier: <4GB RAM or <=2 cores
    if (memory < 4 || concurrency <= 2) return 'low';

    // High tier: >=8GB RAM and >=6 cores
    if (memory >= 8 && concurrency >= 6) return 'high';

    // Mid tier: everything else
    return 'mid';
}

function detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function detectLowPower(): boolean {
    // Check if battery API indicates low power mode
    return new Promise<boolean>((resolve) => {
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                resolve(battery.charging === false && battery.level < 0.2);
            }).catch(() => resolve(false));
        } else {
            resolve(false);
        }
    }).then(r => r).catch(() => false) as unknown as boolean;
}

export function getDeviceCapabilities(): DeviceCapabilities {
    return {
        webGL: detectWebGL(),
        gpuTier: detectGPUTier(),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        deviceMemory: (navigator as any).deviceMemory || 4,
        hardwareConcurrency: navigator.hardwareConcurrency || 2,
        isMobile: detectMobile(),
        isLowPower: false, // Sync fallback, async check happens separately
    };
}

export function shouldUseWebGL(capabilities?: DeviceCapabilities): boolean {
    const caps = capabilities || getDeviceCapabilities();
    return caps.webGL &&
        caps.gpuTier !== 'low' &&
        !caps.reducedMotion &&
        !caps.isMobile;
}

export function shouldUseCanvas(capabilities?: DeviceCapabilities): boolean {
    const caps = capabilities || getDeviceCapabilities();
    return caps.gpuTier !== 'low' && !caps.reducedMotion;
}

export function getRecommendedParticleCount(capabilities?: DeviceCapabilities): number {
    const caps = capabilities || getDeviceCapabilities();

    if (caps.gpuTier === 'low' || caps.isMobile) return 8;
    if (caps.gpuTier === 'mid') return 20;
    return 50; // high tier
}
