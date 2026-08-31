type SceneFallbackProps = {
  message?: string;
};

export function SceneFallback({ message = "Preparing 3D scene" }: SceneFallbackProps) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-surface/20" role="status">
      <div className="text-center">
        <div className="mx-auto mb-4 h-px w-28 bg-accent/70" />
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-secondary-text">
          {message}
        </p>
      </div>
    </div>
  );
}
