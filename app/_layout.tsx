import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: '🎙️ Sound Recorder',
            title: 'Sound Recorder',
          }}
        />
        <Drawer.Screen
          name="recordings" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: '📃 Recordings ',
            title: 'Recordings',
          }}
        />
        <Drawer.Screen
          name="settings" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: '⚙️ Settings ',
            title: 'Settings',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
