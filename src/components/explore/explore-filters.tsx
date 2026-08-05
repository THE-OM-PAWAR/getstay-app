"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CITIES = ["Bhopal", "Indore", "Pune", "Bangalore"];
const AMENITIES = [
  "WiFi",
  "AC",
  "Food/Mess",
  "Laundry",
  "Power Backup",
  "CCTV",
  "RO Water",
  "Housekeeping"
];

interface ExploreFiltersProps {
  onCloseMobile?: () => void;
}

export function ExploreFilters({ onCloseMobile }: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "all");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("maxRent")) || 15000,
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities")?.split(",").filter(Boolean) || []
  );

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (city && city !== "all") params.set("city", city);
    if (type && type !== "all") params.set("type", type);
    if (priceRange[0] < 15000) params.set("maxRent", priceRange[0].toString());
    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));

    router.push(`/destinations?${params.toString()}`);
    if (onCloseMobile) onCloseMobile();
  };

  const resetFilters = () => {
    setCity("all");
    setType("all");
    setPriceRange([15000]);
    setSelectedAmenities([]);
    router.push(`/destinations`);
    if (onCloseMobile) onCloseMobile();
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between md:hidden mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Filter className="h-5 w-5" /> Filters
        </h2>
        {onCloseMobile && (
          <Button variant="ghost" size="icon" onClick={onCloseMobile} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="space-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.15em] text-muted-foreground">Price / Month</h3>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={15000}
            min={2000}
            step={500}
            className="py-2 cursor-pointer"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">₹2,000</span>
            <span className="text-sm text-muted-foreground">₹15,000</span>
          </div>
        </div>

        {/* Room Type */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.15em] text-muted-foreground">Room Type</h3>
          <div className="flex flex-col gap-3">
            {['Single', 'Double sharing', 'Dorm'].map(room => (
              <label key={room} className="flex items-center gap-3 cursor-pointer">
                <Checkbox className="rounded-sm border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary" />
                <span className="text-[15px] text-foreground">{room}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.15em] text-muted-foreground">Gender</h3>
          <div className="flex flex-col gap-3">
            {[
              { id: 'all', label: 'Any' },
              { id: 'boys', label: 'Boys' },
              { id: 'girls', label: 'Girls' }
            ].map(g => (
              <label key={g.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={g.id}
                  checked={type === g.id}
                  onChange={(e) => setType(e.target.value)}
                  className="w-4 h-4 text-brand-primary border-zinc-300 dark:border-zinc-700 focus:ring-brand-primary accent-brand-primary"
                />
                <span className="text-[15px] text-foreground">{g.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.15em] text-muted-foreground">Amenities</h3>
          <div className="flex flex-col gap-3">
            {["WiFi", "Mess / food", "Laundry", "AC", "Power backup"].map((amenity) => {
              const mappedAmenity = amenity === "Mess / food" ? "Food/Mess" : amenity === "Power backup" ? "Power Backup" : amenity;
              const isSelected = selectedAmenities.includes(mappedAmenity);
              return (
                <label key={amenity} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleAmenity(mappedAmenity)}
                    className="rounded-sm border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                  />
                  <span className="text-[15px] text-foreground">{amenity}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Distance */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.15em] text-muted-foreground">Distance From Campus</h3>
          <Slider
            defaultValue={[2]}
            max={10}
            min={1}
            step={1}
            className="py-2 cursor-pointer"
          />
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">Within 2 km</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 mt-4 flex gap-3 sticky bottom-0 bg-transparent pb-2 md:pb-0 z-10 md:static border-t border-zinc-100 dark:border-zinc-800">
        <Button variant="outline" className="flex-1 rounded-sm font-semibold border-brand-primary text-brand-primary hover:bg-brand-primary/10" onClick={resetFilters}>
          Clear All
        </Button>
        <Button className="flex-1 rounded-sm bg-brand-primary text-white hover:bg-brand-primary/90 font-semibold shadow-none" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
