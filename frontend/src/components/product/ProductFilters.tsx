import type { ProductCategory } from "../../types/product";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export interface CatalogFilters {
  search: string;
  category: ProductCategory | "";
  sort: "newest" | "price_asc" | "price_desc";
}

interface ProductFiltersProps {
  value: CatalogFilters;
  onChange: (value: CatalogFilters) => void;
}

export function ProductFilters({ value, onChange }: ProductFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
      <Input
        placeholder="Search by model, e.g. iPhone 14 Pro"
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
      />
      <Select
        value={value.category}
        onChange={(e) => onChange({ ...value, category: e.target.value as CatalogFilters["category"] })}
        className="sm:w-44"
      >
        <option value="">All Categories</option>
        <option value="PHONE">iPhones</option>
        <option value="ACCESSORY">Accessories</option>
      </Select>
      <Select
        value={value.sort}
        onChange={(e) => onChange({ ...value, sort: e.target.value as CatalogFilters["sort"] })}
        className="sm:w-44"
      >
        <option value="newest">Newest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </Select>
    </div>
  );
}
