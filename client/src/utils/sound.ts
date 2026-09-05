type SoundName = 'click' | 'panel' | 'achievement' | 'mission' | 'notification'

const UI_SOUNDS: Record<SoundName, { freq: number; end: number; type: OscillatorType }> = {
  click: { freq: 88, end: 0.09, type: 'square' },
  panel: { freq: 55, end: 0.18, type: 'sine' },
  achievement: { freq: 660, end: 0.4, type: 'triangle' },
  mission: { freq: 130, end: 0.3, type: 'sawtooth' },
  notification: { freq: 110, end: 0.15, type: 'sine' },
}

class SoundSystem {
  private enabled = false
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private ambientGain: GainNode | null = null
  private nodes: AudioNode[] = []
  private heartbeatTimer: number | null = null
  private volume = 1

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.volume
      this.master.connect(this.ctx.destination)
      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.value = 0
      this.ambientGain.connect(this.master)
    }
    return this.ctx
  }

  setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value))
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05)
    }
  }

  getVolume(): number {
    return this.volume
  }

  enable(): void {
    this.enabled = true
    try {
      const ctx = this.ensureContext()
      if (ctx.state === 'suspended') void ctx.resume()
      if (this.ambientGain) {
        this.ambientGain.gain.cancelScheduledValues(ctx.currentTime)
        this.ambientGain.gain.setTargetAtTime(1, ctx.currentTime, 0.3)
      }
      this.startAmbience()
    } catch {
      /* audio unavailable — ignore, button stays usable */
    }
  }

  disable(): void {
    this.enabled = false
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime)
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15)
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  private startAmbience(): void {
    const ctx = this.ensureContext()
    if (!this.master || !this.ambientGain) return
    this.nodes.forEach((n) => {
      try {
        n.disconnect()
      } catch {
        /* already disconnected */
      }
    })
    this.nodes = []

    const ambience = this.ambientGain

    // Low drone with beating (two detuned sub oscillators) + audible overtone
    const droneA = ctx.createOscillator()
    droneA.type = 'sine'
    droneA.frequency.value = 28
    const droneB = ctx.createOscillator()
    droneB.type = 'sine'
    droneB.frequency.value = 28.4
    const droneC = ctx.createOscillator()
    droneC.type = 'sine'
    droneC.frequency.value = 56.6
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.3
    droneA.connect(droneGain)
    droneB.connect(droneGain)
    droneC.connect(droneGain)
    droneGain.connect(ambience)
    droneA.start()
    droneB.start()
    droneC.start()
    this.nodes.push(droneA, droneB, droneC, droneGain)

    // Dark growl: detuned saws filtered low-mid (audible on laptop speakers)
    const growl1 = ctx.createOscillator()
    growl1.type = 'sawtooth'
    growl1.frequency.value = 54
    const growl2 = ctx.createOscillator()
    growl2.type = 'sawtooth'
    growl2.frequency.value = 54.7
    const growlFilter = ctx.createBiquadFilter()
    growlFilter.type = 'lowpass'
    growlFilter.frequency.value = 340
    const growlGain = ctx.createGain()
    growlGain.gain.value = 0.22
    growl1.connect(growlFilter)
    growl2.connect(growlFilter)
    growlFilter.connect(growlGain)
    growlGain.connect(ambience)
    growl1.start()
    growl2.start()
    this.nodes.push(growl1, growl2, growlFilter, growlGain)

    // Dissonant shimmering (slow LFO on a piercing pair)
    const shimmer1 = ctx.createOscillator()
    shimmer1.type = 'triangle'
    shimmer1.frequency.value = 523.25
    const shimmer2 = ctx.createOscillator()
    shimmer2.type = 'triangle'
    shimmer2.frequency.value = 527.4
    const shimmerGain = ctx.createGain()
    shimmerGain.gain.value = 0.02
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.08
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.014
    lfo.connect(lfoGain)
    lfoGain.connect(shimmerGain.gain)
    shimmer1.connect(shimmerGain)
    shimmer2.connect(shimmerGain)
    shimmerGain.connect(ambience)
    shimmer1.start()
    shimmer2.start()
    lfo.start()
    this.nodes.push(shimmer1, shimmer2, shimmerGain, lfo, lfoGain)

    // Wind: filtered noise
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
    const data = noiseBuf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuf
    noise.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 480
    noiseFilter.Q.value = 1.1
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.09
    const windLfo = ctx.createOscillator()
    windLfo.frequency.value = 0.05
    const windLfoGain = ctx.createGain()
    windLfoGain.gain.value = 0.07
    windLfo.connect(windLfoGain)
    windLfoGain.connect(noiseGain.gain)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ambience)
    noise.start()
    windLfo.start()
    this.nodes.push(noise, noiseFilter, noiseGain, windLfo, windLfoGain)

    // Machinery hum: mid harmonics audible on laptop/phone speakers
    const hum1 = ctx.createOscillator()
    hum1.type = 'sine'
    hum1.frequency.value = 164
    const hum2 = ctx.createOscillator()
    hum2.type = 'triangle'
    hum2.frequency.value = 247
    const humGain = ctx.createGain()
    humGain.gain.value = 0.055
    hum1.connect(humGain)
    hum2.connect(humGain)
    humGain.connect(ambience)
    hum1.start()
    hum2.start()
    this.nodes.push(hum1, hum2, humGain)

    // Fade ambience in
    ambience.gain.setTargetAtTime(1, ctx.currentTime, 0.8)

    // Heartbeat scheduler
    if (this.heartbeatTimer !== null) window.clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = window.setInterval(() => {
      if (!this.enabled || !this.ctx || !this.master) return
      this.thump(0)
      window.setTimeout(() => this.thump(0.18), 400)
    }, 1500)
  }

  private thump(whenOffset: number): void {
    if (!this.ctx || !this.master) return
    const t = this.ctx.currentTime + whenOffset
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(52, t)
    osc.frequency.exponentialRampToValueAtTime(28, t + 0.12)
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.7, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(t)
    osc.stop(t + 0.45)
  }

  play(name: SoundName): void {
    if (!this.enabled || !this.ctx || !this.master) return
    const { freq, end, type } = UI_SOUNDS[name]

    if (name === 'notification' || name === 'achievement') {
      // Dissonant alarm sting
      const det = name === 'notification' ? 1.03 : 1.017
      this.sting(freq, det, end)
      this.sting(freq / 2, 1, end + 0.08, type === 'sine' ? 'sawtooth' : type)
      return
    }

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + end)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start()
    osc.stop(this.ctx.currentTime + end)
  }

  private sting(freq: number, detuneRatio: number, end: number, type: OscillatorType = 'sine'): void {
    if (!this.ctx || !this.master) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq * detuneRatio, this.ctx.currentTime)
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.14, this.ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + end)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start()
    osc.stop(this.ctx.currentTime + end)
  }
}

export const soundSystem = new SoundSystem()