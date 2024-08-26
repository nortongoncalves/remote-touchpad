import { TouchPadEvent } from '@/entities/TouchPadEvent';
import { SocketChannel } from '@/entities/SocketChannel';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Text, StyleSheet, View, GestureResponderEvent, Pressable } from 'react-native';

type DataSource = {

}

export default function HomeScreen() {
  const {socket} = useWebSocket();

  let currentLocationX = 0;
  let currentLocationY = 0;
  let currentPressTimestamp = 0;

  function updateCurrentLocation({
    newCurrentLocationX,
    newCurrentLocationY
  }: {newCurrentLocationX: number; newCurrentLocationY: number}) {
    currentLocationX = newCurrentLocationX;
    currentLocationY = newCurrentLocationY;
  }

  function handleTouchMove(event: GestureResponderEvent) {
    const {locationX, locationY} = event.nativeEvent;
    const touchPadEvent: TouchPadEvent = {
      type: 'Move',
      moveLocationX: String(Math.round(currentLocationX - locationX)),
      moveLocationY: String(Math.round(currentLocationY - locationY))
    }
    if (Number(touchPadEvent.moveLocationX) > 100 || Number(touchPadEvent.moveLocationX) < -100) return;
    if (Number(touchPadEvent.moveLocationY) > 100 || Number(touchPadEvent.moveLocationY) < -100) return;
    if (locationX === currentLocationX && locationY === currentLocationY) return;
    console.log('touchPadEvent: ', touchPadEvent);
    socket.emit(SocketChannel.TouchPadEvent, JSON.stringify(touchPadEvent));
    updateCurrentLocation({
      newCurrentLocationX: locationX,
      newCurrentLocationY: locationY,
    });
  }

  function handleTouchStart(event: GestureResponderEvent) {
    const {locationX, locationY} = event.nativeEvent;
    if (event.nativeEvent.touches.length >= 2) {
      const touchPadEvent: TouchPadEvent = {
        type: 'RightClick',
      }
      socket.emit(SocketChannel.TouchPadEvent, JSON.stringify(touchPadEvent));
    }
    updateCurrentLocation({
      newCurrentLocationX: Math.round(locationX),
      newCurrentLocationY: Math.round(locationY),
    });
  }

  function handlePress(event: GestureResponderEvent) {
    const { timestamp } = event.nativeEvent;
    if (timestamp - currentPressTimestamp > 300) {
      currentPressTimestamp = timestamp;
      return;
    }
    const touchPadEvent: TouchPadEvent = {
      type: 'LeftClick',
    }
    socket.emit(SocketChannel.TouchPadEvent, JSON.stringify(touchPadEvent));
    currentPressTimestamp = timestamp;
  }

  return (
    <Pressable style={styles.containerView} onTouchMove={handleTouchMove} onTouchStart={handleTouchStart} onPressIn={handlePress}>
      <View style={styles.contentView}>
        <Text style={styles.text}>TouchPad</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  contentView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#222',
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: '900',
    textAlign: 'center'
  }
});
