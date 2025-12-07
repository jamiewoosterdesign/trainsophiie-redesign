import { useState, useEffect, useRef } from 'react';

export function useScrollDirection(elementRef) {
    const [scrollDirection, setScrollDirection] = useState("up");
    const lastScrollY = useRef(0);

    useEffect(() => {
        const element = elementRef?.current;
        if (!element) return;

        const handleScroll = () => {
            const currentScrollY = element.scrollTop;
            const diff = currentScrollY - lastScrollY.current;

            // Ignore small scroll movements to prevent jitter - increased threshold
            if (Math.abs(diff) < 20) return;

            // Determine direction with hysteresis
            if (diff > 0 && currentScrollY > 50) {
                // Scrolling down - only if we've scrolled down enough
                setScrollDirection("down");
            } else if (diff < 0) {
                // Scrolling up
                setScrollDirection("up");
            }
            lastScrollY.current = currentScrollY;
        };

        element.addEventListener("scroll", handleScroll);
        return () => element.removeEventListener("scroll", handleScroll);
    }, [elementRef]);

    return scrollDirection;
}
