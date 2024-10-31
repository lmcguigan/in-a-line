import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootState } from '@/store/store';
import { FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const gameResults = useSelector((state: RootState) => state.gameWinnings.games)
  return (
    <ThemedView style={{
      flex: 1, 
      alignContent: 'center',
      alignItems: 'center',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + 30,
      paddingRight: insets.right + 30,
      }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Winners</ThemedText>
      </ThemedView>
      <FlatList 
        data={gameResults}
        renderItem={({item}) => {
          return (
            <ThemedView>
              <ThemedText>
                Game Completed: {item.endTimestamp}
              </ThemedText>
              <ThemedText>
                Winner: {item.winner}
              </ThemedText>
            </ThemedView>
          )
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
