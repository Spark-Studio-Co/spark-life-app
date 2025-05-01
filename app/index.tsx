import { StyleSheet, View, } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

export default function WebViewScreen() {
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