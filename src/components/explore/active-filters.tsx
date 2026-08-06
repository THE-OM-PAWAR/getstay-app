"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExploreParams } from "@/services/explore.service";

interface ActiveFiltersProps {
  filters: ExploreParams;
  onRemoveFilter: (key: keyof ExploreParams) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters: Array<{ key: keyof ExploreParams; label: string; value: string }> = [];

  if (filters.query) {
    activeFilters.push({ key: 'query', label: 'Search', value: filters.query });
  }
  if (filters.city && filters.city !== 'all') {
    activeFilters.push({ key: 'city', label: 'City', value: filters.city });
  }
  if (filters.accommodationType && filters.accommodationType !== 'all') {
    activeFilters.push({ key: 'accommodationType', label: 'Type', value: filters.accommodationType });
  }
  if (filters.maxRent) {
    activeFilters.push({ key: 'maxRent', label: 'Max Rent', value: `₹${filters.maxRent.toLocaleString()}` });
  }
  if (filters.amenities && filters.amenities.length > 0) {
    filters.amenities.forEach(amenity => {
      activeFilters.push({ key: 'amenities', label: 'Amenity', value: amenity });
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${index}`}
          variant="secondary"
          className="px-3 py-1.5 text-xs font-medium gap-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
        >
          <span className="font-semibold">{filter.label}:</span> {filter.value}
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="hover:bg-brand-primary/20 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
