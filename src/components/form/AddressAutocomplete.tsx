"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { TextField } from "./fields";

export interface SelectedAddress {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Props {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onSelect: (address: SelectedAddress) => void;
}

// Reuse a single Places-library load across mounts so we never inject the
// Google Maps script more than once.
let placesPromise: Promise<google.maps.PlacesLibrary> | null = null;
function loadPlaces(apiKey: string) {
  if (!placesPromise) {
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });
    placesPromise = loader.importLibrary("places");
  }
  return placesPromise;
}

export function AddressAutocomplete({
  value,
  error,
  onChange,
  onSelect,
}: Props) {
  const placesRef = useRef<google.maps.PlacesLibrary | null>(null);
  const tokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(
    null,
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [suggestions, setSuggestions] = useState<
    google.maps.places.PlacePrediction[]
  >([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Load the Places library once and start a billing session token.
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;
    let cancelled = false;
    loadPlaces(apiKey)
      .then((places) => {
        if (cancelled) return;
        placesRef.current = places;
        tokenRef.current = new places.AutocompleteSessionToken();
      })
      .catch((e) =>
        console.warn("Google Places failed to load:", e?.message || e),
      );
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the dropdown when clicking outside the field.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    const places = placesRef.current;
    if (!places || input.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    try {
      const { suggestions: results } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: tokenRef.current ?? undefined,
          includedRegionCodes: ["us"],
        });
      const preds = results
        .map((s) => s.placePrediction)
        .filter((p): p is google.maps.places.PlacePrediction => p != null);
      setSuggestions(preds);
      setActiveIndex(-1);
      setOpen(preds.length > 0);
    } catch (e) {
      // Referrer-restricted key, quota, or network error — silently degrade
      // to plain manual entry. The input itself keeps working.
      console.warn(
        "Address autocomplete unavailable:",
        (e as Error)?.message || e,
      );
      setSuggestions([]);
      setOpen(false);
    }
  }, []);

  const handleChange = (_name: string, next: string) => {
    onChange(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(next), 250);
  };

  const handleSelect = async (pred: google.maps.places.PlacePrediction) => {
    setOpen(false);
    setSuggestions([]);
    try {
      const place = pred.toPlace();
      await place.fetchFields({ fields: ["addressComponents"] });
      const comp = (type: string, useShort = false) => {
        const c = place.addressComponents?.find((c) => c.types.includes(type));
        if (!c) return "";
        return (useShort ? c.shortText : c.longText) ?? "";
      };
      const streetNumber = comp("street_number");
      const route = comp("route");
      onSelect({
        streetAddress: streetNumber ? `${streetNumber} ${route}` : route,
        city:
          comp("locality") ||
          comp("postal_town") ||
          comp("sublocality_level_1"),
        state: comp("administrative_area_level_1", true),
        zipCode: comp("postal_code"),
      });
    } catch (e) {
      console.warn(
        "Failed to load address details:",
        (e as Error)?.message || e,
      );
    } finally {
      // A selection ends the billing session — start a fresh token.
      if (placesRef.current)
        tokenRef.current = new placesRef.current.AutocompleteSessionToken();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <TextField
        label="Mailing address"
        name="address"
        value={value}
        error={error}
        onChange={handleChange}
        placeholder="Street Address"
        autoComplete="off"
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        // hint={
        //   error
        //     ? undefined
        //     : "Start typing and pick a suggestion to autofill the fields below."
        // }
      />
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-navy-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((pred, i) => (
            <li
              key={pred.placeId ?? i}
              role="option"
              aria-selected={i === activeIndex}
            >
              <button
                type="button"
                className={`block w-full px-4 py-2.5 text-left text-sm transition ${
                  i === activeIndex
                    ? "bg-star-50 text-navy-900"
                    : "text-navy-700 hover:bg-navy-50"
                }`}
                // onMouseDown fires before the input's blur so the click isn't
                // swallowed by the outside-click handler closing the list.
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(pred);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {pred.text?.toString() ?? ""}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
