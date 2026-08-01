'use client';

import React, { useState, useEffect, useRef } from 'react';
import { School, Check, ChevronDown, Search, Sparkles } from 'lucide-react';

interface UniversityComboboxProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

// Popular Indonesian & Global Top Universities pre-loaded for instant response
const POPULAR_UNIVERSITIES = [
  'Universitas Trunojoyo Madura',
  'Universitas Indonesia',
  'Universitas Gadjah Mada',
  'Institut Teknologi Bandung',
  'Universitas Airlangga',
  'Universitas Brawijaya',
  'Universitas Diponegoro',
  'Universitas Padjadjaran',
  'Universitas Sebelas Maret',
  'Universitas Negeri Surabaya',
  'Universitas Negeri Malang',
  'Universitas Pendidikan Indonesia',
  'Universitas Hasanuddin',
  'Universitas Sumatera Utara',
  'Institut Teknologi Sepuluh Nopember',
  'Harvard University',
  'Stanford University',
  'Massachusetts Institute of Technology (MIT)',
  'University of Oxford',
  'University of Cambridge',
  'National University of Singapore (NUS)',
  'Nanyang Technological University (NTU)',
  'The University of Tokyo',
];

export default function UniversityCombobox({
  value,
  onChange,
  placeholder = 'Ketik atau pilih universitas...',
  required = true,
}: UniversityComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [universities, setUniversities] = useState<string[]>(POPULAR_UNIVERSITIES);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search term when external value changes
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Fetch full list of global (10,000+) & Indonesian (4,600+) universities
  useEffect(() => {
    let isMounted = true;
    const fetchUniversityData = async () => {
      setLoading(true);
      try {
        const [res1, res2, res3] = await Promise.allSettled([
          fetch('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json').then(r => r.json()),
          fetch('https://raw.githubusercontent.com/aryomuzakki/api-perguruan-tinggi-di-indonesia/main/data/pt.json').then(r => r.json()),
          fetch('https://raw.githubusercontent.com/candraprasetya/kampus-api/main/kampus.json').then(r => r.json()),
        ]);

        const fullSet = new Set<string>(POPULAR_UNIVERSITIES);

        // Process Hipo university-domains-list (Global 10,200+ world universities)
        if (res1.status === 'fulfilled' && Array.isArray(res1.value)) {
          res1.value.forEach((item: any) => {
            if (item && item.name) fullSet.add(item.name.trim());
          });
        }

        // Process aryomuzakki api-perguruan-tinggi-di-indonesia (4,670+ Indonesian PTN/PTS)
        if (res2.status === 'fulfilled' && Array.isArray(res2.value)) {
          res2.value.forEach((item: any) => {
            if (item && item.nama) fullSet.add(item.nama.trim());
          });
        }

        // Process candraprasetya kampus-api
        if (res3.status === 'fulfilled' && Array.isArray(res3.value)) {
          res3.value.forEach((item: any) => {
            const name = typeof item === 'string' ? item : item?.nama || item?.name;
            if (name) fullSet.add(name.trim());
          });
        }

        if (isMounted) {
          const list = Array.from(fullSet).sort((a, b) => a.localeCompare(b, 'en'));
          setUniversities(list);
        }
      } catch (err) {
        console.error('Failed fetching university APIs:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUniversityData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter list based on user search term
  const filteredUniversities = universities.filter((u) =>
    u.toLowerCase().includes((searchTerm || '').toLowerCase())
  ).slice(0, 50); // Top 50 matching items

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleSelect = (uniName: string) => {
    setSearchTerm(uniName);
    onChange(uniName);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 z-10 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-white/5">
          <div className="px-3 py-2 bg-white/5 flex items-center justify-between text-[11px] text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Search className="w-3 h-3 text-primary-400" />
              {loading ? 'Memuat 14.000+ data kampus dunia...' : `${filteredUniversities.length} kampus ditemukan`}
            </span>
            <span className="text-[10px] text-primary-400 font-semibold">Bisa ketik custom / pilih</span>
          </div>

          {filteredUniversities.length > 0 ? (
            filteredUniversities.map((uniName, idx) => {
              const isSelected = value?.toLowerCase() === uniName.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(uniName)}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary-600/30 text-white font-bold'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="truncate pr-2">{uniName}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary-400 shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="px-3.5 py-3 text-xs text-gray-400 text-center flex flex-col items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Gunakan nama custom: <strong className="text-white font-semibold">{searchTerm}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
