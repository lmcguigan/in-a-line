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
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'contrastText');

  return (
    <Pressable
      style={[{backgroundColor: buttonColor}, styles.buttonBaseStyle, style as any]}
      {...rest}
    >
      <Text style={[{ color: textColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBaseStyle: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
    width: '80%',
  }
});
