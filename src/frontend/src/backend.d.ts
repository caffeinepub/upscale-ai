import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface HistoryRecord {
    id: string;
    noiseReduction: boolean;
    originalBlob: ExternalBlob;
    sharpness: bigint;
    fileSize: bigint;
    fileType: FileType;
    filename: string;
    timestamp: bigint;
    processedBlob: ExternalBlob;
    scaleFactor: bigint;
}
export enum FileType {
    video = "video",
    photo = "photo"
}
export interface backendInterface {
    addHistoryRecord(id: string, filename: string, fileType: FileType, scaleFactor: bigint, sharpness: bigint, noiseReduction: boolean, originalBlob: ExternalBlob, processedBlob: ExternalBlob, fileSize: bigint): Promise<void>;
    clearAllHistoryRecords(): Promise<void>;
    deleteHistoryRecord(id: string): Promise<void>;
    getAllHistoryRecords(): Promise<Array<HistoryRecord>>;
}
