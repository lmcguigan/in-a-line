import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RootState } from '@/store/store';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const gameResults = useSelector((state: RootState) => state.gameWinnings.games)
  const borderColor = useThemeColor({}, 'text');
  return (
    <ThemedView style={{
        flex: 1, 
        paddingTop: insets.top + 30,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
    }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Winners</ThemedText>
      </ThemedView>
      {gameResults.length === 0 && 
      <View style={{paddingHorizontal: 30}}>
        <ThemedText>No winners to show here. Start playing some games!</ThemedText>
      </View>}
      <FlatList 
        data={gameResults}
        renderItem={({item}) => {
          const date = new Date(item.endTimestamp)
          return (
            <ThemedView style={{paddingHorizontal: 30, paddingVertical: 10, borderBottomColor: borderColor, borderBottomWidth: 1}}>
              <View>
                <ThemedText style={{fontSize: 20, fontWeight: 'bold'}}>
                  Winner: Player {item.winner.toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText>
                Game Completed: {date.toLocaleString()}
              </ThemedText>
              <ThemedText>Moves: {item.moves}</ThemedText>
            </ThemedView>
          )
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    paddingBottom: 30
  },
});
