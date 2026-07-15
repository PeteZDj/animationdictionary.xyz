import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Header, Meter, RemoteImage } from '@/components/shared';
import { BOTS, BOT_CLASSES, Bot } from '@/data/ai300';
import { useApp } from '@/store';
import { BOT_CLASS_META, C, font, GRAD, radius, shadow } from '@/theme';
import { Card, Row, Txt } from '@/ui';

const { width } = Dimensions.get('window');
const GAP = 12;
const CARD_W = (width - 40 - GAP) / 2;

export default function AI300() {
  const { army, enlisted, toggleEnlist, armyPower } = useApp();
  const [q, setQ] = useState('');
  const [cls, setCls] = useState<string | null>(null);
  const [inspect, setInspect] = useState<Bot | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return BOTS.filter((b) => {
      if (cls && b.bot_class !== cls) return false;
      if (!query) return true;
      return b.name.toLowerCase().includes(query) || b.bot_class.toLowerCase().includes(query);
    });
  }, [q, cls]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 52 }}>
      <Header title="AI-300 Army" subtitle="the recruiter" back />

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* army summary */}
        <LinearGradient colors={GRAD.ink} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: radius.xl, padding: 20 }, shadow.soft]}>
          <Row gap={8}>
            <Ionicons name="hardware-chip" size={20} color={C.brandLight} />
            <Txt f={font.monoMed} size={11} color={C.brandLight} style={{ letterSpacing: 1 }}>
              YOUR BATTALION
            </Txt>
          </Row>
          <Row style={{ marginTop: 14, gap: 28 }}>
            <View>
              <Txt f={font.black} size={34} color={C.white}>
                {army.length}
              </Txt>
              <Txt f={font.mono} size={10.5} color="rgba(255,255,255,0.7)">
                UNITS · of {BOTS.length}
              </Txt>
            </View>
            <View>
              <Txt f={font.black} size={34} color={C.brandLight}>
                {armyPower.toLocaleString()}
              </Txt>
              <Txt f={font.mono} size={10.5} color="rgba(255,255,255,0.7)">
                ARMY POWER
              </Txt>
            </View>
          </Row>
        </LinearGradient>

        {/* search */}
        <Row
          gap={9}
          style={{ marginTop: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: radius.pill, paddingHorizontal: 16, height: 48 }}>
          <Ionicons name="search" size={18} color={C.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search the roster"
            placeholderTextColor={C.muted}
            autoCapitalize="none"
            style={{ flex: 1, fontFamily: font.body, fontSize: 14.5, color: C.ink }}
          />
        </Row>

        {/* class chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ gap: 8, paddingBottom: 2 }}>
          <ClassChip label="All" active={!cls} onPress={() => setCls(null)} />
          {BOT_CLASSES.map((c) => (
            <ClassChip key={c} label={c} active={cls === c} onPress={() => setCls(cls === c ? null : c)} meta={BOT_CLASS_META[c]} />
          ))}
        </ScrollView>

        <Txt f={font.mono} size={11} color={C.muted} style={{ marginTop: 14, marginBottom: 12 }}>
          {filtered.length} unit{filtered.length === 1 ? '' : 's'}
        </Txt>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
          {filtered.map((b) => (
            <BotCard key={b.id} bot={b} enlisted={enlisted(b.id)} onInspect={() => setInspect(b)} onEnlist={() => toggleEnlist(b.id)} />
          ))}
        </View>
      </ScrollView>

      <InspectModal
        bot={inspect}
        enlisted={inspect ? enlisted(inspect.id) : false}
        onClose={() => setInspect(null)}
        onToggle={(id) => toggleEnlist(id)}
      />
    </View>
  );
}

function BotCard({ bot, enlisted, onInspect, onEnlist }: { bot: Bot; enlisted: boolean; onInspect: () => void; onEnlist: () => void }) {
  const meta = BOT_CLASS_META[bot.bot_class];
  return (
    <View style={[{ width: CARD_W, borderRadius: radius.lg, backgroundColor: C.card, borderWidth: 1, borderColor: enlisted ? C.brand : C.line2, overflow: 'hidden' }, shadow.card]}>
      <Pressable onPress={onInspect}>
        <View style={{ backgroundColor: meta.bg, alignItems: 'center', paddingVertical: 12 }}>
          <RemoteImage uri={bot.avatar_url} style={{ width: 84, height: 84 }} radius={16} />
        </View>
        <View style={{ padding: 11 }}>
          <Row gap={5} style={{ marginBottom: 5 }}>
            <Ionicons name={meta.icon as any} size={12} color={meta.color} />
            <Txt f={font.monoMed} size={10} color={meta.color} style={{ letterSpacing: 0.4 }}>
              {bot.bot_class.toUpperCase()}
            </Txt>
          </Row>
          <Txt f={font.bold} size={15} color={C.ink} numberOfLines={1}>
            {bot.name}
          </Txt>
          <Row gap={10} style={{ marginTop: 6 }}>
            <MiniStat icon="heart" value={bot.health} color={C.red} />
            <MiniStat icon="flash" value={bot.damage} color={C.amber} />
            <MiniStat icon="shield" value={bot.armor} color={C.brand} />
          </Row>
        </View>
      </Pressable>
      <Pressable
        onPress={onEnlist}
        style={{
          margin: 11,
          marginTop: 0,
          height: 36,
          borderRadius: 99,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 5,
          backgroundColor: enlisted ? C.ink : C.brandTint,
        }}>
        <Ionicons name={enlisted ? 'checkmark' : 'add'} size={15} color={enlisted ? C.white : C.brand} />
        <Txt f={font.bold} size={12.5} color={enlisted ? C.white : C.brand}>
          {enlisted ? 'Enlisted' : 'Enlist'}
        </Txt>
      </Pressable>
    </View>
  );
}

function MiniStat({ icon, value, color }: { icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap; value: number; color: string }) {
  return (
    <Row gap={3}>
      <Ionicons name={icon} size={11} color={color} />
      <Txt f={font.mono} size={11} color={C.textSub}>
        {value}
      </Txt>
    </Row>
  );
}

function InspectModal({ bot, enlisted, onClose, onToggle }: { bot: Bot | null; enlisted: boolean; onClose: () => void; onToggle: (id: number) => void }) {
  const meta = bot ? BOT_CLASS_META[bot.bot_class] : null;
  return (
    <Modal visible={!!bot} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.5)' }} onPress={onClose} />
      <View style={{ backgroundColor: C.bg, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: 36 }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.muted2, alignSelf: 'center', marginBottom: 18 }} />
        {bot && meta && (
          <>
            <Row gap={14}>
              <View style={{ backgroundColor: meta.bg, borderRadius: 18, padding: 8 }}>
                <RemoteImage uri={bot.avatar_url} style={{ width: 76, height: 76 }} radius={14} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ alignSelf: 'flex-start', backgroundColor: meta.bg, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                  <Ionicons name={meta.icon as any} size={12} color={meta.color} />
                  <Txt f={font.bodyBold} size={11} color={meta.color}>
                    {bot.bot_class}
                  </Txt>
                </View>
                <Txt f={font.black} size={26} color={C.ink} style={{ letterSpacing: -0.5 }}>
                  {bot.name}
                </Txt>
              </View>
            </Row>

            <View style={{ backgroundColor: C.ink, borderRadius: radius.md, padding: 14, marginTop: 16 }}>
              <Txt f={font.mono} size={11} color={C.brandLight} numberOfLines={2} lh={16}>
                “{bot.catchphrase.slice(0, 42)}…”
              </Txt>
            </View>

            <View style={{ gap: 14, marginTop: 18 }}>
              <StatBar label="Health" value={bot.health} color={C.red} />
              <StatBar label="Damage" value={bot.damage} color={C.amber} />
              <StatBar label="Armor" value={bot.armor} color={C.brand} />
            </View>

            <Pressable
              onPress={() => {
                onToggle(bot.id);
                onClose();
              }}
              style={{
                marginTop: 22,
                height: 54,
                borderRadius: radius.pill,
                backgroundColor: enlisted ? C.red : C.brand,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}>
              <Ionicons name={enlisted ? 'exit' : 'add-circle'} size={19} color={C.white} />
              <Txt f={font.bold} size={15.5} color={C.white}>
                {enlisted ? 'Discharge unit' : 'Enlist into army'}
              </Txt>
            </Pressable>
          </>
        )}
      </View>
    </Modal>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View>
      <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <Txt f={font.bodySemi} size={13} color={C.textSub}>
          {label}
        </Txt>
        <Txt f={font.monoBold} size={13} color={C.ink}>
          {value}
        </Txt>
      </Row>
      <Meter pct={value / 100} color={color} height={8} />
    </View>
  );
}

function ClassChip({ label, active, onPress, meta }: { label: string; active: boolean; onPress: () => void; meta?: { color: string; bg: string; icon: string } }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 14,
        height: 36,
        borderRadius: radius.pill,
        backgroundColor: active ? (meta?.color ?? C.ink) : C.card,
        borderWidth: 1,
        borderColor: active ? (meta?.color ?? C.ink) : C.line,
      }}>
      {meta && <Ionicons name={meta.icon as any} size={13} color={active ? C.white : meta.color} />}
      <Txt f={font.bodySemi} size={13} color={active ? C.white : C.textSub}>
        {label}
      </Txt>
    </Pressable>
  );
}
