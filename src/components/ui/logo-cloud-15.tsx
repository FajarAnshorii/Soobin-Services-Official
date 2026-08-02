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
  LogoIEEE,
  LogoCambridge,
  LogoResearchGate,
  LogoWiley,
  LogoEmerald,
} from '@/components/ui/logo-cloud-15-utils/logos';
import { Marquee } from '@/components/ui/logo-cloud-15-utils/marquee';
import { BorderBeam } from '@/components/ui/logo-cloud-15-utils/border-beam';

const BEAM_DURATION = 8; // must match BorderBeam duration prop
const BEAM_SIZE = 120; // must match BorderBeam size prop

const LogoCloud = () => {
  const cardRef = useRef<HTMLDivElement>(null);

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

        <div className="flex flex-col gap-4 py-7 px-2">
          {/* Row 1: Forward */}
          <Marquee className="[--duration:35s] [--gap:1.25rem]" pauseOnHover>
            <LogoNumerade />
            <LogoScribd />
            <LogoStuDocu />
            <LogoSage />
            <LogoSlideShare />
            <LogoIEEE />
            <LogoCambridge />
          </Marquee>

          {/* Row 2: Reversed */}
          <Marquee className="[--duration:35s] [--gap:1.25rem]" reverse pauseOnHover>
            <LogoQuizlet />
            <LogoCourseHero />
            <LogoChegg />
            <LogoAcademia />
            <LogoBartleby />
            <LogoResearchGate />
            <LogoWiley />
            <LogoEmerald />
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
