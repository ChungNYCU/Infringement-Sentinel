// File: src/components/SearchableDropdown.tsx
'use client';

import { useState, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import Fuse from 'fuse.js';

interface SearchableDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

export default function SearchableDropdown({
  label,
  options,
  value,
  onChange,
}: SearchableDropdownProps) {
  const [query, setQuery] = useState('');

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(
    () => new Fuse(options, { threshold: 0.3 }),
    [options]
  );

  // Filter options: when query is empty, return all options
  const filtered = useMemo(() => {
    if (!query.trim()) {
      return options;
    }
    return fuse.search(query).map((res) => res.item);
  }, [options, query, fuse]);

  return (
    <div className="w-full">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <Combobox value={value} onChange={onChange} as="div" className="relative">
        {({ open }) => (
          <>
            <Combobox.Input
              className="w-full border border-gray-300 rounded p-2"
              displayValue={(val: string) => val}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {/* You can add a dropdown arrow icon here */}
            </Combobox.Button>

            {open && (
              <Combobox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded max-h-60 overflow-auto">
                {filtered.length === 0 ? (
                  <div className="p-2 text-gray-500">No results.</div>
                ) : (
                  filtered.map((opt) => (
                    <Combobox.Option
                      key={opt}
                      value={opt}
                      className={({ active }) =>
                        `cursor-pointer select-none p-2 ${
                          active ? 'bg-gray-100' : ''
                        }`
                      }
                    >
                      {opt}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            )}
          </>
        )}
      </Combobox>
    </div>
  );
}
