import { PlayerName } from '@/components/PlayerName';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { addGame } from '@/store/gameWinningsSlice';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { getColor, getRingColor, getShadowColor } from '@/utils/color-utils';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { checkForWinner, getUpdatedRows, PlayerEnum, SlotValue } from '../../utils/game-utils';
import { convertSecsToMMSSString } from '@/utils/time-utils';

const firstArr = new Array(7).fill(undefined) as Array<SlotValue>

const arr = new Array(6).fill(firstArr) as Array<SlotValue>[]

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const dispatch = useAppDispatch();
  const playerAColor = useSelector((state: RootState) => state.settings.playerAColor)
  const playerBColor = useSelector((state: RootState) => state.settings.playerBColor)
  const rackColor = useSelector((state: RootState) => state.settings.rackColor)
  const [rows, setRows] = useState<Array<SlotValue>[]>(arr)
  const [turn, setTurn] = useState<PlayerEnum | null>(null)
  const [winner, setWinner] = useState<PlayerEnum | undefined>(undefined)
  const [moves, setMoves] = useState<number>(0)
  const [highlightedColumn, setHighlightedColumn] = useState<number | undefined>(undefined)
  const intervalRef = useRef<null | NodeJS.Timeout>(null);
  const lastTimestampRef = useRef(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [secs, setSecs] = useState<number>(0)
  const insets = useSafeAreaInsets();
  const palette = {playerAColor, playerBColor, backgroundColor}
  const setFirstPlayer = () => {
    const randomizedPlayer = Math.random() < 0.5 ? PlayerEnum.A : PlayerEnum.B
    setTurn(randomizedPlayer)
  }
  const startTimer = (timeElapsed: number) => {
    setIsTimerRunning(true);
    lastTimestampRef.current = Date.now();
    intervalRef.current = setInterval(() => {
        const secondsEllapsed = Math.floor((Date.now() - lastTimestampRef.current)/1000) + timeElapsed
        if(secondsEllapsed > 3600){
          stopTimer()
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
    setIsTimerRunning(false);
  }

  const onPressSlot = (column: number, row: number) => {
    if(isTimerRunning && turn){
      setMoves(moves + 1)
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
        dispatch(addGame({winner: newWinner, endTimestamp: now, duration: secs, moves, color: getColor(newWinner, palette)}))
        stopTimer()
      }
    }
  }
  const startNewGame = () => {
    setTurn(null)
    setRows(arr)
    setWinner(undefined)
    setMoves(0)
    setSecs(0)
  }
  const onPressPausePlay = () => {
    if(isTimerRunning){
      stopTimer()
    } else {
      startTimer(secs)
    }
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
      <View style={{paddingTop: 30, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <ThemedText style={styles.subheaders}>Moves</ThemedText>
          <ThemedText style={{textAlign: 'center'}}>{moves}</ThemedText>
        </View>
        <View style={{flex: 1}}>
          <ThemedText style={styles.subheaders}>Time Elapsed</ThemedText>
          <ThemedText style={{textAlign: 'center', minWidth: 70}}> {convertSecsToMMSSString(secs)}</ThemedText>
        </View>
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
                    <Svg height="80%" width="80%" viewBox="0 0 100 100">
                      <Circle cx="50" cy="50" r="49" fill={getShadowColor(rackColor)}/>
                      <Circle cx="50" cy="50" r="41" stroke={getRingColor(rackColor)} strokeWidth="2.5" fill={getShadowColor(getColor(element, palette))}/>
                      <Circle cx="53" cy='53' r="34" fill={getColor(element, palette)}/>
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
        justifyContent: turn ? 'space-between' : 'flex-end'}}>
        {!winner && 
          <>
            {turn ?
              <>
                {isTimerRunning ? 
                <ThemedText style={{fontSize: 20, fontWeight: 'bold'}}>Your move, <PlayerName palette={palette} player={turn}/></ThemedText>
                : <ThemedText style={{fontSize: 20, fontWeight: 'bold'}}>Game paused</ThemedText>}
                <ThemedButton onPress={onPressPausePlay} text={isTimerRunning ? 'Pause Game' : 'Resume Game'} />
              </>
              :
              <ThemedButton onPress={() => {
                setFirstPlayer()
                startTimer(0)
              }} text={'Start the game'}/>
            }
          </>
        }
        {winner && 
          <>
            <ThemedText style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
              Congratulations, <PlayerName palette={palette} player={winner}/>! {"\n\n"}You won!
            </ThemedText>
            <ThemedButton onPress={startNewGame} text={'New game'}/>
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
  },
  subheaders: {
    textAlign: 'center', 
    fontWeight: 'bold', 
  }
});
