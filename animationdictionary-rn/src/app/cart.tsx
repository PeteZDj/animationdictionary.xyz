import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { CertBadge, EmptyState, RemoteImage } from '@/components/shared';
import { MarketplaceItem } from '@/data/marketplace';
import { useApp } from '@/store';
import { C, font, nounImg, radius, shadow, verbImg } from '@/theme';
import { Card, Row, Txt } from '@/ui';

export default function Cart() {
  const { cartItems, cartTotal, toggleCart, clearCart } = useApp();
  const [done, setDone] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 14 }}>
      {/* handle + header */}
      <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.muted2, alignSelf: 'center', marginBottom: 10 }} />
      <Row style={{ justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8 }}>
        <View>
          <Txt f={font.monoMed} size={11} color={C.brand} style={{ letterSpacing: 1 }}>
            YOUR CART
          </Txt>
          <Txt f={font.black} size={26} color={C.ink} style={{ letterSpacing: -0.6 }}>
            Checkout
          </Txt>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={20} color={C.ink} />
        </Pressable>
      </Row>

      {done ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }}>
          <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: C.greenBg, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Ionicons name="checkmark-circle" size={54} color={C.green} />
          </View>
          <Txt f={font.black} size={24} color={C.ink} align="center" style={{ letterSpacing: -0.5 }}>
            Order placed
          </Txt>
          <Txt f={font.body} size={14} color={C.textSub} align="center" lh={20} style={{ marginTop: 8 }}>
            Your animations are ready to download. This is a demo checkout — no payment was taken.
          </Txt>
          <Pressable
            onPress={() => router.replace('/(tabs)/market')}
            style={{ marginTop: 24, height: 52, paddingHorizontal: 28, borderRadius: radius.pill, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center' }}>
            <Txt f={font.bold} size={15} color={C.white}>
              Back to the stockpile
            </Txt>
          </Pressable>
        </View>
      ) : cartItems.length === 0 ? (
        <EmptyState icon="bag-handle-outline" title="Your cart is empty" sub="Add animations, models, or packs from the marketplace. Everything is $1." />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 10 }}>
              {cartItems.map((m) => (
                <CartRow key={m.id} item={m} onRemove={() => toggleCart(m.id)} />
              ))}
            </View>
            <Pressable onPress={clearCart} style={{ alignSelf: 'center', marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="trash-outline" size={15} color={C.muted} />
              <Txt f={font.bodySemi} size={13} color={C.muted}>
                Clear cart
              </Txt>
            </Pressable>
          </ScrollView>

          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line, padding: 20, paddingBottom: 32 }}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <Txt f={font.body} size={14} color={C.textSub}>
                {cartItems.length} item{cartItems.length === 1 ? '' : 's'} · capped at $10/pack
              </Txt>
              <Txt f={font.black} size={24} color={C.ink}>
                ${cartTotal}
              </Txt>
            </Row>
            <Pressable
              onPress={() => {
                setDone(true);
                clearCart();
              }}
              style={[{ height: 56, borderRadius: radius.pill, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }, shadow.brand]}>
              <Ionicons name="card" size={19} color={C.white} />
              <Txt f={font.bold} size={16} color={C.white}>
                Pay ${cartTotal}
              </Txt>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function CartRow({ item, onRemove }: { item: MarketplaceItem; onRemove: () => void }) {
  const img = item.verb ? verbImg(item.verb) : item.noun ? nounImg(item.noun) : null;
  return (
    <Card pad={10} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {img ? (
        <RemoteImage uri={img} style={{ width: 58, height: 58 }} radius={radius.md} />
      ) : (
        <View style={{ width: 58, height: 58, borderRadius: radius.md, backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="albums" size={24} color={C.brand} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Row gap={6}>
          <Txt f={font.monoMed} size={10} color={C.brand}>
            {item.kind.toUpperCase()}
          </Txt>
          {item.certified && <CertBadge size={15} />}
        </Row>
        <Txt f={font.bold} size={14.5} color={C.ink} numberOfLines={1} style={{ marginTop: 2 }}>
          {item.title}
        </Txt>
        <Txt f={font.mono} size={10.5} color={C.muted} style={{ marginTop: 1 }}>
          {item.rigs.slice(0, 3).join(' · ')}
        </Txt>
      </View>
      <Txt f={font.black} size={16} color={C.ink}>
        ${item.priceUsd}
      </Txt>
      <Pressable onPress={onRemove} hitSlop={8} style={{ padding: 4 }}>
        <Ionicons name="close-circle" size={22} color={C.muted2} />
      </Pressable>
    </Card>
  );
}
