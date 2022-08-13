/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { io, Socket } from 'socket.io-client';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    connectServer();
  }, []);

  useEffect(() => {
    return () => disconnectServer();
  });

  const disconnectServer = () => {
    if (socket) {
      socket.disconnect();
      setConnected(false);
    }
  };

  const connectServer = () => {
    const socket = io('http://192.168.0.146:3000', {
      reconnectionDelayMax: 10000,
    });
    setSocket(socket);
    setConnected(true);
  };

  if (socket) {
    socket.io.on('close', () => {
      setConnected(false);
      setSocket(null);
    });

    socket.io.on('error', () => {
      setConnected(false);
      setSocket(null);
      Alert.alert(
        '❗ Erro ao conectar no servidor',
        'Não foi possível se conectar ao servidor. Verifique sua conexão com a rede 😣',
      );
    });

    socket.io.on('open', () => {
      setConnected(true);
      setSocket(socket);
    });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View>
          <Text>Olá mundo se conectando ao servidor...</Text>
          <Text>Status: {connected ? 'Conectado' : 'Desconectado'}</Text>
          <TouchableOpacity
            onPress={connected ? disconnectServer : connectServer}
            style={{
              marginTop: 10,
              flex: 1,
            }}
          >
            <Text>{connected ? 'Disconnect' : 'Reconnect'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
