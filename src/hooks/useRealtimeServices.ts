'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

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

  // Function to fetch services from API
  const fetchServices = useCallback(async () => {
    try {
      const url = categoryFilter && categoryFilter !== 'all'
        ? `/api/services?category=${encodeURIComponent(categoryFilter)}`
        : '/api/services';
      
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.services)) {
          setServices(data.services);
        }
      }
    } catch (err) {
      console.error('Error fetching realtime services:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchServices();

    // 1. Layer 1: Supabase Realtime WebSocket Subscription
    const channel = supabase
      .channel('realtime_services_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as ServiceItem;
            setServices((prev) =>
              prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
            );
          } else if (payload.eventType === 'INSERT') {
            const newItem = payload.new as ServiceItem;
            if (!categoryFilter || categoryFilter === 'all' || newItem.category === categoryFilter) {
              setServices((prev) => {
                if (prev.some((s) => s.id === newItem.id)) {
                  return prev.map((s) => (s.id === newItem.id ? newItem : s));
                }
                return [...prev, newItem];
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const oldItem = payload.old as { id: number };
            setServices((prev) => prev.filter((s) => s.id !== oldItem.id));
          }
          // Also trigger a clean background re-fetch
          fetchServices();
        }
      )
      .subscribe();

    // 2. Layer 2: Cross-Tab BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('soobin_services_sync');
        bc.onmessage = (event) => {
          if (event.data?.type === 'SERVICE_UPDATED' || event.data?.type === 'SYNC_ALL') {
            fetchServices();
          }
        };
      }
    } catch (e) {
      // Ignore broadcast channel errors if unsupported
    }

    // 3. Layer 3: Window Focus & Visibility Change Listener
    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchServices();
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    // Fallback periodic light sync every 15 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchServices();
      }
    }, 15000);

    return () => {
      supabase.removeChannel(channel);
      if (bc) {
        bc.close();
      }
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
      clearInterval(interval);
    };
  }, [fetchServices, categoryFilter]);

  return { services, loading, refetch: fetchServices };
}
