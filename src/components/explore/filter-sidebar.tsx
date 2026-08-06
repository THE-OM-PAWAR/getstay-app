"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { ExploreParams } from "@/services/explore.service";

interface FilterSidebarProps {
  filters: ExploreParams;
  onChange: (filters: ExploreParams) => void;
  onClose?: () => void;
}

const CITIES = ["Bhopal", "Indore", "Pune", "Bangalore"];
const AMENITIES = ["WiFi", "AC", "Food/Mess", "Laundry", "Power Backup", "CCTV", "RO Water", "Housekeeping"];

export function FilterSidebar({ filters, onChange, onClose }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<ExploreParams>(filters);

  const updateFilter = (key: keyof ExploreParams, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    const current = localFilters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    updateFilter('amenities', updated);
  };

  const applyFilters = () => {
    onChange(localFilters);
    if (onClose) onClose();
  };

  const resetFilters = () => {
    const reset: ExploreParams = {};
    setLocalFilters(reset);
    onChange(reset);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden mb-6 pb-4 border-b border-border">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filters
        </h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-8 flex-1 overflow-y-auto pr-2">
        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Price / Month
          </h3>
          <Slider
            value={[localFilters.maxRent || 15000]}
            onValueChange={(value) => updateFilter('maxRent', value[0])}
            max={15000}
            min={2000}
            step={500}
            className="py-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹2,000</span>
            <span className="font-semibold text-foreground">
              {localFilters.maxRent ? `₹${localFilters.maxRent.toLocaleString()}` : '₹15,000'}
            </span>
          </div>
        </div>

        {/* City */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            City
          </h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="city"
                value="all"
                checked={!localFilters.city || localFilters.city === 'all'}
                onChange={() => updateFilter('city', 'all')}
                className="w-4 h-4 text-brand-primary focus:ring-brand-primary accent-brand-primary"
              />
              <span className="text-sm">All Cities</span>
            </label>
            {CITIES.map(city => (
              <label key={city} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="city"
                  value={city}
                  checked={localFilters.city === city}
                  onChange={() => updateFilter('city', city)}
                  className="w-4 h-4 text-brand-primary focus:ring-brand-primary accent-brand-primary"
                />
                <span className="text-sm">{city}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Accommodation Type */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Accommodation Type
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'boys', label: 'Boys' },
              { id: 'girls', label: 'Girls' },
              { id: 'coed', label: 'Co-ed' },
            ].map(type => (
              <label key={type.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="accommodationType"
                  value={type.id}
                  checked={!localFilters.accommodationType || localFilters.accommodationType === type.id}
                  onChange={() => updateFilter('accommodationType', type.id === 'all' ? undefined : type.id)}
                  className="w-4 h-4 text-brand-primary focus:ring-brand-primary accent-brand-primary"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Amenities
          </h3>
          <div className="flex flex-col gap-3">
            {AMENITIES.map(amenity => {
              const isSelected = (localFilters.amenities || []).includes(amenity);
              return (
                <label key={amenity} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleAmenity(amenity)}
                    className="rounded-sm"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 mt-4 flex gap-3 border-t border-border">
        <Button
          variant="outline"
          className="flex-1"
          onClick={resetFilters}
        >
          Clear All
        </Button>
        <Button
          className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
