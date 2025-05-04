import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
    const [permissionsGranted, setPermissionsGranted] = useState(false);

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        try {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: micStatus } = await Audio.requestPermissionsAsync();

            const granted = cameraStatus === 'granted' && micStatus === 'granted';
            setPermissionsGranted(granted);

            if (!granted) {
                Alert.alert(
                    'Разрешения нужны',
                    'Для работы сайта нужно разрешение на использование камеры и микрофона.',
                    [{ text: 'OK' }]
                );
            }
        } catch (err) {
            console.error('Ошибка запроса разрешений:', err);
        }
    };

    return (
        <View style={styles.container}>
            <ExpoStatusBar style="dark" />
            {permissionsGranted && (
                <WebView
                    source={{ uri: 'https://kazonline.kz' }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    sharedCookiesEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    cacheEnabled={true}
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    contentMode="mobile"
                    style={styles.webview}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        margin: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    webview: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: 'transparent',
    },
});