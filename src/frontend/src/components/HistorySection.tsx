import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Film,
  History,
  ImageIcon,
  Loader2,
  Maximize2,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { FileType, type HistoryRecord } from "../backend";
import {
  useClearAllHistoryRecords,
  useDeleteHistoryRecord,
  useGetAllHistoryRecords,
} from "../hooks/useQueries";

function formatFileSize(bytes: bigint): string {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const date = new Date(ms);
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

interface HistoryCardProps {
  record: HistoryRecord;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function HistoryCard({ record, onDelete, isDeleting }: HistoryCardProps) {
  const isVideo = record.fileType === FileType.video;
  const Icon = isVideo ? Film : ImageIcon;

  const processedImageUrl = isVideo
    ? null
    : record.processedBlob.getDirectURL();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl p-4 flex items-center gap-4 group hover:border-neon-cyan/20 transition-all"
    >
      {/* Thumbnail or icon */}
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-surface-3 flex items-center justify-center relative">
        {processedImageUrl ? (
          <img
            src={processedImageUrl}
            alt={record.filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon
            className={`w-6 h-6 ${isVideo ? "text-neon-violet" : "text-neon-cyan"}`}
          />
        )}
        {/* Type badge overlay */}
        <div
          className={`absolute bottom-0 right-0 w-5 h-5 rounded-tl-md flex items-center justify-center ${
            isVideo ? "bg-neon-violet/80" : "bg-neon-cyan/80"
          }`}
        >
          <Icon className="w-2.5 h-2.5 text-[oklch(0.08_0.01_260)]" />
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm truncate">{record.filename}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <Badge
            variant="secondary"
            className={`text-xs font-mono px-2 py-0 ${
              isVideo
                ? "bg-neon-violet/10 text-neon-violet border-neon-violet/20"
                : "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20"
            }`}
          >
            {isVideo ? "Video" : "Photo"}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Maximize2 className="w-3 h-3" />
            {Number(record.scaleFactor)}×
          </span>
          <span className="text-xs text-muted-foreground">
            {formatFileSize(record.fileSize)}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground/60 font-mono">
            {formatTimestamp(record.timestamp)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(record.id)}
          disabled={isDeleting}
          aria-label="Delete record"
        >
          {isDeleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export default function HistorySection() {
  const { data: records = [], isLoading } = useGetAllHistoryRecords();
  const deleteRecord = useDeleteHistoryRecord();
  const clearAll = useClearAllHistoryRecords();

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord.mutateAsync(id);
      toast.success("Record deleted");
    } catch {
      toast.error("Failed to delete record");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAll.mutateAsync();
      toast.success("History cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  };

  return (
    <section id="history" className="py-12 sm:py-16 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                <History className="w-4 h-4 text-neon-cyan" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
                  History
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {records.length} processed{" "}
                  {records.length === 1 ? "file" : "files"}
                </p>
              </div>
            </div>

            {records.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/30 text-muted-foreground hover:border-destructive/60 hover:text-destructive hover:bg-destructive/5"
                onClick={handleClearAll}
                disabled={clearAll.isPending}
              >
                {clearAll.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                )}
                Clear All
              </Button>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
            </div>
          ) : records.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl py-16 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
                <History className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-semibold text-foreground/70 mb-1">
                  No history yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Processed files will appear here after upscaling
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {records.map((record) => (
                  <HistoryCard
                    key={record.id}
                    record={record}
                    onDelete={handleDelete}
                    isDeleting={
                      deleteRecord.isPending &&
                      deleteRecord.variables === record.id
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
