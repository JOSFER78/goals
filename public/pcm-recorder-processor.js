/**
 * public/pcm-recorder-processor.js
 * 
 * AudioWorklet Processor para captura de micrófono en tiempo real.
 * Resamplea el stream a 16kHz PCM Int16 Little-Endian mono y emite chunks binarios.
 */

class PCMRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
    this.targetSampleRate = 16000;
  }

  process(inputs, _outputs, _parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channelData = input[0]; // Mono

    for (let i = 0; i < channelData.length; i++) {
      this.buffer[this.bufferIndex++] = channelData[i];
      if (this.bufferIndex >= this.bufferSize) {
        this.flush();
      }
    }
    return true;
  }

  flush() {
    const ratio = sampleRate / this.targetSampleRate;
    const outputLength = Math.floor(this.bufferIndex / ratio);
    const int16Data = new Int16Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      const srcIdx = Math.floor(i * ratio);
      const s = Math.max(-1, Math.min(1, this.buffer[srcIdx]));
      int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    this.port.postMessage(int16Data.buffer, [int16Data.buffer]);
    this.bufferIndex = 0;
  }
}

registerProcessor('pcm-recorder-processor', PCMRecorderProcessor);
