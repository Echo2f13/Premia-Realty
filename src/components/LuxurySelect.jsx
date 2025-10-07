import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const buttonBase =
  "flex w-full items-center gap-3 rounded-[1.7rem] border border-gold-primary/30 bg-luxury-black/70 px-6 py-3 text-left text-sm text-platinum-pearl transition duration-200 hover:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/30";

const iconWrapper =
  "flex h-9 w-9 items-center justify-center rounded-full border border-gold-primary/35 bg-luxury-black/90 text-gold-primary/80";

const dropdownPanel =
  "mt-2 rounded-2xl border border-gold-primary/35 bg-[#0b0f18]/95 shadow-[0_26px_48px_rgba(4,4,6,0.6)]";

const optionRow =
  "flex w-full cursor-pointer items-center gap-4 rounded-xl px-4 py-3 text-sm text-platinum-pearl transition hover:bg-gold-primary/18";

const LuxurySelect = ({
  icon: Icon,
  placeholder = "Select option",
  options = [],
  value,
  onChange,
  className = "",
  name,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  const activeOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const handleSelect = (option) => {
    if (disabled) return;
    onChange?.(option.value, option);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        name={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((previous) => !previous)}
        className={`${buttonBase} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {Icon ? (
          <span className={iconWrapper}>
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <span className="truncate font-medium text-platinum-pearl/90">
            {activeOption ? activeOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 text-gold-primary/70 transition duration-200 ${open ? "-scale-y-100" : ""}`}
        />
      </button>

      <div
        className={`absolute left-0 right-0 top-full z-[60] transition duration-150 ${
          open ? "pointer-events-auto translate-y-2 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
        }`}
      >
        <div className={dropdownPanel}>
          <ul role="listbox" className="max-h-56 overflow-y-auto py-2">
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <li key={option.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`${optionRow} ${
                      selected ? "bg-gold-primary text-luxury-black" : ""
                    }`}
                  >
                    <span className="truncate font-medium">{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LuxurySelect;
