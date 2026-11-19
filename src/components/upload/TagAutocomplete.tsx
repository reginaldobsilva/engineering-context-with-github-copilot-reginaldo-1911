"use client";

import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({
  availableTags,
  label,
  value,
  onChange,
}: TagAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listboxId = useId();
  const lastCommaIndex = value.lastIndexOf(",");
  const prefix = lastCommaIndex === -1 ? "" : value.slice(0, lastCommaIndex);
  const currentToken = value.slice(lastCommaIndex + 1).trim();
  const selectedTags = new Set(
    prefix
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean),
  );
  const suggestions = currentToken
    ? availableTags.filter((tag) => {
        const normalizedTag = tag.trim().toLowerCase();
        return (
          normalizedTag.startsWith(currentToken.toLowerCase()) &&
          !selectedTags.has(normalizedTag)
        );
      })
    : [];
  const isListboxVisible = isOpen && suggestions.length > 0;

  function selectTag(tag: string) {
    const nextValue = prefix.trim()
      ? `${prefix.trim()}, ${tag}`
      : tag;
    onChange(nextValue);
    setIsOpen(false);
    setActiveIndex(null);
  }

  const activeOptionId =
    isListboxVisible && activeIndex !== null && suggestions[activeIndex]
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  return (
    <div className="tag-autocomplete">
      <input
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        aria-controls={isListboxVisible ? listboxId : undefined}
        aria-expanded={isListboxVisible}
        aria-label={label}
        aria-haspopup="listbox"
        autoComplete="off"
        name="tags"
        onBlur={() => {
          setIsOpen(false);
          setActiveIndex(null);
        }}
        onChange={(event) => {
          onChange(event.target.value);
          setActiveIndex(null);
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && suggestions.length > 0) {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((current) =>
              current === null ? 0 : (current + 1) % suggestions.length,
            );
          } else if (event.key === "ArrowUp" && suggestions.length > 0) {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((current) =>
              current === null
                ? suggestions.length - 1
                : (current - 1 + suggestions.length) % suggestions.length,
            );
          } else if (
            event.key === "Enter" &&
            isListboxVisible &&
            activeIndex !== null &&
            suggestions[activeIndex]
          ) {
            event.preventDefault();
            selectTag(suggestions[activeIndex]);
          } else if (event.key === "Escape") {
            setIsOpen(false);
            setActiveIndex(null);
          } else if (event.key === "Tab") {
            setIsOpen(false);
            setActiveIndex(null);
          }
        }}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        type="text"
        value={value}
      />
      {isListboxVisible && (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag, index) => (
            <li
              aria-selected={index === activeIndex}
              className={index === activeIndex ? "tag-suggestion active" : "tag-suggestion"}
              id={`${listboxId}-option-${index}`}
              key={tag}
              onClick={() => selectTag(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}