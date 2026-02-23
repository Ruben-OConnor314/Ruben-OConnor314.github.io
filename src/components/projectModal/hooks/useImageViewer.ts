import { useRef } from "react";
import {
    useMotionValue,
    useSpring,
} from "framer-motion";

export function useImageViewer() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const zoom = useMotionValue(1);

    const smoothZoom = useSpring(zoom, {
        stiffness: 200,
        damping: 25,
    });

    const smoothX = useSpring(x, {
        stiffness: 200,
        damping: 25,
    });

    const smoothY = useSpring(y, {
        stiffness: 200,
        damping: 25,
    });

    const velocityRef = useRef({ vx: 0, vy: 0 });
    const inertiaRef = useRef<number | null>(null);

    const resetView = () => {
        if (inertiaRef.current)
            cancelAnimationFrame(inertiaRef.current);

        zoom.set(1);
        x.set(0);
        y.set(0);
    };

    return {
        smoothZoom,
        smoothX,
        smoothY,
        zoom,
        x,
        y,
        resetView,
        velocityRef,
        inertiaRef,
    };
}