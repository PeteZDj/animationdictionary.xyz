import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, TextInput, View } from 'react-native';
import { CartButton, CategoryTag, Header, RemoteImage } from '@/components/shared';
import { CATEGORIES, VERBS, Verb } from '@/data/verbs';
import { useApp } from '@/store';
import { C, font, radius, shadow, verbImg } from '@/theme';
import { Row, Txt } from '@/ui';

const { width } = Dimensions.get('window');
const COL = 2;
const GAP = 12;
const CARD_W = (width - 40 - GAP) / COL;

export default function Verbs() {
  const { cart } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return VERBS.filter((v) => {
      if (cat && v.category !== cat) return false;
      if (!query) return true;
      return (
        v.word.toLowerCase().includes(query) ||
        v.slug.includes(query) ||
        v.synonyms.some((s) => s.toLowerCase().includes(query)) ||
        v.definition.toLowerCase().includes(query)
      );
    });
  }, [q, cat]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 52 }}>
      <Header
        title="Verbs"
        subtitle={`${VERBS.length} actions · the lexicon`}
        right={<CartButton count={cart.length} />}
      />

      {/* search */}
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
            placeholder="Search actions & synonyms"
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

      {/* category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, maxHeight: 44 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        <CatChip label="All" active={!cat} onPress={() => setCat(null)} />
        {CATEGORIES.map((c) => (
          <CatChip key={c.id} label={c.label} active={cat === c.id} onPress={() => setCat(cat === c.id ? null : c.id)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Txt f={font.mono} size={11.5} color={C.muted} style={{ marginBottom: 12 }}>
          {filtered.length} result{filtered.length === 1 ? '' : 's'}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
          {filtered.map((v) => (
            <VerbCard key={v.slug} verb={v} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function VerbCard({ verb }: { verb: Verb }) {
  return (
    <Pressable onPress={() => router.push(`/verb/${verb.slug}`)} style={{ width: CARD_W }}>
      <View style={[{ borderRadius: radius.lg, overflow: 'hidden', backgroundColor: C.card, borderWidth: 1, borderColor: C.line2 }, shadow.card]}>
        <RemoteImage uri={verbImg(verb.slug)} style={{ width: CARD_W, height: CARD_W }} radius={0} />
        <View style={{ padding: 11 }}>
          <CategoryTag category={verb.category} />
          <Txt f={font.bold} size={15.5} color={C.ink} style={{ marginTop: 6 }}>
            {verb.word}
          </Txt>
          <Txt f={font.body} size={11.5} color={C.muted} numberOfLines={2} lh={15} style={{ marginTop: 2, minHeight: 30 }}>
            {verb.definition}
          </Txt>
          <Row gap={5} style={{ marginTop: 8, flexWrap: 'wrap' }}>
            {verb.loopable && <MiniTag icon="repeat" label="loop" />}
            {verb.rootMotion && <MiniTag icon="move" label="root" />}
          </Row>
        </View>
      </View>
    </Pressable>
  );
}

function MiniTag({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Row gap={3} style={{ backgroundColor: C.bgElevated, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
      <Ionicons name={icon} size={9} color={C.textSub} />
      <Txt f={font.mono} size={9.5} color={C.textSub}>
        {label}
      </Txt>
    </Row>
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
