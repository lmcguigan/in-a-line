import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addGame } from '@/store/gameWinningsSlice';
import { useAppDispatch } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { checkForWinner, getUpdatedRows, PlayerEnum, SlotValue } from '../../utils/game-utils';

const firstArr = new Array(7).fill(undefined) as Array<SlotValue>

const arr = new Array(6).fill(firstArr) as Array<SlotValue>[]

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState<Array<SlotValue>[]>(arr)
  const [turn, setTurn] = useState<PlayerEnum>(PlayerEnum.A)
  const [winner, setWinner] = useState<PlayerEnum | undefined>(undefined)
  const [timerStarted, setTimerStarted] = useState<undefined | number>(undefined)
  const [moves, setMoves] = useState<number>(0)
  const insets = useSafeAreaInsets();
  const setFirstPlayer = () => {
    // TODO
  }
  useEffect(() => {
    setFirstPlayer()
  }, [])
  const onPressSlot = (column: number, row: number) => {
    if(timerStarted === undefined){
      // this is the first move, start the timer
      setTimerStarted(Date.now())
    }
    setMoves(moves + 1)
    if(!winner){
      console.log(`Player ${turn} pressed column ${column} row ${row}`)
      // update the rows with the token in the slot above the highest
      const updatedRows = getUpdatedRows(rows, column, turn)
      setRows(updatedRows)
      // change turns
      const nextPlayer = turn === PlayerEnum.A ? PlayerEnum.B : PlayerEnum.A
      setTurn(nextPlayer)
      const winner = checkForWinner(updatedRows)
      if(winner !== undefined){
        const now = Date.now()
        setWinner(winner)
        dispatch(addGame({winner, endTimestamp: now, duration: now - timerStarted!, moves}))
        console.log('winner!', winner)
      }
    }
  }
  const resetGame = () => {
    setTimerStarted(undefined)
    setMoves(0)
  }
  const getColor = (element: SlotValue) => {
    switch (element) {
      case PlayerEnum.A:
        return "red"
      case PlayerEnum.B:
        return "black"
      default:
        return "white"
    }
  } 
  const startNewGame = () => {
    setFirstPlayer();
    setRows(arr)
    setWinner(undefined)
  }
  return (
      <ThemedView 
        style={{
          flex: 1, 
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 30,
          paddingRight: insets.right + 30,
        }}
      >
      <ThemedText type='title'>Four in a Row!</ThemedText>
      <ThemedText type="subtitle">Red and black take turns.</ThemedText>
      <ThemedView style={{paddingVertical: 30}}>
        {rows.map((row, rowNum) => {
          return (
            <View key={`row-${rowNum}`}style={styles.row}>
              {row.map((element, columnNum) => {
                return (
                  <TouchableHighlight 
                      style={styles.slot} 
                      onPress={() => onPressSlot(columnNum, rowNum)}
                      key={`slot-${columnNum}-row-${rowNum}`}
                  >
                    <Svg height="70%" width="70%" viewBox="0 0 100 100">
                      <Circle cx="50" cy="50" r="45" stroke="grey" strokeWidth="2.5" fill={getColor(element)}/>
                    </Svg>
                  </TouchableHighlight>
                )
              })}
            </View>)
        })}
      </ThemedView>
      {!winner && <ThemedText>Your move, <ThemedText style={{color: getColor(turn), fontWeight: 'bold', textTransform: 'uppercase'}}>{getColor(turn)}</ThemedText></ThemedText>}
      {winner && 
        <>
          <ThemedText>
            Congratulations, {winner}, you won!
          </ThemedText>
          <ThemedButton onPress={startNewGame} text={'Start a new game'}/>
        </>}
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    backgroundColor: 'yellow',
  },
  slot: {
    flex: 1,
    width: '14.28%',
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  }
});
