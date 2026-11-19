import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private platformId = inject(PLATFORM_ID);
  private ctx?: AudioContext;

  ding(): void {
    // 🛑 Skip on the server and in test environments without audio
    if (!isPlatformBrowser(this.platformId) || typeof AudioContext === 'undefined') return;

    try {
      this.ctx ??= new AudioContext();          // created on the first click
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const ctx = this.ctx;
      const now = ctx.currentTime;

      [880, 1320].forEach((freq, i) => {        // two notes = "ding-ding"
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.08;               // second note starts 80ms later

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01); // quick attack
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5); // smooth fade

        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.5);
      });
    } catch {
      /* sound is a bonus, so never break add-to-cart over it */
    }
  }
}