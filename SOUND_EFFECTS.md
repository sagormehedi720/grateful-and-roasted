# 🔊 Sound Effects Guide

The game now includes fun sound effects to enhance the gaming experience!

## Available Sounds

All sounds are generated using the Web Audio API - **no external files needed!**

### Game Sounds

1. **🎵 player-join** - Pleasant ascending chime
   - Plays when a new player joins the game
   - Creates excitement as the party grows

2. **🦃 turkey** - Turkey gobble effect
   - Plays when you successfully join a game
   - Fun Thanksgiving-themed sound!

3. **🎺 game-start** - Fanfare chord
   - Plays when the host starts the game
   - Signals the beginning of the fun

4. **🥁 reveal** - Suspenseful drum roll
   - Plays when starting the reveal phase
   - Builds anticipation

5. **✨ success** - Celebration chord
   - Plays when you successfully submit a gratitude/roast
   - Feels rewarding!

6. **❌ error** - Low warning beep
   - Plays when something goes wrong
   - Gentle error notification

7. **👆 click** - Soft click sound
   - Plays when copying game codes
   - Subtle feedback

8. **🏆 achievement** - Victory fanfare
   - Reserved for special moments
   - (Can be used for winning, milestones, etc.)

9. **🎤 submission** - Quick ping
   - Can be used for additional feedback

## Sound Toggle

There's a **volume button** in the top-right corner of the game screen that lets you:
- 🔊 Enable sounds
- 🔇 Mute all sounds

The sound preference is saved, so it remembers your choice!

## How It Works

### Web Audio API
- All sounds are **synthes ized in real-time** using oscillators
- No external audio files required
- Super lightweight and fast
- Works in all modern browsers

### Sound Design
- **Gratitude sounds**: Warm, pleasant tones
- **Roast sounds**: Playful, cheeky tones
- **Turkey gobble**: Signature Thanksgiving sound!
- **Error sounds**: Non-intrusive warnings
- **Success sounds**: Rewarding celebrations

## Adding Custom Sounds

Want to add your own sound effects? Edit `/lib/sounds.ts`:

```typescript
// In the initialize() method, add:
this.sounds.set('my-sound', this.createTone(frequency, duration, 'sine'));

// Then use it anywhere:
playSound('my-sound', 0.5);
```

### Sound Parameters

- **Frequency**: Higher = higher pitch (Hz)
- **Duration**: How long the sound plays (seconds)
- **Type**: 'sine', 'square', 'triangle' (waveform shape)
- **Volume**: 0.0 to 1.0 (passed when playing)

## Examples

```typescript
// Subtle click
createTone(600, 0.05, 'sine')

// Deep bass
createTone(100, 0.3, 'triangle')

// Bright chime
createTone(1000, 0.2, 'sine')

// Chord (multiple frequencies)
createChord([523.25, 659.25, 783.99], 0.4) // C major
```

## Browser Compatibility

✅ Chrome/Edge
✅ Firefox
✅ Safari
✅ Mobile browsers

**Note**: Some browsers require user interaction before playing audio (handled automatically).

## Tips

- Keep volumes between 0.2 - 0.5 for comfortable listening
- Use sounds sparingly - too many can be annoying!
- Match sound character to the action (happy sounds for success, etc.)
- The turkey gobble is a crowd favorite! 🦃

---

Enjoy the enhanced audio experience! 🎵
