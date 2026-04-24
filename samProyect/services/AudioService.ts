import { Audio } from 'expo-av'; 

export const AudioService = {
  
  /**
   * Reproduce un sonido de confirmación (beep) y gestiona la liberación de memoria
   */
  async playBeep() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/audio/beep.mp3')
      );

      await sound.playAsync();

      // Monitorizamos el estado para descargar el audio una vez finalizado
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          console.log(`[${new Date().toLocaleTimeString()}] [audioService] Recurso de audio liberado`);
        }
      });
    } catch (error) {
      console.log(`[${new Date().toLocaleTimeString()}] [audioService] Error al reproducir beep:`, error);
    }
  }
}