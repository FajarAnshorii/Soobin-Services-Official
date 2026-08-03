import React from 'react';
import { cn } from '@/lib/utils';

interface Logo {
  src: string;
  alt: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
}

interface MarqueeLogoScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  logos: Logo[];
  speed?: 'normal' | 'slow' | 'fast';
}

/**
 * A responsive, self-contained, and infinitely scrolling marquee component.
 * It pauses on hover and uses shadcn/ui theme variables for styling.
 */
const MarqueeLogoScroller = React.forwardRef<HTMLDivElement, MarqueeLogoScrollerProps>(
  ({ title, description, logos, speed = 'normal', className, ...props }, ref) => {
    const durationMap = {
      normal: '25s',
      slow: '50s',
      fast: '12s',
    };
    const animationDuration = durationMap[speed];

    return (
      <>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
        
        <section
          ref={ref}
          aria-label={title || 'AI Partners'}
          className={cn(
            'w-full bg-white text-neutral-900 rounded-3xl border border-neutral-300 overflow-hidden shadow-sm',
            className
          )}
          {...props}
        >
          {/* Header Section (rendered if title or description present) */}
          {(title || description) && (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 pb-4 border-b border-neutral-200">
                {title && (
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-900 uppercase">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-neutral-500 self-start lg:justify-self-end text-xs sm:text-sm font-medium">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Marquee Section */}
          <div
            className="w-full overflow-hidden py-2"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div 
              className="flex w-max items-center gap-6 py-4 pr-6 hover:[animation-play-state:paused] transition-all duration-300 ease-in-out" 
              style={{
                animation: `marquee ${animationDuration} linear infinite`,
              }}
            >
              {/* Render logos 3x to ensure smooth infinite loop on all screen sizes */}
              {[...logos, ...logos, ...logos].map((logo, index) => (
                <div
                  key={index}
                  className="group relative h-20 w-44 shrink-0 flex items-center justify-center rounded-2xl bg-neutral-50 border border-neutral-200 overflow-hidden p-3 transition-all hover:border-neutral-400 shadow-2xs"
                >
                  {/* Gradient background revealed on hover */}
                  <div
                    style={{
                      '--from': logo.gradient.from,
                      '--via': logo.gradient.via,
                      '--to': logo.gradient.to,
                    } as React.CSSProperties}
                    className="absolute inset-0 scale-150 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100 bg-gradient-to-br from-[var(--from)] via-[var(--via)] to-[var(--to)]"
                  />
                  {/* Logo Image */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="relative h-3/4 w-auto object-contain transition-transform group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
);

MarqueeLogoScroller.displayName = 'MarqueeLogoScroller';

export { MarqueeLogoScroller };
