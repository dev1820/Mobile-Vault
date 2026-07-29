import { useEffect, useState } from "react";
import { getProducts } from "../api/productsApi";
import type { Page, Product } from "../types/product";
import { ProductFilters, type CatalogFilters } from "../components/product/ProductFilters";
import { ProductGrid } from "../components/product/ProductGrid";
import { FullPageSpinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { useDebounce } from "../hooks/useDebounce";

const SORT_MAP: Record<CatalogFilters["sort"], string> = {
  newest: "createdAt,desc",
  price_asc: "priceRupees,asc",
  price_desc: "priceRupees,desc",
};

export function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>({ search: "", category: "", sort: "newest" });
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(filters.search);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, filters.category, filters.sort]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts({
      status: "AVAILABLE",
      search: debouncedSearch || undefined,
      category: filters.category || undefined,
      sort: SORT_MAP[filters.sort],
      page,
      size: 12,
    })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.category, filters.sort, page]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-vault-white">Catalog</h1>
      <p className="mt-1 text-sm text-vault-silver">Browse available iPhones and accessories.</p>

      <div className="mt-6">
        <ProductFilters value={filters} onChange={setFilters} />
      </div>

      <div className="mt-8">
        {loading || !data ? (
          <FullPageSpinner />
        ) : (
          <>
            <ProductGrid products={data.content} />
            {data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-vault-silver">
                  Page {data.number + 1} of {data.totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page + 1 >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
