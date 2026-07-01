'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface UseCounterAnimationOptions {
  target: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimalSeparator?: string;
  startOnView?: boolean;
}

export function useCounterAnimation({
  target,
  duration = 2000,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = '.',
  decimalSeparator = ',',
  startOnView = true,
}: UseCounterAnimationOptions) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const isInView = useInView(ref, { once: true, margin: '0px' });
  const shouldAnimate = !startOnView || isInView;

  useEffect(() => {
    if (!shouldAnimate) return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number;
    let animationFrame: number;

    const startAnimation = () => {
      startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime - delay;
        if (elapsed < 0) {
          animationFrame = requestAnimationFrame(animate);
          return;
        }

        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = easeOut * target;

        setCount(current);
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(startAnimation, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [shouldAnimate, target, duration, delay]);

  const formatted = count.toFixed(decimals);
  const [intPart, decPart] = formatted.split('.');

  // Add thousand separators
  const withSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  const displayValue = decimals > 0
    ? `${withSeparator}${decimalSeparator}${decPart}`
    : withSeparator;

  return {
    ref,
    value: count,
    display: `${prefix}${displayValue}${suffix}`,
  };
}
