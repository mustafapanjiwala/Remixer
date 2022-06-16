import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { useFonts } from '@use-expo/font';
import AppLoading from 'expo-app-loading';
import Home from './src/screens/Home';

export default function App() {
    let [fontsLoaded] = useFonts({
        Reg: Montserrat_400Regular
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    }
    return (
        <View style={styles.container}>
            <Home />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#495EBB'
    }
});
