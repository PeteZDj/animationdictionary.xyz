import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { CartButton, CategoryTag, CertBadge, Header, PriceButton, RemoteImage, TagRow } from '@/components/shared';
import { itemsForVerb, MARKETPLACE } from '@/data/marketplace';
import { NOUNS } from '@/data/nouns';
import { CATEGORIES, getVerb } from '@/data/verbs';
import { useApp } from '@/store';
import { C, font, nounImg, radius, shadow, verbImg } from '@/theme';
import { Card, Row, Txt } from '@/ui';

export default function VerbDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { cart, inCart, toggleCart } = useApp();
  const verb = getVerb(String(slug));

  const pairedModels = useMemo(
    () => (verb ? NOUNS.filter((n) => n.pairsWith.includes(verb.slug)) : []),
    [verb],
  );
  const listings = useMemo(() => (verb ? itemsForVerb(verb.slug) : []), [verb]);
  const primary = MARKETPLACE.find((m) => m.id === `anim-${slug}`) ?? listings[0];
  const catLabel = CATEGORIES.find((c) => c.id === verb?.category)?.label;

  if (!verb) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 60 }}>
        <Header title="Not found" back />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 52 }}>
      <Header title={verb.word} subtitle="verb · action" back right={<CartButton count={cart.length} />} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* render */}
        <View style={[{ borderRadius: radius.xl, overflow: 'hidden' }, shadow.soft]}>
          <RemoteImage uri={verbImg(verb.slug)} style={{ width: '100%', height: 340 }} radius={0} />
          <Row style={{ position: 'absolute', bottom: 12, left: 12, right: 12, justifyContent: 'space-between' }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 }}>
              <Txt f={font.mono} size={11} color={C.textSub}>
                render · {verb.slug}
              </Txt>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 }}>
              <Txt f={font.mono} size={11} color={C.muted}>
                still · .png
              </Txt>
            </View>
          </Row>
        </View>

        {/* meta */}
        <Row gap={8} style={{ marginTop: 16, flexWrap: 'wrap' }}>
          <CategoryTag category={verb.category} label={catLabel} />
          {verb.loopable && <Flag icon="repeat" label="Loopable" />}
          {verb.rootMotion && <Flag icon="move" label="Root motion" />}
        </Row>

        <Txt f={font.black} size={32} color={C.ink} style={{ letterSpacing: -0.8, marginTop: 12 }}>
          {verb.word}
        </Txt>
        <Txt f={font.body} size={15} color={C.textSub} lh={22} style={{ marginTop: 6 }}>
          {verb.definition}
        </Txt>

        {/* buy */}
        {primary && (
          <Card style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="play" size={20} color={C.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt f={font.bold} size={15} color={C.ink}>
                {verb.word} animation
              </Txt>
              <Txt f={font.mono} size={11} color={C.muted}>
                {(primary.bytes / 1024).toFixed(0)} KB · {verb.rigs.length} rigs
              </Txt>
            </View>
            <PriceButton price={primary.priceUsd} inCart={inCart(primary.id)} onPress={() => toggleCart(primary.id)} />
          </Card>
        )}

        {/* rigs + synonyms */}
        <Section title="Supported rigs">
          <TagRow tags={verb.rigs} color={C.brand} />
        </Section>

        {verb.synonyms.length > 0 && (
          <Section title="Also searchable as">
            <Row style={{ flexWrap: 'wrap', gap: 7 }}>
              {verb.synonyms.map((s) => (
                <View key={s} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Txt f={font.bodyMed} size={13} color={C.textSub}>
                    {s}
                  </Txt>
                </View>
              ))}
            </Row>
          </Section>
        )}

        {/* paired models */}
        {pairedModels.length > 0 && (
          <Section title={`Pairs with ${pairedModels.length} model${pairedModels.length === 1 ? '' : 's'}`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {pairedModels.map((n) => (
                <Pressable key={n.slug} onPress={() => router.push(`/noun/${n.slug}`)} style={{ width: 128 }}>
                  <View style={[{ borderRadius: radius.md, overflow: 'hidden' }, shadow.card]}>
                    <RemoteImage uri={nounImg(n.slug)} style={{ width: 128, height: 128 }} radius={0} />
                  </View>
                  <Txt f={font.bodyBold} size={13} color={C.ink} style={{ marginTop: 6 }}>
                    {n.word}
                  </Txt>
                  <Txt f={font.mono} size={10} color={C.muted}>
                    {n.polyHint}
                  </Txt>
                </Pressable>
              ))}
            </ScrollView>
          </Section>
        )}

        {/* listings */}
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

function Flag({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Row gap={5} style={{ backgroundColor: C.bgElevated, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Ionicons name={icon} size={12} color={C.textSub} />
      <Txt f={font.bodySemi} size={11.5} color={C.textSub}>
        {label}
      </Txt>
    </Row>
  );
}
