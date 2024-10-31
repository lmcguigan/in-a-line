import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  text: string;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  text,
  ...rest
}: ThemedTextProps) {
  const buttonColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint')
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Pressable
      style={[{backgroundColor: buttonColor}, styles.buttonBaseStyle]}
      {...rest}
    >
      <Text style={[{ color: textColor }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBaseStyle: {
    borderRadius: 5,
    minHeight: 30,
    minWidth: 30,
    padding: 10,
    margin: 10,
  }
});
