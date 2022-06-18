import Animated, {
    withSpring,
    useSharedValue,
    useAnimatedStyle
} from 'react-native-reanimated';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

import React from 'react';

const Button = ({ onPress, name }) => {
    const { View, Value } = Animated;
    const [bgColor, setBgColor] = React.useState<string>('transparent');

    //Animation Function Starts
    const offset = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withSpring(offset.value * -255, {
                        damping: 20
                        // stiffness: 90
                    })
                }
            ]
        };
    });
    // background color Function
    function randomHex(): string {
        let color: string = 'white';

        return color;
    }
    return (
        <Animated.View style={animatedStyles}>
            <TouchableWithoutFeedback
                onPress={onPress}
                onPressIn={() => {
                    (offset.value = withSpring(0.5)), setBgColor(randomHex());
                }}
                onPressOut={() => {
                    (offset.value = withSpring(0)), setBgColor('transparent');
                }}
            >
                <Entypo
                    name={name}
                    size={40}
                    color="black"
                    style={[styles.icons, { backgroundColor: bgColor }]}
                />
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};

export default Button;

const styles = StyleSheet.create({
    icons: {
        borderWidth: 3,
        borderColor: 'rgb(170, 207, 202)',
        borderRadius: 40,
        padding: 10,
        textAlign: 'center'
    }
});
