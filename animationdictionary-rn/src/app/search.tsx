import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { CategoryTag, RemoteImage } from '@/components/shared';
import { lookupWord } from '@/data/dictionary';
import { NOUNS } from '@/data/nouns';
import { VERBS } from '@/data/verbs';
import { C, font, nounImg, radius, verbImg } from '@/theme';
import { Row, Txt } from '@/ui';

const SUGGESTIONS = ['vault', 'sneak', 'roar', 'backflip', 'dragon', 'knight', 'parry', 'fly'];

export default function Search() {
  const [q, setQ] = useState('');
  const ref = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  const query = q.trim().toLowerCase();
  const verbHits = useMemo(
    () =>
      !query
        ? []
        : VERBS.filter(
            (v) =>
              v.word.toLowerCase().includes(query) ||
              v.slug.includes(query) ||
              v.synonyms.some((s) => s.toLowerCase().includes(query)),
          ).slice(0, 12),
    [query],
  );
  const nounHits = useMemo(
    () => (!query ? [] : NOUNS.filter((n) => n.word.toLowerCase().includes(query) || n.slug.includes(query)).slice(0, 12)),
    [query],
  );
  const wordHit = query ? lookupWord(query) : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 16 }}>
      <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.muted2, alignSelf: 'center', marginBottom: 14 }} />

      <Row gap={10} style={{ paddingHorizontal: 20, marginBottom: 14 }}>
        <Row gap={9} style={{ flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: radius.pill, paddingHorizontal: 16, height: 50 }}>
          <Ionicons name="search" size={19} color={C.brand} />
          <TextInput
            ref={ref}
            value={q}
            onChangeText={setQ}
            placeholder="Search verbs, nouns, words…"
            placeholderTextColor={C.muted}
            autoCapitalize="none"
            returnKeyType="search"
            style={{ flex: 1, fontFamily: font.body, fontSize: 15, color: C.ink }}
          />
          {q.length > 0 && (
            <Pressable onPress={() => setQ('')} hitSlop={8}>
              <Ionicons name="close-circle" size={19} color={C.muted} />
            </Pressable>
          )}
        </Row>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Txt f={font.bodySemi} size={14.5} color={C.textSub}>
            Cancel
          </Txt>
        </Pressable>
      </Row>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {!query ? (
          <>
            <Txt f={font.monoMed} size={11} color={C.muted} style={{ letterSpacing: 1, marginBottom: 12 }}>
              TRY SEARCHING
            </Txt>
            <Row style={{ flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTIONS.map((s) => (
                <Pressable key={s} onPress={() => setQ(s)} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 }}>
                  <Txt f={font.bodySemi} size={13.5} color={C.textSub}>
                    {s}
                  </Txt>
                </Pressable>
              ))}
            </Row>
          </>
        ) : (
          <>
            {wordHit && (
              <Pressable onPress={() => router.replace(`/verb/${wordHit.slug}`)} style={{ backgroundColor: C.brandTint, borderRadius: radius.lg, borderWidth: 1, borderColor: C.brandMuted, padding: 16, marginBottom: 18 }}>
                <Txt f={font.monoMed} size={10.5} color={C.brand} style={{ letterSpacing: 1 }}>
                  DICTIONARY MATCH
                </Txt>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <View>
                    <Txt f={font.black} size={22} color={C.ink} style={{ textTransform: 'capitalize' }}>
                      {wordHit.word}
                    </Txt>
                    <Txt f={font.body} size={12.5} color={C.textSub} style={{ marginTop: 2 }}>
                      {wordHit.animations} animations · resolves to “{wordHit.display}”
                    </Txt>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={30} color={C.brand} />
                </Row>
              </Pressable>
            )}

            {verbHits.length > 0 && (
              <ResultGroup title={`Verbs (${verbHits.length})`}>
                {verbHits.map((v) => (
                  <Pressable key={v.slug} onPress={() => router.replace(`/verb/${v.slug}`)}>
                    <Row gap={12} style={{ paddingVertical: 8 }}>
                      <RemoteImage uri={verbImg(v.slug)} style={{ width: 52, height: 52 }} radius={radius.md} />
                      <View style={{ flex: 1 }}>
                        <Txt f={font.bold} size={15} color={C.ink}>
                          {v.word}
                        </Txt>
                        <Txt f={font.body} size={12} color={C.muted} numberOfLines={1} style={{ marginTop: 1 }}>
                          {v.definition}
                        </Txt>
                      </View>
                      <CategoryTag category={v.category} />
                    </Row>
                  </Pressable>
                ))}
              </ResultGroup>
            )}

            {nounHits.length > 0 && (
              <ResultGroup title={`Nouns (${nounHits.length})`}>
                {nounHits.map((n) => (
                  <Pressable key={n.slug} onPress={() => router.replace(`/noun/${n.slug}`)}>
                    <Row gap={12} style={{ paddingVertical: 8 }}>
                      <RemoteImage uri={nounImg(n.slug)} style={{ width: 52, height: 52 }} radius={radius.md} />
                      <View style={{ flex: 1 }}>
                        <Txt f={font.bold} size={15} color={C.ink}>
                          {n.word}
                        </Txt>
                        <Txt f={font.body} size={12} color={C.muted} numberOfLines={1} style={{ marginTop: 1 }}>
                          {n.definition}
                        </Txt>
                      </View>
                      <CategoryTag category={n.category} />
                    </Row>
                  </Pressable>
                ))}
              </ResultGroup>
            )}

            {!wordHit && verbHits.length === 0 && nounHits.length === 0 && (
              <View style={{ alignItems: 'center', paddingTop: 50 }}>
                <Ionicons name="search-outline" size={36} color={C.muted2} />
                <Txt f={font.bold} size={16} color={C.ink} style={{ marginTop: 12 }}>
                  No matches for “{q}”
                </Txt>
                <Txt f={font.body} size={13} color={C.muted} align="center" style={{ marginTop: 4 }}>
                  This word may be open to claim in the dictionary.
                </Txt>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Txt f={font.monoMed} size={11} color={C.muted} style={{ letterSpacing: 1, marginBottom: 4 }}>
        {title.toUpperCase()}
      </Txt>
      {children}
    </View>
  );
}
