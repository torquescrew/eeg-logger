

export abstract class HeadsetManager {

   abstract connect();

   abstract isConnected(): boolean;

   abstract startRecording(): void;

   abstract stopRecording(): void;

   abstract getRecordedData(): any[];

}

