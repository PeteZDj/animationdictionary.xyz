import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { CartButton, CategoryTag, CertBadge, Header, PriceButton, RemoteImage, TagRow } from '@/components/shared';
import { itemsForNoun, MARKETPLACE } from '@/data/marketplace';
import { getNoun, NOUN_CATEGORIES } from '@/data/nouns';
import { getVerb } from '@/data/verbs';
import { useApp } from '@/store';
import { C, font, radius, shadow, nounImg, verbImg } from '@/theme';
import { Card, Row, Txt } from '@/ui';

export default function NounDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { cart, inCart, toggleCart } = useApp();
  const noun = getNoun(String(slug));

  const picker = useMemo(
    () => (noun ? noun.pairsWith.map((s) => ({ slug: s, verb: getVerb(s) })) : []),
    [noun],
  );
  const listings = useMemo(() => (noun ? itemsForNoun(noun.slug) : []), [noun]);
  const primary = MARKETPLACE.find((m) => m.id === `model-${slug}`) ?? listings[0];
  const catLabel = NOUN_CATEGORIES.find((c) => c.id === noun?.category)?.label;

  if (!noun) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 60 }}>
        <Header title="Not found" back />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 52 }}>
      <Header title={noun.word} subtitle="noun · model" back right={<CartButton count={cart.length} />} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[{ borderRadius: radius.xl, overflow: 'hidden' }, shadow.soft]}>
          <RemoteImage uri={nounImg(noun.slug)} style={{ width: '100%', height: 340 }} radius={0} />
          <Row style={{ position: 'absolute', bottom: 12, left: 12, right: 12, justifyContent: 'space-between' }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 }}>
              <Txt f={font.mono} size={11} color={C.textSub}>
                model · {noun.slug}
              </Txt>
            </View>
            {noun.polyHint && (
              <View style={{ backgroundColor: 'rgba(15,23,42,0.82)', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 }}>
                <Txt f={font.mono} size={11} color={C.white}>
                  {noun.polyHint}
                </Txt>
              </View>
            )}
          </Row>
        </View>

        <Row gap={8} style={{ marginTop: 16, flexWrap: 'wrap' }}>
          <CategoryTag category={noun.category} label={catLabel} />
        </Row>

        <Txt f={font.black} size={32} color={C.ink} style={{ letterSpacing: -0.8, marginTop: 12 }}>
          {noun.word}
        </Txt>
        <Txt f={font.body} size={15} color={C.textSub} lh={22} style={{ marginTop: 6 }}>
          {noun.definition}
        </Txt>

        {primary && (
          <Card style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="cube" size={20} color={C.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt f={font.bold} size={15} color={C.ink}>
                {noun.word} model
              </Txt>
              <Txt f={font.mono} size={11} color={C.muted}>
                {(primary.bytes / 1024).toFixed(0)} KB · {noun.formats.length} formats
              </Txt>
            </View>
            <PriceButton price={primary.priceUsd} inCart={inCart(primary.id)} onPress={() => toggleCart(primary.id)} />
          </Card>
        )}

        <Section title="Formats">
          <TagRow tags={noun.formats} color={C.brand} />
        </Section>

        {/* animation picker */}
        {picker.length > 0 && (
          <Section title="Animate this model">
            <Txt f={font.body} size={13} color={C.textSub} lh={18} style={{ marginTop: -4, marginBottom: 12 }}>
              Compatible actions rigged for {noun.word.toLowerCase()}.
            </Txt>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {picker.map(({ slug: s, verb }) =>
                verb ? (
                  <Pressable key={s} onPress={() => router.push(`/verb/${verb.slug}`)} style={{ width: 118 }}>
                    <View style={[{ borderRadius: radius.md, overflow: 'hidden' }, shadow.card]}>
                      <RemoteImage uri={verbImg(verb.slug)} style={{ width: 118, height: 118 }} radius={0} />
                    </View>
                    <Txt f={font.bodyBold} size={13} color={C.ink} style={{ marginTop: 6 }}>
                      {verb.word}
                    </Txt>
                  </Pressable>
                ) : (
                  <View key={s} style={{ width: 118 }}>
                    <View style={{ width: 118, height: 118, borderRadius: radius.md, backgroundColor: C.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="add-circle-outline" size={26} color={C.muted} />
                    </View>
                    <Txt f={font.bodyBold} size={13} color={C.textSub} style={{ marginTop: 6, textTransform: 'capitalize' }}>
                      {s.replace(/-/g, ' ')}
                    </Txt>
                    <Txt f={font.mono} size={9.5} color={C.muted}>
                      requested
                    </Txt>
                  </View>
                ),
              )}
            </ScrollView>
          </Section>
        )}

        {listings.length > 0 && (
          <Section title={`${listings.length} listing${listings.length === 1 ? '' : 's'}`}>
            <View style={{ gap: 10 }}>
              {listings.map((m) => (
                <Card key={m.id} pad={12} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Row gap={6}>
                      <Txt f={font.monoMed} size={10} color={C.brand}>
                        {m.kind.toUpperCase()}
                      </Txt>
                      {m.certified && <CertBadge size={15} />}
                    </Row>
                    <Txt f={font.bold} size={14.5} color={C.ink} style={{ marginTop: 3 }} numberOfLines={1}>
                      {m.title}
                    </Txt>
                    <Txt f={font.mono} size={10.5} color={C.muted} style={{ marginTop: 2 }}>
                      rank #{m.animatorRank} · {m.rigs.slice(0, 3).join(' · ')}
                    </Txt>
                  </View>
                  <PriceButton price={m.priceUsd} inCart={inCart(m.id)} onPress={() => toggleCart(m.id)} size="sm" />
                </Card>
              ))}
            </View>
          </Section>
        )}
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 24 }}>
      <Txt f={font.monoMed} size={11} color={C.muted} style={{ letterSpacing: 1, marginBottom: 10 }}>
        {title.toUpperCase()}
      </Txt>
      {children}
    </View>
  );
}
