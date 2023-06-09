/*
 * The capacitator helps creating the mobile app
 */
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { Motion } from '@capacitor/motion';
import { Geolocation } from '@capacitor/geolocation';
import { TextZoom } from '@capacitor/text-zoom';
import { PushNotifications } from '@capacitor/push-notifications';
import { ScreenReader } from '@capacitor/screen-reader';
import { Network } from '@capacitor/network';

const createCapacitorInstance = () => {
  if (Capacitor.getPlatform() !== 'web') {
    // TODO optimize this. Either make it in a way that we just include plugins
    // if we know we are on mobile or remove this file entirely and add it to the
    // build only during mobile build
    Capacitor.SplashScreen = SplashScreen
    Capacitor.Camera = Camera
    Capacitor.CameraResultType = CameraResultType
    Capacitor.Toast = Toast
    Capacitor.Motion = Motion
    Capacitor.Geolocation = Geolocation
    Capacitor.TextZoom = TextZoom
    Capacitor.PushNotifications = PushNotifications
    Capacitor.ScreenReader = ScreenReader
    Capacitor.Network = Network
    return Capacitor
  } else {
    return false
  }
}

export default createCapacitorInstance()
export { createCapacitorInstance }
