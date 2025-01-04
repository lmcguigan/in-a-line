import { getColor, Palette } from '@/utils/color-utils';
import { PlayerEnum } from '@/utils/game-utils';
import { ThemedText } from './ThemedText';

interface PlayerNameProps {
    player: PlayerEnum,
    palette: Palette
}

export function PlayerName({
  player,
  palette
}: PlayerNameProps) {

  return (
    <ThemedText style={{color: getColor(player, palette), fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase'}}>
      Player {player}
    </ThemedText>
  );
}

