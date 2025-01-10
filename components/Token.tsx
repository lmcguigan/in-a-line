import { ColorValue, StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface PlayerNameProps {
    fill?: ColorValue
    stroke?: ColorValue
    size?: number
    containerStyle?: StyleProp<ViewStyle>
}

export function Token({
  fill, stroke, size = 50, containerStyle = {}
}: PlayerNameProps) {

  return (
    <View style={[{width: size, height: size, justifyContent: 'center', alignItems: 'center'}, containerStyle]}>
        <Svg height="70%" width="70%" viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="45" stroke={stroke} strokeWidth="10" fill={fill}/>
        </Svg>
    </View>
  );
}

