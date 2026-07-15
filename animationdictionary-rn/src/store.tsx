// AnimationDictionary client state — the interactive layers on top of the static
// catalogue: a marketplace cart, the enlisted AI-300 battalion, and claimed
// dictionary words. All persisted to AsyncStorage (the web app is mock/no-auth).

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MARKETPLACE, MarketplaceItem } from '@/data/marketplace';

const KEY = 'adxyz_state_v1';

export interface ClaimEntry {
  word: string;
  rigs: string[];
  variations: string[];
  at: string;
}

interface Persisted {
  cart: string[]; // marketplace item ids
  army: number[]; // enlisted bot ids
  claims: ClaimEntry[];
}

function fresh(): Persisted {
  return { cart: [], army: [], claims: [] };
}

interface Ctx {
  ready: boolean;
  // cart
  cart: string[];
  cartItems: MarketplaceItem[];
  cartTotal: number;
  inCart: (id: string) => boolean;
  toggleCart: (id: string) => void;
  clearCart: () => void;
  // army
  army: number[];
  enlisted: (id: number) => boolean;
  toggleEnlist: (id: number) => void;
  armyPower: number;
  // claims
  claims: ClaimEntry[];
  claimWord: (entry: ClaimEntry) => void;
  isClaimed: (word: string) => boolean;
}

const AppContext = createContext<Ctx | null>(null);

const ITEM_BY_ID = new Map(MARKETPLACE.map((m) => [m.id, m]));

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<Persisted>(fresh);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setState({ ...fresh(), ...JSON.parse(raw) });
      } catch {
        /* keep fresh */
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback((next: Persisted) => {
    setState(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const toggleCart = useCallback(
    (id: string) =>
      persist({ ...state, cart: state.cart.includes(id) ? state.cart.filter((x) => x !== id) : [...state.cart, id] }),
    [state, persist],
  );
  const clearCart = useCallback(() => persist({ ...state, cart: [] }), [state, persist]);

  const toggleEnlist = useCallback(
    (id: number) =>
      persist({ ...state, army: state.army.includes(id) ? state.army.filter((x) => x !== id) : [...state.army, id] }),
    [state, persist],
  );

  const claimWord = useCallback(
    (entry: ClaimEntry) =>
      persist({ ...state, claims: [entry, ...state.claims.filter((c) => c.word !== entry.word)] }),
    [state, persist],
  );

  const cartItems = useMemo(
    () => state.cart.map((id) => ITEM_BY_ID.get(id)).filter(Boolean) as MarketplaceItem[],
    [state.cart],
  );
  const cartTotal = useMemo(() => cartItems.reduce((s, m) => s + m.priceUsd, 0), [cartItems]);
  const armyPower = useMemo(() => {
    // requires BOTS lookup; imported lazily to avoid loading 800-line data unless needed
    const { BOTS } = require('@/data/ai300') as typeof import('@/data/ai300');
    const map = new Map(BOTS.map((b) => [b.id, b]));
    return state.army.reduce((s, id) => {
      const b = map.get(id);
      return s + (b ? b.health + b.damage + b.armor : 0);
    }, 0);
  }, [state.army]);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      cart: state.cart,
      cartItems,
      cartTotal,
      inCart: (id) => state.cart.includes(id),
      toggleCart,
      clearCart,
      army: state.army,
      enlisted: (id) => state.army.includes(id),
      toggleEnlist,
      armyPower,
      claims: state.claims,
      claimWord,
      isClaimed: (word) => state.claims.some((c) => c.word === word),
    }),
    [ready, state, cartItems, cartTotal, armyPower, toggleCart, clearCart, toggleEnlist, claimWord],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
