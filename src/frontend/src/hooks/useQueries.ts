import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob, type FileType, type HistoryRecord } from "../backend";
import { useActor } from "./useActor";

export function useGetAllHistoryRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<HistoryRecord[]>({
    queryKey: ["historyRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHistoryRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHistoryRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      filename,
      fileType,
      scaleFactor,
      sharpness,
      noiseReduction,
      originalBytes,
      processedBytes,
      fileSize,
    }: {
      id: string;
      filename: string;
      fileType: FileType;
      scaleFactor: bigint;
      sharpness: bigint;
      noiseReduction: boolean;
      originalBytes: Uint8Array<ArrayBuffer>;
      processedBytes: Uint8Array<ArrayBuffer>;
      fileSize: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const originalBlob = ExternalBlob.fromBytes(originalBytes);
      const processedBlob = ExternalBlob.fromBytes(processedBytes);
      await actor.addHistoryRecord(
        id,
        filename,
        fileType,
        scaleFactor,
        sharpness,
        noiseReduction,
        originalBlob,
        processedBlob,
        fileSize,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historyRecords"] });
    },
  });
}

export function useDeleteHistoryRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteHistoryRecord(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historyRecords"] });
    },
  });
}

export function useClearAllHistoryRecords() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.clearAllHistoryRecords();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historyRecords"] });
    },
  });
}
