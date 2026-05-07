'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, Shield, FileText, Zap, CheckCircle } from 'lucide-react';

const benefits = [
  { icon: Zap, text: 'Proses Ngebut' },
  { icon: RefreshCw, text: 'Garansi Revisi' },
  { icon: FileText, text: 'Files Berupa PDF & Word' },
  { icon: CheckCircle, text: 'Pengerjaan Manual' },
];

// Multiple demo pairs to cycle through
const demoPairs = [
  {
    original: '"Metode penelitian ini menggunakan pendekatan kuantitatif untuk menganalisis data yang diperoleh dari survei responden..."',
    paraphrased: '"Teknik pengumpulan data ini menerapkan strategi kuantitatif dalam mengolah informasi yang dikumpulkan melalui penyebaran kuesioner kepada sampel penelitian..."',
    similarityOriginal: '78%',
    similarityParaphrased: '12%',
  },
  {
    original: '"Pemanasan global menyebabkan peningkatan suhu rata-rata bumi yang berdampak pada perubahan iklim ekstrem di berbagai wilayah..."',
    paraphrased: '"Kenaikan suhu rata-rata planet akibat pemanasan global membawa pengaruh signifikan terhadap perubahan cuaca drastis di sejumlah wilayah..."',
    similarityOriginal: '85%',
    similarityParaphrased: '9%',
  },
  {
    original: '"Teknologi informasi telah mengubah cara manusia berkomunikasi dan mengakses informasi di era digital saat ini..."',
    paraphrased: '"Perkembangan teknologi informasi telah mentransformasi pola komunikasi serta cara masyarakat dalam memperoleh berbagai informasi secara digital..."',
    similarityOriginal: '72%',
    similarityParaphrased: '11%',
  },
];

export default function ParafraseSection() {
  const [pairIndex, setPairIndex] = useState(0);
  const [origText, setOrigText] = useState('');
  const [paraText, setParaText] = useState('');
  const [showOrigCursor, setShowOrigCursor] = useState(true);
  const [showParaCursor, setShowParaCursor] = useState(true);
  const [simOrigVisible, setSimOrigVisible] = useState(false);
  const [simParaVisible, setSimParaVisible] = useState(false);
  const [isReadyToCycle, setIsReadyToCycle] = useState(false);

  const origIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const paraIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pair = demoPairs[pairIndex];

  // Calculate minimum time needed for current pair
  const pairDuration =
    400 + // initial delay
    (pair.original.length * 30) + // type original
    600 + // pause before paraphrased
    (pair.paraphrased.length * 30) + // type paraphrased
    2000; // hold after done

  // Start typing logic
  const startTyping = () => {
    setOrigText('');
    setParaText('');
    setSimOrigVisible(false);
    setSimParaVisible(false);
    setIsReadyToCycle(false);

    if (origIntervalRef.current) clearInterval(origIntervalRef.current);
    if (paraIntervalRef.current) clearInterval(paraIntervalRef.current);

    let i = 0;
    origIntervalRef.current = setInterval(() => {
      if (i < pair.original.length) {
        setOrigText(pair.original.slice(0, i + 1));
        i++;
      } else {
        if (origIntervalRef.current) clearInterval(origIntervalRef.current);
        setSimOrigVisible(true);
        setShowOrigCursor(false);

        // Start paraphrased after pause
        setTimeout(() => {
          let j = 0;
          paraIntervalRef.current = setInterval(() => {
            if (j < pair.paraphrased.length) {
              setParaText(pair.paraphrased.slice(0, j + 1));
              j++;
            } else {
              if (paraIntervalRef.current) clearInterval(paraIntervalRef.current);
              setSimParaVisible(true);
              setShowParaCursor(false);
              setIsReadyToCycle(true);
            }
          }, 30);
        }, 600);
      }
    }, 30);
  };

  // Start on mount and pair change
  useEffect(() => {
    startTyping();
    return () => {
      if (origIntervalRef.current) clearInterval(origIntervalRef.current);
      if (paraIntervalRef.current) clearInterval(paraIntervalRef.current);
    };
  }, [pairIndex]);

  // Cycle to next pair ONLY when ready and after hold time
  useEffect(() => {
    if (!isReadyToCycle) return;

    cycleTimerRef.current = setTimeout(() => {
      setPairIndex((prev) => (prev + 1) % demoPairs.length);
    }, 2000); // hold completed state for 2 seconds before cycling

    return () => {
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    };
  }, [isReadyToCycle]);

  // Blinking cursor - original
  useEffect(() => {
    const hasStarted = origText.length > 0;
    const isDone = origText.length >= pair.original.length;

    if (isDone) {
      setShowOrigCursor(false);
      return;
    }

    if (hasStarted) {
      const blink = setInterval(() => setShowOrigCursor((p) => !p), 400);
      return () => clearInterval(blink);
    }
  }, [origText, pair.original.length]);

  // Blinking cursor - paraphrased
  useEffect(() => {
    const hasStarted = paraText.length > 0;
    const isDone = paraText.length >= pair.paraphrased.length;

    if (isDone) {
      setShowParaCursor(false);
      return;
    }

    if (hasStarted) {
      const blink = setInterval(() => setShowParaCursor((p) => !p), 400);
      return () => clearInterval(blink);
    }
  }, [paraText, pair.paraphrased.length]);

  return (
    <section id="parafrase" className="bg-dark-800 section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary-600/20 text-primary-400 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
              Parafrase Dokumen
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              PARAFRASE DOKUMLN
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 mb-4 sm:mb-6">
              Rp 2.000/HALAMAN
            </p>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
              Termurah di Pasaran dan Terpercaya 2K+ Customer
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(61, 122, 181, 0.4)',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                  <span className="text-white font-medium text-xs sm:text-sm">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://wa.me/6287815797525?text=Halo%20Kak%20Mau%20Parafrase"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl shadow-lg shadow-green-500/20 text-sm sm:text-base"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              Pesan Parafrase
            </motion.a>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-linear-to-br from-primary-800/20 to-primary-600/10 border border-primary-600/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
              {/* Before Card */}
              <motion.div
                className="bg-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4 border border-white/10"
                layout
                key={`card-orig-${pairIndex}`}
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500 text-xs sm:text-sm ml-2">Original</span>
                  {/* Typing dots */}
                  <div className="ml-auto flex gap-1">
                    <motion.span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                      animate={origText.length > 0 && origText.length < pair.original.length ? {
                        opacity: [1, 0.3, 1],
                      } : { opacity: 0.3 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                      animate={origText.length > 0 && origText.length < pair.original.length ? {
                        opacity: [0.3, 1, 0.3],
                      } : { opacity: 0.3 }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                      animate={origText.length > 0 && origText.length < pair.original.length ? {
                        opacity: [1, 0.3, 1],
                      } : { opacity: 0.3 }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm font-mono leading-relaxed min-h-10 sm:min-h-14">
                  {origText}
                  <span
                    className={`${showOrigCursor ? 'opacity-100' : 'opacity-0'} text-gray-400`}
                  >
                    ▋
                  </span>
                </p>
                <motion.div
                  className="mt-3 sm:mt-4 flex items-center gap-2"
                  animate={simOrigVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                  transition={{ duration: 0.4 }}
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                  <span className="text-red-400 text-xs sm:text-sm font-semibold">
                    Similarity: {pair.similarityOriginal}
                  </span>
                </motion.div>
              </motion.div>

              {/* Arrow */}
              <div className="flex justify-center my-3 sm:my-6">
                <motion.div
                  className="bg-primary-600 rounded-full p-2 sm:p-4"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              </div>

              {/* After Card */}
              <motion.div
                className="bg-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/30"
                layout
                key={`card-para-${pairIndex}`}
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-green-400 text-xs sm:text-sm ml-2">Paraphrased</span>
                  {/* Typing dots */}
                  <div className="ml-auto flex gap-1">
                    <motion.span
                      className="w-1.5 h-1.5 bg-green-500 rounded-full"
                      animate={paraText.length > 0 && paraText.length < pair.paraphrased.length ? {
                        opacity: [1, 0.3, 1],
                      } : { opacity: 0.3 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 bg-green-500 rounded-full"
                      animate={paraText.length > 0 && paraText.length < pair.paraphrased.length ? {
                        opacity: [0.3, 1, 0.3],
                      } : { opacity: 0.3 }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 bg-green-500 rounded-full"
                      animate={paraText.length > 0 && paraText.length < pair.paraphrased.length ? {
                        opacity: [1, 0.3, 1],
                      } : { opacity: 0.3 }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm font-mono leading-relaxed min-h-10 sm:min-h-14">
                  {paraText}
                  <span
                    className={`${showParaCursor ? 'opacity-100' : 'opacity-0'} text-green-400`}
                  >
                    ▋
                  </span>
                </p>
                <motion.div
                  className="mt-3 sm:mt-4 flex items-center gap-2"
                  animate={simParaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                  transition={{ duration: 0.4 }}
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span className="text-green-400 text-xs sm:text-sm font-semibold">
                    Similarity: {pair.similarityParaphrased}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
