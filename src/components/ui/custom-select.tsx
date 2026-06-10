"use client";

import {
  Check,
  ChevronDown
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent
} from "react";
import { cn } from "@/lib/utils";

type SelectOption<TValue extends string> = {
  value: TValue;
  label: string;
};

type CustomSelectProps<TValue extends string> = {
  id?: string;
  value: TValue;
  options: Array<SelectOption<TValue>>;
  onValueChange: (value: TValue) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function CustomSelect<TValue extends string>({
  id,
  value,
  options,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  className
}: CustomSelectProps<TValue>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selectedOption = options.find((option) => option.value === value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function openMenu() {
    if (disabled || options.length === 0) {
      return;
    }

    setActiveIndex(selectedIndex);
    setIsOpen(true);
  }

  function chooseOption(option: SelectOption<TValue>) {
    onValueChange(option.value);
    setIsOpen(false);
  }

  function moveActiveIndex(direction: 1 | -1) {
    if (options.length === 0) {
      return;
    }

    setActiveIndex((currentIndex) =>
      (currentIndex + direction + options.length) % options.length
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      moveActiveIndex(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      moveActiveIndex(-1);
      return;
    }

    if (event.key === "Home" && isOpen) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End" && isOpen) {
      event.preventDefault();
      setActiveIndex(Math.max(0, options.length - 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      const option = options[activeIndex];

      if (option) {
        chooseOption(option);
      }

      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative mt-2", className)}>
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-3 rounded-md border border-exam-100 bg-white px-3 text-left text-sm text-ink-950 shadow-none outline-none transition hover:border-exam-500 focus-visible:border-exam-500 focus-visible:ring-2 focus-visible:ring-exam-500 disabled:cursor-not-allowed disabled:opacity-55",
          isOpen && "border-exam-500 ring-2 ring-exam-500"
        )}
      >
        <span className="min-w-0 truncate">
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "shrink-0 text-ink-600 transition-transform",
            isOpen && "rotate-180"
          )}
          size={18}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={selectId}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-md border border-exam-100 bg-white p-1 shadow-lg"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <button
                key={option.value}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => chooseOption(option)}
                className={cn(
                  "flex min-h-9 w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm transition",
                  isSelected
                    ? "bg-exam-700 text-white"
                    : isActive
                      ? "bg-exam-50 text-ink-950"
                      : "text-ink-800 hover:bg-exam-50"
                )}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {isSelected ? (
                  <Check className="shrink-0" size={16} aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
