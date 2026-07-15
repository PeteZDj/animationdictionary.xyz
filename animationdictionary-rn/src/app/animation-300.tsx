import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View } from 'react-native';
import { CertBadge, Header } from '@/components/shared';
import { ANIMATORS } from '@/data/animators';
import { C, font, radius, shadow } from '@/theme';
import { Avatar, Card, Row, Txt } from '@/ui';

export default function Animation300() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 52 }}>
      <Header title="Animation 300" subtitle="the barracks · elite roster" back />

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[C.gold, '#B45309']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: radius.xl, padding: 20 }, shadow.soft]}>
          <Row gap={8}>
            <Ionicons name="ribbon" size={22} color={C.white} />
            <Txt f={font.black} size={22} color={C.white}>
              The hand-picked 300
            </Txt>
          </Row>
          <Txt f={font.body} size={13.5} color="rgba(255,255,255,0.9)" lh={19} style={{ marginTop: 8 }}>
            Every clip on the dictionary is vetted by a certified member of the Animation 300 — the elite corps behind the catalogue. {ANIMATORS.length} enlisted, 270 still being invited.
          </Txt>
          <Row gap={18} style={{ marginTop: 16 }}>
            <View>
              <Txt f={font.black} size={26} color={C.white}>
                {ANIMATORS.length}
              </Txt>
              <Txt f={font.mono} size={10.5} color="rgba(255,255,255,0.8)">
                ENLISTED
              </Txt>
            </View>
            <View>
              <Txt f={font.black} size={26} color={C.white}>
                100%
              </Txt>
              <Txt f={font.mono} size={10.5} color="rgba(255,255,255,0.8)">
                CERTIFIED
              </Txt>
            </View>
            <View>
              <Txt f={font.black} size={26} color={C.white}>
                270
              </Txt>
              <Txt f={font.mono} size={10.5} color="rgba(255,255,255,0.8)">
                INVITED
              </Txt>
            </View>
          </Row>
        </LinearGradient>

        <View style={{ gap: 10, marginTop: 16 }}>
          {ANIMATORS.map((a) => (
            <Card key={a.rank} pad={12} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 34, alignItems: 'center' }}>
                <Txt f={font.monoBold} size={15} color={a.rank <= 3 ? C.gold : C.muted}>
                  {a.rank}
                </Txt>
              </View>
              <Avatar name={a.alias} size={44} color={C.brand} />
              <View style={{ flex: 1 }}>
                <Txt f={font.bold} size={15} color={C.ink} numberOfLines={1}>
                  {a.alias}
                </Txt>
                <Txt f={font.body} size={12} color={C.textSub} style={{ marginTop: 1 }}>
                  {a.specialty}
                </Txt>
              </View>
              {a.certified && <CertBadge size={20} />}
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
