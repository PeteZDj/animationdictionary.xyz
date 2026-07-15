import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, TextInput, View } from 'react-native';
import { CartButton, CertBadge, Header, PriceButton, RemoteImage } from '@/components/shared';
import { MARKETPLACE, MarketplaceItem } from '@/data/marketplace';
import { useApp } from '@/store';
import { C, font, nounImg, radius, shadow, verbImg } from '@/theme';
import { Row, Txt } from '@/ui';

const { width } = Dimensions.get('window');
const GAP = 12;
const CARD_W = (width - 40 - GAP) / 2;

type Kind = 'all' | 'animation' | 'model' | 'pack';
const KINDS: { id: Kind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'animation', label: 'Animations' },
  { id: 'model', label: 'Models' },
  { id: 'pack', label: 'Packs' },
];

export default function Market() {
  const { cart, inCart, toggleCart, cartTotal } = useApp();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<Kind>('all');
  const [certOnly, setCertOnly] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MARKETPLACE.filter((m) => {
      if (kind !== 'all' && m.kind !== kind) return false;
      if (certOnly && !m.certified) return false;
      if (!query) return true;
      return m.title.toLowerCase().includes(query) || m.rigs.some((r) => r.toLowerCase().includes(query));
    });
  }, [q, kind, certOnly]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 52 }}>
      <Header
        title="Marketplace"
        subtitle="the stockpile · $1 each"
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
            placeholder="Search the stockpile"
            placeholderTextColor={C.muted}
            style={{ flex: 1, fontFamily: font.body, fontSize: 14.5, color: C.ink }}
          />
        </Row>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, maxHeight: 44 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {KINDS.map((k) => (
          <Chip key={k.id} label={k.label} active={kind === k.id} onPress={() => setKind(k.id)} />
        ))}
        <Chip label="300 Certified" active={certOnly} onPress={() => setCertOnly((v) => !v)} gold />
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: cart.length ? 96 : 40 }} showsVerticalScrollIndicator={false}>
        <Txt f={font.mono} size={11.5} color={C.muted} style={{ marginBottom: 12 }}>
          {filtered.length} item{filtered.length === 1 ? '' : 's'}
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
          {filtered.map((m) => (
            <AssetCard key={m.id} item={m} inCart={inCart(m.id)} onAdd={() => toggleCart(m.id)} />
          ))}
        </View>
      </ScrollView>

      {/* checkout bar */}
      {cart.length > 0 && (
        <Pressable
          onPress={() => router.push('/cart')}
          style={{ position: 'absolute', left: 20, right: 20, bottom: 16 }}>
          <Row
            style={{
              backgroundColor: C.ink,
              borderRadius: radius.pill,
              paddingHorizontal: 20,
              height: 54,
              justifyContent: 'space-between',
              ...shadow.soft,
            }}>
            <Row gap={9}>
              <Ionicons name="bag-handle" size={19} color={C.white} />
              <Txt f={font.bold} size={14.5} color={C.white}>
                {cart.length} in cart
              </Txt>
            </Row>
            <Row gap={8}>
              <Txt f={font.black} size={16} color={C.white}>
                ${cartTotal}
              </Txt>
              <Ionicons name="arrow-forward" size={18} color={C.brandLight} />
            </Row>
          </Row>
        </Pressable>
      )}
    </View>
  );
}

export function AssetCard({ item, inCart, onAdd }: { item: MarketplaceItem; inCart: boolean; onAdd: () => void }) {
  const img = item.verb ? verbImg(item.verb) : item.noun ? nounImg(item.noun) : null;
  const dest = item.kind === 'model' && item.noun ? `/noun/${item.noun}` : item.verb ? `/verb/${item.verb}` : null;
  const label = item.kind === 'pack' ? 'PACK' : item.kind === 'model' ? 'MODEL' : 'ANIM';

  return (
    <View style={[{ width: CARD_W, borderRadius: radius.lg, backgroundColor: C.card, borderWidth: 1, borderColor: C.line2, overflow: 'hidden' }, shadow.card]}>
      <Pressable onPress={() => dest && router.push(dest as any)} disabled={!dest}>
        <View style={{ position: 'relative' }}>
          {img ? (
            <RemoteImage uri={img} style={{ width: CARD_W, height: CARD_W }} radius={0} />
          ) : (
            <View style={{ width: CARD_W, height: CARD_W, backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="albums" size={38} color={C.brand} />
            </View>
          )}
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3 }}>
            <Txt f={font.black} size={9.5} color={C.ink} style={{ letterSpacing: 0.3 }}>
              {label}
            </Txt>
          </View>
          {item.certified && (
            <View style={{ position: 'absolute', top: 8, right: 8 }}>
              <CertBadge size={18} />
            </View>
          )}
        </View>
      </Pressable>
      <Row style={{ padding: 11, justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Txt f={font.bold} size={14} color={C.ink} numberOfLines={1}>
            {item.title}
          </Txt>
          <Txt f={font.mono} size={10} color={C.muted} numberOfLines={1} style={{ marginTop: 2 }}>
            {item.rigs.slice(0, 2).join(' · ')}
          </Txt>
        </View>
        <PriceButton price={item.priceUsd} inCart={inCart} onPress={onAdd} size="sm" />
      </Row>
    </View>
  );
}

function Chip({ label, active, onPress, gold }: { label: string; active: boolean; onPress: () => void; gold?: boolean }) {
  const bg = active ? (gold ? C.gold : C.ink) : C.card;
  const fg = active ? C.white : gold ? C.amber : C.textSub;
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 15,
        height: 36,
        justifyContent: 'center',
        borderRadius: radius.pill,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: active ? bg : gold ? C.amberBg : C.line,
      }}>
      <Txt f={font.bodySemi} size={13} color={fg}>
        {label}
      </Txt>
    </Pressable>
  );
}
