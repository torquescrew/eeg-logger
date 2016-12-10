

export abstract class HeadsetManager {

   abstract async connect();

   abstract isConnected(): boolean;

   abstract startRecording(): void;

   abstract stopRecording(): void;

   abstract getRecordedData(): any[];

}

