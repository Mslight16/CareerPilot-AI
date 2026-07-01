import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm resize-y",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium text-slate-300", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Slider({ className, ...props }) {
  return (
    <input
      type="range"
      className={cn(
        "w-full h-2 rounded-full appearance-none bg-white/10 accent-indigo-500 cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

export function Checkbox({ className, checked, onChange, label, ...props }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn(
          "h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50",
          className
        )}
        {...props}
      />
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}
