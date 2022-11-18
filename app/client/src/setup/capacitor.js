import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Camera } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { Motion } from '@capacitor/motion';
import { Geolocation } from '@capacitor/geolocation';

let module = Capacitor
if (Capacitor.getPlatform() !== 'web') {
  // TODO optimize this. Either make it in a way that we just include plugins if we know we are on mobile or remove this file entirely and add it to the build only during mobile build
  Capacitor.SplashScreen = SplashScreen
  Capacitor.Camera = Camera
  Capacitor.Toast = Toast
  Capacitor.Motion = Motion
  Capacitor.Geolocation = Geolocation

} else {
  module = false
}
export default module