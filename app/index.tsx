import { StyleSheet, View, Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as Permissions from 'expo-permissions';
import { useEffect } from 'react';

export default function WebViewScreen() {
    // JavaScript to inject into WebView to handle microphone permissions
    const injectedJavaScript = `
        // Override getUserMedia to show a permission dialog
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || 
        ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia) ? 
            function(c) {
                return new Promise(function(y, n) {
                    (navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia).call(navigator, c, y, n);
                });
            } : null);

        // Notify React Native when permission is requested
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = function(constraints) {
            if (constraints && constraints.audio) {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'microphone_permission'}));
            }
            return originalGetUserMedia.apply(this, arguments);
        };
    `;

    useEffect(() => {
        async function requestMicrophonePermission() {
            const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            if (status !== 'granted') {
                Alert.alert('Разрешение требуется', 'Доступ к микрофону необходим для работы приложения');
            }
        }

        requestMicrophonePermission();
    }, []);


    return (
        <View style={styles.container}>
            <ExpoStatusBar style="dark" />
            <WebView
                source={{ uri: 'https://kazonline.kz/' }}
                javaScriptEnabled
                domStorageEnabled
                style={styles.webview}
                contentMode="mobile"
                scalesPageToFit
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback={true}
                injectedJavaScript={injectedJavaScript}
                onMessage={(event) => {
                    try {
                        const data = JSON.parse(event.nativeEvent.data);
                        if (data.type === 'microphone_permission') {
                            // Request microphone permission when the website tries to access it
                            if (Platform.OS === 'ios') {
                                Permissions.askAsync(Permissions.AUDIO_RECORDING)
                                    .then(({ status }) => {
                                        if (status !== 'granted') {
                                            Alert.alert('Permission required', 'Microphone access is required for this feature');
                                        }
                                    });
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing WebView message:', error);
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        margin: 0,
        // marginTop: Constants.statusBarHeight,
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