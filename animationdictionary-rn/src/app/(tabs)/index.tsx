import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Dimensions, Pressable, ScrollView, View } from 'react-native';
import {
  CartButton,
  CategoryTag,
  CertBadge,
  GradChip,
  Meter,
  RemoteImage,
  Wordmark,
} from '@/components/shared';
import { ANIMATORS } from '@/data/animators';
import { COVERAGE } from '@/data/dictionary';
import { MARKETPLACE } from '@/data/marketplace';
import { NOUNS } from '@/data/nouns';
import { VERBS } from '@/data/verbs';
import { useApp } from '@/store';
import { C, font, GRAD, heroImg, radius, shadow, verbImg, nounImg } from '@/theme';
import { Card, Row, Txt } from '@/ui';

const { width } = Dimensions.get('window');

const HERO_SLIDES = [
  { key: 'vocab', tag: 'MOTION VOCABULARY', title: 'The language\nof motion.', sub: 'Every action a character can perform — indexed as a verb, priced at $1.' },
  { key: 'stockpile', tag: 'THE STOCKPILE', title: 'Browse the\narsenal.', sub: '~100 animations, models & packs. One rig across every card.' },
  { key: 'army', tag: 'ANIMATION 300', title: 'Curated by\nthe elite.', sub: 'A hand-picked battalion of certified animators behind every clip.' },
  { key: 'upload', tag: 'CLAIM A WORD', title: 'Animate the\ndictionary.', sub: 'Coverage tracker turns every gap into a word you can claim.' },
];

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export default function Home() {
  const { cart } = useApp();
  const [slide, setSlide] = useState(0);
  const heroRef = useRef<ScrollView>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setSlide((s) => {
        const next = (s + 1) % HERO_SLIDES.length;
        heroRef.current?.scrollTo({ x: next * (width - 40), animated: true });
        return next;
      });
    }, 4200);
    return () => clearInterval(t);
  }, []);

  const featuredVerbs = useMemo(() => VERBS.slice(0, 8), []);
  const featuredNouns = useMemo(() => NOUNS.filter((n) => n.category === 'character' || n.category === 'creature').slice(0, 6), []);
  const drops = useMemo(() => MARKETPLACE.filter((m) => m.kind === 'pack').slice(0, 4), []);
  const pctDict = COVERAGE.pctDictionary;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* top bar */}
        <Row style={{ justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8 }}>
          <Wordmark size={16} />
          <CartButton count={cart.length} />
        </Row>

        {/* motion ribbon */}
        <MotionRibbon />

        {/* hero slideshow */}
        <ScrollView
          ref={heroRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setSlide(Math.round(e.nativeEvent.contentOffset.x / (width - 40)))}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ paddingHorizontal: 20 }}>
          {HERO_SLIDES.map((s) => (
            <View key={s.key} style={{ width: width - 40, paddingRight: 0 }}>
              <View style={[{ borderRadius: radius.xxl, overflow: 'hidden', height: 380 }, shadow.soft]}>
                <Image source={{ uri: heroImg(s.key) }} contentFit="cover" transition={250} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                <LinearGradient colors={['transparent', 'rgba(15,23,42,0.35)', 'rgba(15,23,42,0.92)']} style={{ flex: 1, justifyContent: 'flex-end', padding: 22 }}>
                  <GradChip label={s.tag} icon="flash" />
                  <Txt f={font.black} size={38} color={C.white} lh={40} style={{ marginTop: 12, letterSpacing: -1 }}>
                    {s.title}
                  </Txt>
                  <Txt f={font.body} size={13.5} color="rgba(255,255,255,0.82)" lh={19} style={{ marginTop: 8, maxWidth: 300 }}>
                    {s.sub}
                  </Txt>
                </LinearGradient>
              </View>
            </View>
          ))}
        </ScrollView>
        <Row style={{ justifyContent: 'center', gap: 6, marginTop: 12 }}>
          {HERO_SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === slide ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === slide ? C.brand : C.muted2,
              }}
            />
          ))}
        </Row>

        {/* search prompt */}
        <Pressable
          onPress={() => router.push('/search')}
          style={{ marginHorizontal: 20, marginTop: 18 }}>
          <Row
            gap={10}
            style={{
              backgroundColor: C.card,
              borderWidth: 1,
              borderColor: C.line,
              borderRadius: radius.pill,
              paddingHorizontal: 18,
              height: 54,
              ...shadow.card,
            }}>
            <Ionicons name="search" size={19} color={C.muted} />
            <Txt f={font.body} size={14.5} color={C.muted}>
              Search a verb — “vault”, “sneak”, “roar”…
            </Txt>
          </Row>
        </Pressable>

        {/* live stats */}
        <Row gap={10} style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <StatCard value={String(VERBS.length)} label="Verbs" icon="walk" tint={C.brand} />
          <StatCard value={String(NOUNS.length)} label="Models" icon="cube" tint={C.chart4} />
          <StatCard value={`$1`} label="Per anim" icon="pricetag" tint={C.green} />
        </Row>

        {/* coverage teaser */}
        <Pressable onPress={() => router.push('/(tabs)/dictionary')} style={{ marginHorizontal: 20, marginTop: 14 }}>
          <LinearGradient colors={GRAD.ink} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: radius.xl, padding: 20 }, shadow.soft]}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Txt f={font.monoMed} size={11} color={C.brandLight} style={{ letterSpacing: 1 }}>
                  DICTIONARY COVERAGE
                </Txt>
                <Txt f={font.black} size={22} color={C.white} style={{ marginTop: 2 }}>
                  Animate every word
                </Txt>
              </View>
              <Ionicons name="arrow-forward-circle" size={30} color={C.brandLight} />
            </Row>
            <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <Txt f={font.mono} size={11.5} color="rgba(255,255,255,0.7)">
                {fmt(COVERAGE.coveredWords)} / {fmt(COVERAGE.dictionaryTotal)} words
              </Txt>
              <Txt f={font.monoBold} size={11.5} color={C.brandLight}>
                {(pctDict * 100).toFixed(3)}%
              </Txt>
            </Row>
            <Meter pct={Math.max(pctDict, 0.012)} color={C.brandLight} track="rgba(255,255,255,0.12)" height={8} />
            <Txt f={font.body} size={12} color="rgba(255,255,255,0.6)" style={{ marginTop: 10 }}>
              {fmt(COVERAGE.animations)} animations across {COVERAGE.coveredWords} covered words · {COVERAGE.lexiconOpen} open to claim
            </Txt>
          </LinearGradient>
        </Pressable>

        {/* verbs strip */}
        <SectionHead kicker="THE LEXICON" title="Browse by verb" onPress={() => router.push('/(tabs)/verbs')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {featuredVerbs.map((v) => (
            <Pressable key={v.slug} onPress={() => router.push(`/verb/${v.slug}`)} style={{ width: 150 }}>
              <View style={[{ borderRadius: radius.lg, overflow: 'hidden' }, shadow.card]}>
                <RemoteImage uri={verbImg(v.slug)} style={{ width: 150, height: 150 }} radius={0} />
              </View>
              <View style={{ marginTop: 8 }}>
                <CategoryTag category={v.category} />
                <Txt f={font.bold} size={15} color={C.ink} style={{ marginTop: 5 }}>
                  {v.word}
                </Txt>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* nouns grid */}
        <SectionHead kicker="RIGGED MODELS" title="Browse by noun" onPress={() => router.push('/(tabs)/nouns')} />
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {featuredNouns.map((n) => {
            const w = (width - 40 - 24) / 3;
            return (
              <Pressable key={n.slug} onPress={() => router.push(`/noun/${n.slug}`)} style={{ width: w }}>
                <View style={[{ borderRadius: radius.md, overflow: 'hidden' }, shadow.card]}>
                  <RemoteImage uri={nounImg(n.slug)} style={{ width: w, height: w }} radius={0} />
                </View>
                <Txt f={font.bodyBold} size={12.5} color={C.ink} style={{ marginTop: 6 }} numberOfLines={1}>
                  {n.word}
                </Txt>
              </Pressable>
            );
          })}
        </View>

        {/* packs / drops */}
        <SectionHead kicker="THE STOCKPILE" title="Featured packs" onPress={() => router.push('/(tabs)/market')} />
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {drops.map((m) => {
            const v = m.verb;
            return (
              <Pressable key={m.id} onPress={() => router.push('/(tabs)/market')}>
                <Card pad={12} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  {v ? (
                    <RemoteImage uri={verbImg(v)} style={{ width: 64, height: 64 }} radius={radius.md} />
                  ) : (
                    <View style={{ width: 64, height: 64, borderRadius: radius.md, backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="albums" size={26} color={C.brand} />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Row gap={6} style={{ marginBottom: 3 }}>
                      <Txt f={font.monoMed} size={10} color={C.brand}>
                        PACK
                      </Txt>
                      {m.certified && <CertBadge size={16} />}
                    </Row>
                    <Txt f={font.bold} size={15} color={C.ink} numberOfLines={1}>
                      {m.title}
                    </Txt>
                    <Txt f={font.mono} size={11} color={C.muted} style={{ marginTop: 2 }}>
                      {m.rigs.slice(0, 3).join(' · ')}
                    </Txt>
                  </View>
                  <View style={{ backgroundColor: C.brand, borderRadius: 99, paddingHorizontal: 14, height: 38, alignItems: 'center', justifyContent: 'center' }}>
                    <Txt f={font.black} size={15} color={C.white}>
                      ${m.priceUsd}
                    </Txt>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        {/* the two rosters */}
        <SectionHead kicker="THE BARRACKS" title="Meet the makers" />
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          <RosterCard
            title="Animation 300"
            sub={`${ANIMATORS.length} certified animators behind every clip`}
            icon="ribbon"
            colors={[C.gold, '#B45309']}
            onPress={() => router.push('/animation-300')}
          />
          <RosterCard
            title="AI-300 Army"
            sub="Draft a battalion of AI animation bots across 6 combat classes"
            icon="hardware-chip"
            colors={[C.brand, C.brandDark]}
            onPress={() => router.push('/ai300')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function MotionRibbon() {
  const words = ['WALK', 'VAULT', 'BACKFLIP', 'SLASH', 'SNEAK', 'ROAR', 'PARRY', 'DODGE', 'CLIMB', 'FLY', 'DANCE', 'CHARGE'];
  return (
    <View style={{ backgroundColor: C.ink, paddingVertical: 8, marginTop: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 18, alignItems: 'center' }}>
        {words.map((w, i) => (
          <Row key={i} gap={18}>
            <Txt f={font.monoBold} size={11} color={C.brandLight} style={{ letterSpacing: 1 }}>
              {w}
            </Txt>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)' }} />
          </Row>
        ))}
      </ScrollView>
    </View>
  );
}

function StatCard({ value, label, icon, tint }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap; tint: string }) {
  return (
    <Card pad={14} style={{ flex: 1 }}>
      <Ionicons name={icon} size={18} color={tint} />
      <Txt f={font.black} size={22} color={C.ink} style={{ marginTop: 8, letterSpacing: -0.5 }}>
        {value}
      </Txt>
      <Txt f={font.body} size={11.5} color={C.muted}>
        {label}
      </Txt>
    </Card>
  );
}

function SectionHead({ kicker, title, onPress }: { kicker: string; title: string; onPress?: () => void }) {
  return (
    <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginTop: 28, marginBottom: 14 }}>
      <View>
        <Txt f={font.monoMed} size={10.5} color={C.brand} style={{ letterSpacing: 1.2 }}>
          {kicker}
        </Txt>
        <Txt f={font.black} size={21} color={C.ink} style={{ letterSpacing: -0.4, marginTop: 2 }}>
          {title}
        </Txt>
      </View>
      {onPress && (
        <Pressable onPress={onPress} hitSlop={8}>
          <Row gap={2}>
            <Txt f={font.bodySemi} size={13} color={C.brand}>
              All
            </Txt>
            <Ionicons name="chevron-forward" size={15} color={C.brand} />
          </Row>
        </Pressable>
      )}
    </Row>
  );
}

function RosterCard({ title, sub, icon, colors, onPress }: { title: string; sub: string; icon: keyof typeof Ionicons.glyphMap; colors: [string, string]; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: radius.xl, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }, shadow.card]}>
        <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={24} color={C.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt f={font.black} size={18} color={C.white}>
            {title}
          </Txt>
          <Txt f={font.body} size={12.5} color="rgba(255,255,255,0.85)" lh={17} style={{ marginTop: 2 }}>
            {sub}
          </Txt>
        </View>
        <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.9)" />
      </LinearGradient>
    </Pressable>
  );
}
