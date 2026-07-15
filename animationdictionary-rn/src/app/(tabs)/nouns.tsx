import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, TextInput, View } from 'react-native';
import { CartButton, CategoryTag, Header, RemoteImage, TagRow } from '@/components/shared';
import { NOUNS, NOUN_CATEGORIES, Noun } from '@/data/nouns';
import { useApp } from '@/store';
import { C, font, radius, shadow, nounImg } from '@/theme';
import { Row, Txt } from '@/ui';

const { width } = Dimensions.get('window');
const GAP = 12;
const CARD_W = (width - 40 - GAP) / 2;

export default function Nouns() {
  const { cart } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return NOUNS.filter((n) => {
      if (cat && n.category !== cat) return false;
      if (!query) return true;
      return (
        n.word.toLowerCase().includes(query) ||
        n.slug.includes(query) ||
        n.definition.toLowerCase().includes(query)
      );
    });
  }, [q, cat]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 52 }}>
      <Header
        title="Nouns"
        subtitle={`${NOUNS.length} rigged models`}
        right={<CartButton count={cart.length} />}
      />

      <View style={{ paddingHorizontal: 20 }}>
        <Row
          gap={9}
          style={{
            backgroundColor: C.card,
            borderWidth: 1,
            borderColor: C.line,
            borderRadius: radius.pill,
            paddingHorizontal: 16,
            height: 48,
          }}>
          <Ionicons name="search" size={18} color={C.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search models — knight, dragon, sword…"
            placeholderTextColor={C.muted}
            style={{ flex: 1, fontFamily: font.body, fontSize: 14.5, color: C.ink }}
          />
          {q.length > 0 && (
            <Pressable onPress={() => setQ('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={C.muted} />
            </Pressable>
          )}
        </Row>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, maxHeight: 44 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        <CatChip label="All" active={!cat} onPress={() => setCat(null)} />
        {NOUN_CATEGORIES.map((c) => (
          <CatChip key={c.id} label={c.label} active={cat === c.id} onPress={() => setCat(cat === c.id ? null : c.id)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Txt f={font.mono} size={11.5} color={C.muted} style={{ marginBottom: 12 }}>
          {filtered.length} model{filtered.length === 1 ? '' : 's'}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
          {filtered.map((n) => (
            <NounCard key={n.slug} noun={n} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function NounCard({ noun }: { noun: Noun }) {
  return (
    <Pressable onPress={() => router.push(`/noun/${noun.slug}`)} style={{ width: CARD_W }}>
      <View style={[{ borderRadius: radius.lg, overflow: 'hidden', backgroundColor: C.card, borderWidth: 1, borderColor: C.line2 }, shadow.card]}>
        <View style={{ position: 'relative' }}>
          <RemoteImage uri={nounImg(noun.slug)} style={{ width: CARD_W, height: CARD_W }} radius={0} />
          {noun.polyHint && (
            <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(15,23,42,0.78)', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3 }}>
              <Txt f={font.mono} size={9.5} color={C.white}>
                {noun.polyHint}
              </Txt>
            </View>
          )}
        </View>
        <View style={{ padding: 11 }}>
          <CategoryTag category={noun.category} />
          <Txt f={font.bold} size={15.5} color={C.ink} style={{ marginTop: 6 }}>
            {noun.word}
          </Txt>
          <Txt f={font.body} size={11.5} color={C.muted} numberOfLines={2} lh={15} style={{ marginTop: 2, minHeight: 30 }}>
            {noun.definition}
          </Txt>
          <View style={{ marginTop: 8 }}>
            <TagRow tags={noun.formats} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function CatChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 15,
        height: 36,
        justifyContent: 'center',
        borderRadius: radius.pill,
        backgroundColor: active ? C.ink : C.card,
        borderWidth: 1,
        borderColor: active ? C.ink : C.line,
      }}>
      <Txt f={font.bodySemi} size={13} color={active ? C.white : C.textSub}>
        {label}
      </Txt>
    </Pressable>
  );
}
