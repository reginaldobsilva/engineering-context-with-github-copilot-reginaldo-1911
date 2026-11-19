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
  }

  return (
    <div className="tag-autocomplete">
      <input
        aria-autocomplete="list"
        aria-controls={isListboxVisible ? listboxId : undefined}
        aria-expanded={isListboxVisible}
        aria-label={label}
        aria-haspopup="listbox"
        autoComplete="off"
        name="tags"
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
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
              aria-selected="false"
              className="tag-suggestion"
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