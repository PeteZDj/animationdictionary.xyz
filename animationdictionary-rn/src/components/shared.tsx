import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, font, radius, tintFor } from '@/theme';
import { Row, Txt } from '@/ui';

const BLURHASH = 'L6Pj0^i_.AyE_3t7t7R**0o#DgR4';

/* ── Screen wrapper ───────────────────────────────────────────────────── */
export function Screen({
  children,
  edges = ['top'],
}: {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

/* ── Wordmark — three motion bars + name ──────────────────────────────── */
export function Mark({ size = 30 }: { size?: number }) {
  const bar = (w: number, o: number) => (
    <View
      key={w}
      style={{
        width: (w / 100) * size,
        height: size * 0.16,
        borderRadius: 99,
        backgroundColor: C.brand,
        opacity: o,
        marginVertical: size * 0.05,
      }}
    />
  );
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: C.ink,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: size * 0.2,
      }}>
      {bar(60, 1)}
      {bar(40, 0.7)}
      {bar(52, 0.85)}
    </View>
  );
}

export function Wordmark({ size = 18 }: { size?: number }) {
  return (
    <Row gap={9}>
      <Mark size={size * 1.5} />
      <View>
        <Txt f={font.black} size={size} color={C.ink} style={{ letterSpacing: -0.5 }}>
          animation<Txt f={font.black} size={size} color={C.brand}>dictionary</Txt>
        </Txt>
      </View>
    </Row>
  );
}

/* ── Page header ──────────────────────────────────────────────────────── */
export function Header({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row gap={10} style={{ flex: 1 }}>
          {back && (
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              hitSlop={10}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: C.card,
                borderWidth: 1,
                borderColor: C.line,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="chevron-back" size={20} color={C.ink} />
            </Pressable>
          )}
          <View style={{ flex: 1 }}>
            {subtitle && (
              <Txt f={font.monoMed} size={11} color={C.brand} style={{ letterSpacing: 1, marginBottom: 1 }}>
                {subtitle.toUpperCase()}
              </Txt>
            )}
            <Txt f={font.black} size={26} color={C.ink} style={{ letterSpacing: -0.6 }}>
              {title}
            </Txt>
          </View>
        </Row>
        {right}
      </Row>
    </View>
  );
}

/* ── Remote image (cached, streamed from the live site) ───────────────── */
export function RemoteImage({
  uri,
  style,
  radius: r = radius.lg,
}: {
  uri: string;
  style?: StyleProp<ViewStyle>;
  radius?: number;
}) {
  return (
    <Image
      source={{ uri }}
      placeholder={{ blurhash: BLURHASH }}
      contentFit="cover"
      transition={220}
      cachePolicy="memory-disk"
      style={[{ backgroundColor: C.bgElevated, borderRadius: r }, style as any]}
    />
  );
}

/* ── Category tag ─────────────────────────────────────────────────────── */
export function CategoryTag({ category, label }: { category: string; label?: string }) {
  const t = tintFor(category);
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: t.bg,
        borderRadius: radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}>
      <Txt f={font.bodyBold} size={11} color={t.fg} style={{ letterSpacing: 0.3, textTransform: 'capitalize' }}>
        {label || category}
      </Txt>
    </View>
  );
}

/* ── Mono tags (rigs / formats) ───────────────────────────────────────── */
export function TagRow({ tags, color = C.textSub }: { tags: string[]; color?: string }) {
  return (
    <Row style={{ flexWrap: 'wrap', gap: 6 }}>
      {tags.map((t) => (
        <View
          key={t}
          style={{
            backgroundColor: C.bgElevated,
            borderRadius: 6,
            paddingHorizontal: 7,
            paddingVertical: 3,
          }}>
          <Txt f={font.mono} size={10.5} color={color}>
            {t}
          </Txt>
        </View>
      ))}
    </Row>
  );
}

/* ── "300" certified badge ────────────────────────────────────────────── */
export function CertBadge({ size = 22 }: { size?: number }) {
  return (
    <View
      style={{
        height: size,
        paddingHorizontal: 8,
        borderRadius: 7,
        backgroundColor: C.gold,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Txt f={font.black} size={size * 0.5} color={C.white} style={{ letterSpacing: 0.5 }}>
        300
      </Txt>
    </View>
  );
}

/* ── Coverage / progress meter ────────────────────────────────────────── */
export function Meter({
  pct,
  color = C.brand,
  height = 10,
  track = C.bgElevated,
}: {
  pct: number;
  color?: string;
  height?: number;
  track?: string;
}) {
  const w = Math.max(0, Math.min(1, pct));
  return (
    <View style={{ height, borderRadius: 99, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${w * 100}%`, height: '100%', borderRadius: 99, backgroundColor: color }} />
    </View>
  );
}

/* ── Price button ($1) ────────────────────────────────────────────────── */
export function PriceButton({
  price,
  inCart,
  onPress,
  size = 'md',
}: {
  price: number;
  inCart?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
}) {
  const h = size === 'sm' ? 34 : 42;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height: h,
        minWidth: h,
        paddingHorizontal: 14,
        borderRadius: 99,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        backgroundColor: inCart ? C.ink : C.brand,
        opacity: pressed ? 0.85 : 1,
      })}>
      <Ionicons name={inCart ? 'checkmark' : 'add'} size={size === 'sm' ? 15 : 17} color={C.white} />
      <Txt f={font.black} size={size === 'sm' ? 13 : 14.5} color={C.white}>
        {inCart ? 'Added' : `$${price}`}
      </Txt>
    </Pressable>
  );
}

/* ── Empty state ──────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, sub }: { icon: keyof typeof Ionicons.glyphMap; title: string; sub?: string }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 30 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          backgroundColor: C.bgElevated,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}>
        <Ionicons name={icon} size={28} color={C.muted} />
      </View>
      <Txt f={font.bold} size={16} color={C.ink} align="center">
        {title}
      </Txt>
      {sub && (
        <Txt f={font.body} size={13} color={C.muted} align="center" lh={19} style={{ marginTop: 4 }}>
          {sub}
        </Txt>
      )}
    </View>
  );
}

/* ── Cart button (header) ─────────────────────────────────────────────── */
export function CartButton({ count }: { count: number }) {
  return (
    <Pressable
      onPress={() => router.push('/cart')}
      hitSlop={8}
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.line,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Ionicons name="bag-handle-outline" size={19} color={C.ink} />
      {count > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            paddingHorizontal: 4,
            backgroundColor: C.brand,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: C.bg,
          }}>
          <Txt f={font.black} size={9.5} color={C.white}>
            {count}
          </Txt>
        </View>
      )}
    </Pressable>
  );
}

/* ── Hero gradient chip badge ─────────────────────────────────────────── */
export function GradChip({ label, icon }: { label: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <LinearGradient
      colors={[C.brand, C.brandDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
      }}>
      {icon && <Ionicons name={icon} size={13} color={C.white} />}
      <Txt f={font.bodyBold} size={11.5} color={C.white} style={{ letterSpacing: 0.4 }}>
        {label}
      </Txt>
    </LinearGradient>
  );
}
