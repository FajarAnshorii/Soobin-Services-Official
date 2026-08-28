'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ServiceItem {
  id: number;
  category: string;
  name: string;
  price: string;
  description: string;
  badge: string | null;
}

export function useRealtimeServices(categoryFilter?: string) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Function to fetch services from Cloudflare D1 API
  const fetchServices = useCallback(async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const url = categoryFilter && categoryFilter !== 'all'
        ? `/api/services?category=${encodeURIComponent(categoryFilter)}`
        : '/api/services';
      
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
          setLastSyncTime(new Date());
        }
      }
    } catch (err) {
      console.error('Error fetching realtime services:', err);
    } finally {
      setLoading(false);
      if (!silent) {
        setTimeout(() => setIsSyncing(false), 600);
      }
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchServices();

    // 1. Layer 1: Cross-Tab BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('soobin_services_sync');
        bc.onmessage = (event) => {
          if (event.data?.type === 'SERVICE_UPDATED' || event.data?.type === 'SYNC_ALL') {
            if (event.data?.service) {
              const updated = event.data.service as ServiceItem;
              setServices((prev) =>
                prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
              );
            }
            fetchServices(true);
          }
        };
      }
    } catch (e) {
      // Ignore broadcast channel errors if unsupported
    }

    // 2. Layer 2: Window Focus & Visibility Change Listener
    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchServices(true);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    // 3. Layer 3: Background sync interval
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchServices(true);
      }
    }, 5000);

    return () => {
      if (bc) {
        bc.close();
      }
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
      clearInterval(interval);
    };
  }, [fetchServices, categoryFilter]);

  return { services, loading, isSyncing, lastSyncTime, refetch: fetchServices };
}
