'use client';

import { useAnimationFrame } from 'framer-motion';
import { useRef } from 'react';
import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
  Logo07,
  Logo08,
} from '@/components/ui/logo-cloud-15-utils/logos';
import { Marquee } from '@/components/ui/logo-cloud-15-utils/marquee';
import { BorderBeam } from '@/components/ui/logo-cloud-15-utils/border-beam';

const BEAM_DURATION = 8; // must match BorderBeam duration prop
const BEAM_SIZE = 100; // must match BorderBeam size prop

const LogoCloud = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const waveSpanRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (!(cardRef.current && textRef.current && waveSpanRef.current)) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }

    // Beam progress: 0–100 along the perimeter, linear, same clock as BorderBeam
    const elapsed = ((time - startTimeRef.current) / 1000) % BEAM_DURATION;
    const beamOffset = (elapsed / BEAM_DURATION) * 100;

    const cardRect = cardRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();

    const W = cardRect.width;
    const H = cardRect.height;
    const perimeter = 2 * (W + H);

    // Text horizontal bounds on the top edge, relative to card left
    const textLeft = Math.max(0, textRect.left - cardRect.left);
    const textRight = Math.min(W, textRect.right - cardRect.left);

    // Convert pixel positions to perimeter percentages
    const textStartPercent = (textLeft / perimeter) * 100;
    const textEndPercent = (textRight / perimeter) * 100;

    const span = waveSpanRef.current;

    if (beamOffset >= textStartPercent && beamOffset <= textEndPercent) {
      const t =
        (beamOffset - textStartPercent) / (textEndPercent - textStartPercent);
      span.style.backgroundPosition = `${95 - t * 90}% center`;
    } else if (beamOffset < textStartPercent) {
      span.style.backgroundPosition = '0% center';
    } else {
      span.style.backgroundPosition = '100% center';
    }
  });

  return (
    <div className="flex w-full items-center justify-center py-6 px-4">
      <div
        className="relative w-full max-w-5xl rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-xl"
        ref={cardRef}
      >
        <BorderBeam
          className="isolate -z-1"
          duration={BEAM_DURATION}
          size={BEAM_SIZE}
          colorFrom="#0f2744"
          colorTo="#3d7ab5"
        />

        <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 items-center justify-center px-6">
          <p
            className="bg-white border border-gray-200 shadow-md rounded-full px-5 py-1.5 text-center font-bold text-gray-900 text-sm sm:text-base tracking-tight"
            ref={textRef}
          >
            <span
              ref={waveSpanRef}
              style={{
                backgroundImage:
                  'linear-gradient(90deg, currentColor 0%, currentColor 45%, #1e4d7b 47%, #3d7ab5 50%, #1e4d7b 53%, currentColor 55%, currentColor 100%)',
                backgroundSize: '250% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundPosition: '0% center',
              }}
            >
              Trusted Unlock Dokumen <span className="max-sm:hidden">Termurah & Tercepat</span>
            </span>
          </p>
        </div>

        <div className="grid">
          <div className="flex min-w-0 items-center justify-center gap-x-10 gap-y-6 p-6 pt-10">
            <Marquee
              className="mask-x-from-75% [--duration:25s]"
              pauseOnHover
            >
              <Logo01 />
              <Logo02 />
              <Logo03 />
              <Logo04 />
              <Logo05 />
              <Logo06 />
              <Logo07 />
              <Logo08 />
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
