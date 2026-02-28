import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sliders } from "lucide-react";
import { motion } from "motion/react";

interface SettingsPanelProps {
  scaleFactor: number;
  sharpness: number;
  noiseReduction: boolean;
  onScaleChange: (v: number) => void;
  onSharpnessChange: (v: number) => void;
  onNoiseReductionChange: (v: boolean) => void;
}

export default function SettingsPanel({
  scaleFactor,
  sharpness,
  noiseReduction,
  onScaleChange,
  onSharpnessChange,
  onNoiseReductionChange,
}: SettingsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-5 space-y-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-4 h-4 text-neon-cyan" />
        <span className="text-sm font-semibold font-display">
          Enhancement Settings
        </span>
      </div>

      {/* Scale Factor */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
          Scale Factor
        </Label>
        <ToggleGroup
          type="single"
          value={String(scaleFactor)}
          onValueChange={(v) => v && onScaleChange(Number(v))}
          className="grid grid-cols-3 gap-2"
        >
          {[2, 4, 8].map((s) => (
            <ToggleGroupItem
              key={s}
              value={String(s)}
              className="
                border border-border data-[state=on]:border-neon-cyan data-[state=on]:bg-neon-cyan/10
                data-[state=on]:text-neon-cyan rounded-lg h-10 text-sm font-mono font-semibold
                hover:border-neon-cyan/40 hover:text-foreground transition-all
              "
            >
              {s}x
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Sharpness */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
            Sharpness
          </Label>
          <span className="text-xs font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded">
            {sharpness}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={sharpness}
          onChange={(e) => onSharpnessChange(Number(e.target.value))}
          className="w-full accent-neon-cyan"
          aria-label="Sharpness"
        />
        <div className="flex justify-between text-xs text-muted-foreground/50 font-mono">
          <span>Soft</span>
          <span>Sharp</span>
        </div>
      </div>

      {/* Noise Reduction */}
      <div className="flex items-center justify-between py-1">
        <div>
          <Label className="text-sm font-medium">Noise Reduction</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Apply mild denoising filter
          </p>
        </div>
        <Switch
          checked={noiseReduction}
          onCheckedChange={onNoiseReductionChange}
          className="data-[state=checked]:bg-neon-cyan"
          aria-label="Toggle noise reduction"
        />
      </div>
    </motion.div>
  );
}
