/**
 * SoundService - Handles sound effects playback with audio caching, iOS unlocking, and error handling.
 */
export class SoundService {
  constructor() {
    this.soundPaths = {
      approve: 'Assets/Sounds/Approve.mp3',
      reject: 'Assets/Sounds/Reject.mp3',
      receiveMoney: 'Assets/Sounds/Receive_money.mp3',
      warning: 'Assets/Sounds/Warning.mp3',
      raisePrice: 'Assets/Sounds/Raise_price.mp3',
      downPrice: 'Assets/Sounds/Down_price.mp3'
    };

    this.audioPool = {};
    this.isMuted = false;
    this.unlocked = false;

    // Pre-create a pool of 3 Audio instances per sound for overlapping
    for (const key in this.soundPaths) {
      this.audioPool[key] = {
        instances: [],
        currentIndex: 0
      };
      for (let i = 0; i < 3; i++) {
        const audio = new Audio(this.soundPaths[key]);
        audio.preload = 'auto';
        this.audioPool[key].instances.push(audio);
      }
    }

    // Bind interaction events to unlock audio on iOS (Autoplay Policy Bypass)
    this._unlockHandler = this._unlockAudio.bind(this);
    if (typeof document !== 'undefined') {
      document.addEventListener('touchstart', this._unlockHandler, { once: true, capture: true });
      document.addEventListener('click', this._unlockHandler, { once: true, capture: true });
    }
  }

  _unlockAudio() {
    if (this.unlocked) return;
    this.unlocked = true;
    
    // Play and immediately pause all instances to unlock them in iOS Safari
    for (const key in this.audioPool) {
      const instances = this.audioPool[key].instances;
      instances.forEach(audio => {
        try {
          const playPromise = audio.play();
          audio.pause();
          audio.currentTime = 0;
          if (playPromise !== undefined) {
            playPromise.catch(() => {}); // Catch AbortError caused by immediate pause
          }
        } catch (e) {
          // Ignore
        }
      });
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('touchstart', this._unlockHandler, { capture: true });
      document.removeEventListener('click', this._unlockHandler, { capture: true });
    }
  }

  /**
   * Helper to safely play a sound from the pre-unlocked pool.
   * @param {string} key - The key in this.soundPaths
   */
  playSound(key) {
    if (this.isMuted) return;
    const poolItem = this.audioPool[key];
    if (!poolItem) return;

    try {
      // Get next instance from the pool (round-robin)
      const audio = poolItem.instances[poolItem.currentIndex];
      poolItem.currentIndex = (poolItem.currentIndex + 1) % poolItem.instances.length;

      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Gracefully suppress autoplay policy or missing file errors
          console.warn(`[SoundService] Could not play sound "${key}":`, err.message);
        });
      }
    } catch (err) {
      console.warn(`[SoundService] Audio error on "${key}":`, err);
    }
  }

  playApprove() {
    this.playSound('approve');
  }

  playReject() {
    this.playSound('reject');
  }

  playReceiveMoney() {
    this.playSound('receiveMoney');
  }

  playWarning() {
    this.playSound('warning');
  }

  playRaisePrice() {
    this.playSound('raisePrice');
  }

  playDownPrice() {
    this.playSound('downPrice');
  }
}

