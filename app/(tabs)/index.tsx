import { PlayerName } from '@/components/PlayerName';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { addGame } from '@/store/gameWinningsSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { getColor, getShadowColor } from '@/utils/color-utils';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { checkForWinner, getUpdatedRows, PlayerEnum, SlotValue } from '../../utils/game-utils';

const firstArr = new Array(7).fill(undefined) as Array<SlotValue>

const arr = new Array(6).fill(firstArr) as Array<SlotValue>[]

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const dispatch = useAppDispatch();
  const playerAColor = useSelector((state: RootState) => state.settings.playerAColor)
  const playerBColor = useSelector((state: RootState) => state.settings.playerBColor)
  const rackColor = useSelector((state: RootState) => state.settings.rackColor)
  const [rows, setRows] = useState<Array<SlotValue>[]>(arr)
  const [turn, setTurn] = useState<PlayerEnum>(PlayerEnum.A)
  const [winner, setWinner] = useState<PlayerEnum | undefined>(undefined)
  const [moves, setMoves] = useState<number>(0)
  const [highlightedColumn, setHighlightedColumn] = useState<number | undefined>(undefined)
  const intervalRef = useRef<null | NodeJS.Timeout>(null);
  const startTimestampRef = useRef(0);
  const [secs, setSecs] = useState<number>(0)
  const insets = useSafeAreaInsets();
  const palette = {playerAColor, playerBColor, backgroundColor}
  const setFirstPlayer = () => {
    // TODO - randomize this
    setTurn(PlayerEnum.A)
  }
  useEffect(() => {
    setFirstPlayer()
  }, [])
  const startTimer = () => {
    startTimestampRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            const secondsEllapsed = Math.floor((Date.now() - startTimestampRef.current)/1000)
            console.log(secondsEllapsed)
            if(secondsEllapsed > 3600){
              Alert.alert('Time limit exceeded', 'Your game was automatically ended because it exceeded the time limit of 60 minutes. The board has been reset.', [
                {text: 'OK', style: 'default'}
              ])
            } else {
              setSecs(secondsEllapsed)
            }
        }, 1000)
  }
  const stopTimer = () => {
    clearInterval(intervalRef.current as any);
  }
  const convertSecsToString = () => {
    let mins = Math.floor(secs / 60)
    let remainingSeconds = secs % 60
    return `${mins >= 10 ? mins : `0${mins}`}:${remainingSeconds >= 10 ? remainingSeconds : `0${remainingSeconds}`}`
  }
  const onPressSlot = (column: number, row: number) => {
    setMoves(moves + 1)
    if(!winner){
      if(startTimestampRef.current === 0){
        // this is the first move, start the timer
        startTimer();
      }
      // update the rows with the token in the slot above the highest
      const updatedRows = getUpdatedRows(rows, column, turn)
      setRows(updatedRows)
      // change turns
      const nextPlayer = turn === PlayerEnum.A ? PlayerEnum.B : PlayerEnum.A
      setTurn(nextPlayer)
      const newWinner = checkForWinner(updatedRows, 4)
      if(newWinner !== undefined){
        const now = Date.now()
        setWinner(newWinner)
        dispatch(addGame({winner: newWinner, endTimestamp: now, duration: now - startTimestampRef.current, moves}))
        stopTimer()
      }
    }
  }
  const startNewGame = () => {
    setFirstPlayer();
    setRows(arr)
    setWinner(undefined)
    setMoves(0)
    startTimestampRef.current = 0;
    setSecs(0)
  }
  return (
      <ThemedView 
        style={{
          flex: 1, 
          paddingTop: insets.top + 30,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 30,
          paddingRight: insets.right + 30,
        }}
      >
      <ThemedText type='title' style={{textAlign: 'center'}}>Four in a Row!</ThemedText>
      <ThemedText type="subtitle" style={{textAlign: 'center'}}>Two players take turns.</ThemedText>
      <View style={{paddingTop: 30}}>
        <ThemedText>Moves: {moves}</ThemedText>
        <ThemedText>Time Elapsed: {convertSecsToString()}</ThemedText>
      </View>
      <ThemedView style={{ borderRadius: 20, backgroundColor: rackColor, marginVertical: 30}}>
        {rows.map((row, rowNum) => {
          return (
            <View key={`row-${rowNum}`}style={styles.row}>
              {row.map((element, columnNum) => {
                return (
                  <Pressable
                      style={[styles.slot, highlightedColumn === columnNum ? {opacity: 0.7} : {opacity: 1}]} 
                      onPress={() => onPressSlot(columnNum, rowNum)}
                      key={`slot-${columnNum}-row-${rowNum}`}
                      onPressIn={() => setHighlightedColumn(columnNum)}
                      onPressOut={() => setHighlightedColumn(undefined)}
                      disabled={winner !== undefined}
                  >
                    <Svg height="70%" width="70%" viewBox="0 0 100 100">
                      <Circle cx="50" cy="50" r="45" stroke="grey" strokeWidth="2.5" fill={getShadowColor(getColor(element, palette))}/>
                      <Circle cx="55" cy='55' r="35" fill={getColor(element, palette)}/>
                    </Svg>
                  </Pressable>
                )
              })}
            </View>)
        })}
      </ThemedView>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'}}>
        {!winner && 
          <ThemedText style={{fontSize: 20, fontWeight: 'bold'}}>Your move, <PlayerName palette={palette} player={turn}/></ThemedText>
        }
        {winner && 
          <>
            <ThemedText style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
              Congratulations, <PlayerName palette={palette} player={winner}/>! {"\n\n"}You won!
            </ThemedText>
            <ThemedButton onPress={startNewGame} text={'Start new game'}/>
          </>}
      </View>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
  },
  slot: {
    flex: 1,
    width: '14.28%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  }
});
