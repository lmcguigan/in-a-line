import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Token } from '@/components/Token';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppDispatch } from '@/store/hooks';
import { PlayerAColorOptions, PlayerBColorOptions, RackColorOptions, updatePlayerAColor, updatePlayerBColor, updateRackColor } from '@/store/settingsSlice';
import { RootState } from '@/store/store';
import { ColorValue, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const playerAOptions = Object.values(PlayerAColorOptions)
const playerBOptions = Object.values(PlayerBColorOptions)
const rackOptions = Object.values(RackColorOptions)

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const playerAColor = useSelector((state: RootState) => state.settings.playerAColor)
  const playerBColor = useSelector((state: RootState) => state.settings.playerBColor)
  const rackColor = useSelector((state: RootState) => state.settings.rackColor)
  const tokenOutlineSelectedColor = useThemeColor({}, 'tokenOutlineSelected');
  const tokenOutlineDefaultColor = useThemeColor({}, 'tokenOutlineDefault');
  const renderOptionSwatches = <T extends ColorValue>(options: T[], state: T, setFunc: (option: T) => void) => {
    return (
      <View style={{flexDirection: 'row', paddingVertical: 10}}>
      {options.map((option, i) => {
        return (
          <Pressable key={`swatch-${i}`} onPress={() => setFunc(option)}>
            <Token fill={option} stroke={option === state ? tokenOutlineSelectedColor : tokenOutlineDefaultColor}/>
          </Pressable>
        )
      })}
    </View>
    )
  }
  return (
    <ThemedView style={{
      flex: 1, 
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <View style={styles.contentContainer}>
          <View style={styles.section}>
            <ThemedText type="subtitle">Rack Color</ThemedText>
            {renderOptionSwatches(rackOptions, rackColor, (color) => dispatch(updateRackColor(color)))}
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle">Player A Token Color</ThemedText>
            {renderOptionSwatches(playerAOptions, playerAColor, (color) => dispatch(updatePlayerAColor(color)))}
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle">Player B Token Color</ThemedText>
            {renderOptionSwatches(playerBOptions, playerBColor, (color) => dispatch(updatePlayerBColor(color)))}
          </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    paddingTop: 30
  },
  section: {
    paddingBottom: 20
  },
  contentContainer: {
    width: '100%', 
    padding: 30
  }
});
