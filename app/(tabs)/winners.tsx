import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Token } from '@/components/Token';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Game } from '@/store/gameWinningsSlice';
import { persistor, RootState } from '@/store/store';
import { convertSecsToMMSSString } from '@/utils/time-utils';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function WinnersScreen() {
  const insets = useSafeAreaInsets();
  const gameResults = useSelector((state: RootState) => state.gameWinnings.games)
  const borderColor = useThemeColor({}, 'text');
  const tokenOutlineColor = useThemeColor({}, 'tokenOutlineSelected');
  const renderWinnerItem = (item: Game) => {
    const date = new Date(item.endTimestamp)
    return (
      <ThemedView style={{paddingHorizontal: 20, paddingVertical: 18}}>
        <View style={{flexDirection: 'row', paddingBottom: 5}}>
          <ThemedText style={{fontSize: 20}}>
            Player {item.winner.toUpperCase()}
          </ThemedText>
          <Token containerStyle={{marginLeft: 5}} size={25} fill={item.color} stroke={tokenOutlineColor}/>
        </View>
        <ThemedText><ThemedText style={styles.bold}>Game Duration: </ThemedText>{convertSecsToMMSSString(item.duration)}, {item.moves} total moves</ThemedText>
        <ThemedText style={{fontSize: 12}}>Completed at {date.toLocaleString()}</ThemedText>
      </ThemedView>
    )
  }
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
      <View style={{paddingHorizontal: 25}}>
        <ThemedText>No winners to show here. Start playing some games!</ThemedText>
      </View>}
      <FlatList 
        data={gameResults.sort((a, b) => b.endTimestamp - a.endTimestamp)}
        renderItem={({item}) => renderWinnerItem(item)}
        ItemSeparatorComponent={() => <View style={{height: 1, width: '100%', backgroundColor: borderColor}}></View>}
      />
      <ThemedButton 
        text='Reset Winner List' 
        onPress={() => 
        persistor.purge().then(() => {
          Alert.alert('Success', 'Winner list was cleared.')
        })}
        style={{marginTop: 10}}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    paddingBottom: 10
  },
  bold: {
    fontWeight: 'bold'
  }
});
