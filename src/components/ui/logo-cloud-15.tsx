'use client';

import { useAnimationFrame } from 'framer-motion';
import { useRef } from 'react';
import {
  LogoNumerade,
  LogoScribd,
  LogoStuDocu,
  LogoSage,
  LogoSlideShare,
  LogoQuizlet,
  LogoCourseHero,
  LogoChegg,
  LogoAcademia,
  LogoBartleby,
} from '@/components/ui/logo-cloud-15-utils/logos';
import { Marquee } from '@/components/ui/logo-cloud-15-utils/marquee';
import { BorderBeam } from '@/components/ui/logo-cloud-15-utils/border-beam';

const BEAM_DURATION = 8; // must match BorderBeam duration prop
const BEAM_SIZE = 120; // must match BorderBeam size prop

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
    <div className="flex w-full items-center justify-center py-6 px-2 sm:px-4">
      <div
        className="relative w-full max-w-5xl rounded-3xl border border-gray-200/80 bg-slate-50/70 backdrop-blur-md shadow-xl overflow-hidden"
        ref={cardRef}
      >
        <BorderBeam
          className="isolate -z-1"
          duration={BEAM_DURATION}
          size={BEAM_SIZE}
          colorFrom="#0f2744"
          colorTo="#3d7ab5"
        />

        <div className="flex flex-col gap-4 py-6 px-2">
          {/* Row 1: Forward */}
          <Marquee className="[--duration:30s] [--gap:1.25rem]" pauseOnHover>
            <LogoNumerade />
            <LogoScribd />
            <LogoStuDocu />
            <LogoSage />
            <LogoSlideShare />
          </Marquee>

          {/* Row 2: Reversed */}
          <Marquee className="[--duration:30s] [--gap:1.25rem]" reverse pauseOnHover>
            <LogoQuizlet />
            <LogoCourseHero />
            <LogoChegg />
            <LogoAcademia />
            <LogoBartleby />
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
