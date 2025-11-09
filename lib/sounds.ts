// Sound effects using Web Audio API and free sound resources

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this.audioContext = AudioContextClass ? new AudioContextClass() : null;
    }
  }

  // Generate sound effects using oscillators (no external files needed!)
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-3 * t); // Decay envelope

      if (type === 'sine') {
        data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope;
      } else if (type === 'square') {
        data[i] = (Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1) * envelope;
      } else if (type === 'triangle') {
        data[i] = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t)) * envelope;
      }
    }

    return buffer;
  }

  private createChord(frequencies: number[], duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-2 * t);
      let sample = 0;

      frequencies.forEach(freq => {
        sample += Math.sin(2 * Math.PI * freq * t);
      });

      data[i] = (sample / frequencies.length) * envelope * 0.3;
    }

    return buffer;
  }

  // Initialize all sound effects
  async initialize() {
    if (!this.audioContext) return;

    try {
      // Player joined - ascending bell tone
      this.sounds.set('player-join', this.createChord([523.25, 659.25, 783.99], 0.3)); // C, E, G

      // Player left - descending tone
      this.sounds.set('player-leave', this.createChord([783.99, 659.25, 523.25], 0.3)); // G, E, C

      // Submission received - success ping
      this.sounds.set('submission', this.createTone(800, 0.2, 'sine'));

      // Game start - fanfare
      this.sounds.set('game-start', this.createChord([523.25, 659.25, 783.99, 1046.50], 0.5)); // C major chord

      // Button click - soft click
      this.sounds.set('click', this.createTone(600, 0.05, 'sine'));

      // Success - celebration
      this.sounds.set('success', this.createChord([523.25, 659.25, 783.99, 1046.50], 0.4));

      // Error - low beep
      this.sounds.set('error', this.createTone(200, 0.3, 'square'));

      // Reveal - suspense drum roll effect
      this.sounds.set('reveal', this.createTone(100, 0.8, 'triangle'));

      // Turkey gobble effect (fun!)
      this.sounds.set('turkey', this.createTurkeyGobble());

      // Achievement unlocked
      this.sounds.set('achievement', this.createChord([659.25, 783.99, 1046.50, 1318.51], 0.6));

    } catch (error) {
      console.error('Failed to initialize sounds:', error);
    }
  }

  private createTurkeyGobble(): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.5;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const wobble = 200 + 150 * Math.sin(30 * Math.PI * t); // Wobbling frequency
      const envelope = Math.exp(-4 * t) * (1 - t / duration);
      data[i] = Math.sin(2 * Math.PI * wobble * t) * envelope * 0.5;
    }

    return buffer;
  }

  play(soundName: string, volume: number = 0.5) {
    if (!this.enabled || !this.audioContext || !this.sounds.has(soundName)) return;

    try {
      const buffer = this.sounds.get(soundName);
      if (!buffer) return;

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0);
    } catch (error) {
      console.error('Failed to play sound:', soundName, error);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Initialize sounds when the module loads (client-side only)
if (typeof window !== 'undefined') {
  soundManager.initialize();
}

// Convenience functions
export const playSound = (soundName: string, volume?: number) => {
  soundManager.play(soundName, volume);
};

export const toggleSound = () => soundManager.toggle();
export const setSoundEnabled = (enabled: boolean) => soundManager.setEnabled(enabled);
export const isSoundEnabled = () => soundManager.isEnabled();
