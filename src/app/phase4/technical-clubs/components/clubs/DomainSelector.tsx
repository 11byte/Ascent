"use client";

import { Button } from "src/app/components/ui/button";

interface DomainSelectorProps {
  selectedDomain: string | null;
  onSelect: (domain: string | null) => void;
}

export default function DomainSelector({ selectedDomain, onSelect }: DomainSelectorProps) {
  const domains = ["ai", "cyber", "data", "cloud", "web", "robotics"];

  return (
    <div className="flex gap-4 mt-8 flex-wrap justify-center">
      {domains.map((domain) => (
        <Button
          key={domain}
          className={`rounded-xl px-5 py-2 transition-all ${
            selectedDomain === domain
              ? "bg-red-500 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          onClick={() => onSelect(domain)}
        >
          {domain.toUpperCase()}
        </Button>
      ))}
      <Button
        variant="outline"
        onClick={() => onSelect(null)}
        className="rounded-xl"
      >
        Show All
      </Button>
    </div>
  );
}
