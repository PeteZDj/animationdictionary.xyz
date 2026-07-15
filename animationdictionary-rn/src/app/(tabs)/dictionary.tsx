import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { CartButton, Header, Meter } from '@/components/shared';
import { COVERAGE, LEXICON, LexEntry } from '@/data/dictionary';
import { ClaimEntry, useApp } from '@/store';
import { C, font, GRAD, radius, shadow, tintFor } from '@/theme';
import { Card, Row, Txt } from '@/ui';

type Filter = 'all' | 'animated' | 'open';
const RIGS = ['UE5', 'Unity', 'Mixamo', 'Maya', 'Blender', 'Metahuman'];
const LIMIT = 150;

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export default function Dictionary() {
  const { cart, claims, isClaimed, claimWord } = useApp();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [claiming, setClaiming] = useState<LexEntry | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return LEXICON.filter((e) => {
      if (filter === 'animated' && !e.covered) return false;
      if (filter === 'open' && e.covered) return false;
      if (!query) return true;
      return e.word.includes(query);
    });
  }, [q, filter]);

  const shown = filtered.slice(0, LIMIT);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 52 }}>
      <Header title="Dictionary" subtitle="coverage tracker" right={<CartButton count={cart.length} />} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* headline coverage */}
        <View style={{ paddingHorizontal: 20 }}>
          <LinearGradient colors={GRAD.ink} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: radius.xl, padding: 20 }, shadow.soft]}>
            <Txt f={font.monoMed} size={11} color={C.brandLight} style={{ letterSpacing: 1 }}>
              THE ENGLISH DICTIONARY
            </Txt>
            <Row style={{ alignItems: 'flex-end', gap: 6, marginTop: 6, marginBottom: 12 }}>
              <Txt f={font.black} size={40} color={C.white} style={{ letterSpacing: -1 }}>
                {(COVERAGE.pctDictionary * 100).toFixed(3)}
              </Txt>
              <Txt f={font.black} size={22} color={C.brandLight} style={{ marginBottom: 5 }}>
                %
              </Txt>
              <Txt f={font.body} size={12} color="rgba(255,255,255,0.6)" style={{ marginBottom: 8, marginLeft: 4 }}>
                animated
              </Txt>
            </Row>
            <Meter pct={Math.max(COVERAGE.pctDictionary, 0.012)} color={C.brandLight} track="rgba(255,255,255,0.12)" height={8} />
            <Txt f={font.mono} size={11} color="rgba(255,255,255,0.6)" style={{ marginTop: 10 }}>
              {fmt(COVERAGE.coveredWords)} of {fmt(COVERAGE.dictionaryTotal)} words · {fmt(COVERAGE.animations)} animations
            </Txt>
          </LinearGradient>
        </View>

        {/* core lexicon */}
        <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
          <Card>
            <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <Txt f={font.monoMed} size={11} color={C.brand} style={{ letterSpacing: 1 }}>
                CORE ACTION LEXICON
              </Txt>
              <Txt f={font.monoBold} size={12} color={C.ink}>
                {(COVERAGE.pctLexicon * 100).toFixed(0)}%
              </Txt>
            </Row>
            <Txt f={font.body} size={12.5} color={C.textSub} lh={17} style={{ marginBottom: 12 }}>
              The everyday verbs people actually search for.
            </Txt>
            <Meter pct={COVERAGE.pctLexicon} color={C.brand} height={10} />
            <Row style={{ justifyContent: 'space-between', marginTop: 12 }}>
              <Metric value={String(COVERAGE.lexiconCovered)} label="Animated" color={C.green} />
              <Metric value={String(COVERAGE.lexiconOpen)} label="Open to claim" color={C.amber} />
              <Metric value={String(COVERAGE.lexiconSize)} label="Core words" color={C.ink} />
            </Row>
          </Card>
        </View>

        {/* your claims */}
        {claims.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
            <Card style={{ borderColor: C.brandMuted, backgroundColor: C.brandTint }}>
              <Row gap={7} style={{ marginBottom: 8 }}>
                <Ionicons name="flag" size={15} color={C.brand} />
                <Txt f={font.bold} size={14} color={C.brand}>
                  Your reserved words ({claims.length})
                </Txt>
              </Row>
              <Row style={{ flexWrap: 'wrap', gap: 6 }}>
                {claims.map((c) => (
                  <View key={c.word} style={{ backgroundColor: C.card, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5, borderWidth: 1, borderColor: C.brandMuted }}>
                    <Txt f={font.bodyBold} size={12} color={C.ink}>
                      {c.word}
                      <Txt f={font.mono} size={10} color={C.muted}>
                        {'  '}
                        {c.variations.length + 1}×
                      </Txt>
                    </Txt>
                  </View>
                ))}
              </Row>
            </Card>
          </View>
        )}

        {/* search + filters */}
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <Row
            gap={9}
            style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: radius.pill, paddingHorizontal: 16, height: 48 }}>
            <Ionicons name="search" size={18} color={C.muted} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Look up any word"
              placeholderTextColor={C.muted}
              autoCapitalize="none"
              style={{ flex: 1, fontFamily: font.body, fontSize: 14.5, color: C.ink }}
            />
          </Row>
          <Row gap={8} style={{ marginTop: 12 }}>
            <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
            <FilterChip label="Animated" active={filter === 'animated'} onPress={() => setFilter('animated')} color={C.green} />
            <FilterChip label="Open" active={filter === 'open'} onPress={() => setFilter('open')} color={C.amber} />
          </Row>
        </View>

        {/* word grid */}
        <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
          <Txt f={font.mono} size={11} color={C.muted} style={{ marginBottom: 10 }}>
            {fmt(filtered.length)} words{filtered.length > LIMIT ? ` · showing ${LIMIT}` : ''}
          </Txt>
          <Row style={{ flexWrap: 'wrap', gap: 8 }}>
            {shown.map((e) => (
              <WordChip
                key={e.word}
                entry={e}
                claimed={isClaimed(e.word)}
                onPress={() => (e.covered && e.slug ? router.push(`/verb/${e.slug}`) : setClaiming(e))}
              />
            ))}
          </Row>
        </View>
      </ScrollView>

      <ClaimModal
        entry={claiming}
        onClose={() => setClaiming(null)}
        onReserve={(entry) => {
          claimWord(entry);
          setClaiming(null);
        }}
      />
    </View>
  );
}

function WordChip({ entry, claimed, onPress }: { entry: LexEntry; claimed: boolean; onPress: () => void }) {
  const covered = entry.covered;
  const tint = covered && entry.category ? tintFor(entry.category) : null;
  const bg = claimed ? C.brandTint : covered ? (tint?.bg ?? C.greenBg) : C.card;
  const border = claimed ? C.brand : covered ? 'transparent' : C.line;
  const fg = claimed ? C.brand : covered ? (tint?.fg ?? C.green) : C.textSub;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 7,
      }}>
      {claimed ? (
        <Ionicons name="flag" size={10} color={C.brand} />
      ) : covered ? (
        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: fg }} />
      ) : (
        <Ionicons name="add" size={11} color={C.muted} />
      )}
      <Txt f={font.bodySemi} size={12.5} color={fg}>
        {entry.word}
      </Txt>
      {covered && entry.animations > 0 && (
        <Txt f={font.mono} size={9.5} color={fg} style={{ opacity: 0.7 }}>
          {entry.animations}
        </Txt>
      )}
    </Pressable>
  );
}

function ClaimModal({ entry, onClose, onReserve }: { entry: LexEntry | null; onClose: () => void; onReserve: (e: ClaimEntry) => void }) {
  const [rigs, setRigs] = useState<string[]>(['UE5']);
  const [variations, setVariations] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  const reset = () => {
    setRigs(['UE5']);
    setVariations([]);
    setDraft('');
  };

  return (
    <Modal visible={!!entry} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.5)' }} onPress={onClose} />
      <View style={{ backgroundColor: C.bg, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: 36 }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.muted2, alignSelf: 'center', marginBottom: 18 }} />
        <Txt f={font.monoMed} size={11} color={C.amber} style={{ letterSpacing: 1 }}>
          CLAIM A WORD
        </Txt>
        <Txt f={font.black} size={30} color={C.ink} style={{ letterSpacing: -0.6, marginTop: 2, textTransform: 'capitalize' }}>
          {entry?.word}
        </Txt>
        <Txt f={font.body} size={13} color={C.textSub} lh={18} style={{ marginTop: 6 }}>
          Reserve this word and pledge the rigs + variations you’ll animate.
        </Txt>

        <Txt f={font.bold} size={13} color={C.ink} style={{ marginTop: 18, marginBottom: 8 }}>
          Target rigs
        </Txt>
        <Row style={{ flexWrap: 'wrap', gap: 8 }}>
          {RIGS.map((r) => {
            const on = rigs.includes(r);
            return (
              <Pressable
                key={r}
                onPress={() => setRigs((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]))}
                style={{
                  paddingHorizontal: 13,
                  height: 36,
                  justifyContent: 'center',
                  borderRadius: radius.pill,
                  backgroundColor: on ? C.brand : C.card,
                  borderWidth: 1,
                  borderColor: on ? C.brand : C.line,
                }}>
                <Txt f={font.mono} size={12} color={on ? C.white : C.textSub}>
                  {r}
                </Txt>
              </Pressable>
            );
          })}
        </Row>

        <Txt f={font.bold} size={13} color={C.ink} style={{ marginTop: 18, marginBottom: 8 }}>
          Variations {variations.length > 0 && <Txt f={font.mono} size={11} color={C.muted}>({variations.length})</Txt>}
        </Txt>
        <Row gap={8}>
          <View style={{ flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: radius.md, paddingHorizontal: 14, height: 46, justifyContent: 'center' }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={`e.g. “scared ${entry?.word ?? 'jump'}”`}
              placeholderTextColor={C.muted}
              autoCapitalize="none"
              onSubmitEditing={() => {
                const t = draft.trim();
                if (t) setVariations((v) => [...new Set([...v, t])]);
                setDraft('');
              }}
              style={{ fontFamily: font.body, fontSize: 14, color: C.ink }}
            />
          </View>
          <Pressable
            onPress={() => {
              const t = draft.trim();
              if (t) setVariations((v) => [...new Set([...v, t])]);
              setDraft('');
            }}
            style={{ width: 46, height: 46, borderRadius: radius.md, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="add" size={22} color={C.white} />
          </Pressable>
        </Row>
        {variations.length > 0 && (
          <Row style={{ flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {variations.map((v) => (
              <Pressable
                key={v}
                onPress={() => setVariations((cur) => cur.filter((x) => x !== v))}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.bgElevated, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 }}>
                <Txt f={font.bodyMed} size={12} color={C.ink}>
                  {v}
                </Txt>
                <Ionicons name="close" size={12} color={C.muted} />
              </Pressable>
            ))}
          </Row>
        )}

        <Pressable
          onPress={() => {
            if (!entry) return;
            onReserve({ word: entry.word, rigs, variations, at: new Date().toISOString() });
            reset();
          }}
          disabled={rigs.length === 0}
          style={{
            marginTop: 22,
            height: 54,
            borderRadius: radius.pill,
            backgroundColor: rigs.length ? C.brand : C.muted2,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}>
          <Ionicons name="flag" size={18} color={C.white} />
          <Txt f={font.bold} size={15.5} color={C.white}>
            Reserve “{entry?.word}” · {variations.length + 1} clip{variations.length ? 's' : ''}
          </Txt>
        </Pressable>
      </View>
    </Modal>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <Txt f={font.monoBold} size={19} color={color}>
        {value}
      </Txt>
      <Txt f={font.body} size={11} color={C.muted}>
        {label}
      </Txt>
    </View>
  );
}

function FilterChip({ label, active, onPress, color = C.ink }: { label: string; active: boolean; onPress: () => void; color?: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        height: 38,
        justifyContent: 'center',
        borderRadius: radius.pill,
        backgroundColor: active ? color : C.card,
        borderWidth: 1,
        borderColor: active ? color : C.line,
      }}>
      <Txt f={font.bodySemi} size={13} color={active ? C.white : C.textSub}>
        {label}
      </Txt>
    </Pressable>
  );
}
