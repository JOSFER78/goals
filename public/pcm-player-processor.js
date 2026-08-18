/**
 * public/pcm-player-processor.js
 * 
 * AudioWorklet Processor para reproducción fluida de audio PCM sin jitter
 * con vaciado instantáneo en 0ms (FLUSH) para cancelación de interrupciones (barge-in).
 */

class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ringBufferSize = 48000 * 3; // 3 segundos de buffer circular
    this.ringBuffer = new Float32Array(this.ringBufferSize);
    this.writePointer = 0;
    this.readPointer = 0;
    this.isInterrupted = false;

    this.port.onmessage = (event) => {
      if (event.data.type === 'AUDIO') {
        if (this.isInterrupted) return;
        const int16Array = new Int16Array(event.data.buffer);
        for (let i = 0; i < int16Array.length; i++) {
          this.ringBuffer[this.writePointer] = int16Array[i] / 32768.0;
          this.writePointer = (this.writePointer + 1) % this.ringBufferSize;
        }
      } else if (event.data.type === 'FLUSH') {
        // Barge-in instantáneo: vaciar inmediatamente el buffer
        this.writePointer = 0;
        this.readPointer = 0;
        this.isInterrupted = false;
      }
    };
  }

  process(_inputs, outputs, _parameters) {
    const output = outputs[0];
    if (!output || output.length === 0) return true;
    const channel = output[0];

    for (let i = 0; i < channel.length; i++) {
      if (this.readPointer !== this.writePointer) {
        channel[i] = this.ringBuffer[this.readPointer];
        this.readPointer = (this.readPointer + 1) % this.ringBufferSize;
      } else {
        channel[i] = 0; // Silencio
      }
    }
    return true;
  }
}

registerProcessor('pcm-player-processor', PCMPlayerProcessor);
