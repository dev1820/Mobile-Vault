import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productsApi";
import type { Product } from "../types/product";
import { Logo } from "../components/brand/Logo";
import { Wordmark } from "../components/brand/Wordmark";
import { ProductGrid } from "../components/product/ProductGrid";
import { FullPageSpinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import heroImage from "../assets/hero-iphone.jpg";

export function HomePage() {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  function handleHeroMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
    });
  }

  function handleHeroMouseLeave() {
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  }

  useEffect(() => {
    let cancelled = false;
    getProducts({ status: "AVAILABLE", size: 8, sort: "createdAt,desc" })
      .then((page) => {
        if (!cancelled) setFeatured(page.content);
      })
      .catch(() => {
        if (!cancelled) setFeatured([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="group relative isolate flex min-h-[75vh] items-end overflow-hidden border-b border-vault-silver/10 sm:min-h-[85vh]"
      >
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          style={{
            transform:
              "scale(1.02) translate(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -10px))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vault-black via-vault-black/70 to-vault-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),_transparent_60%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 pb-16 pt-24 text-center sm:pb-20">
          <Logo size="lg" />
          <Wordmark size="lg" showTagline />
          <p className="max-w-xl text-vault-silver">
            Genuine new &amp; carefully inspected used iPhones, sold with honesty and backed by real
            support — delivered across Pakistan.
          </p>
          <Link to="/catalog">
            <Button className="w-full sm:w-auto">Browse Listings</Button>
          </Link>
        </div>
      </section>

      <section className="border-b border-vault-silver/10 bg-vault-black px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
          {/* Placeholder copy — swap this in later */}
          <p className="text-xl leading-relaxed text-vault-white sm:text-2xl lg:text-3xl">
            Got an old iPhone lying around? Want to sell it, trade it in, or upgrade to something
            new? We&apos;ve got you covered with better prices and real warranties than anywhere
            else you&apos;ve looked.
          </p>
          <Link to="/procedure" className="w-full sm:w-auto">
            <Button className="w-full rounded-full px-10 py-4 text-sm sm:w-auto">
              Learn How It Works
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-vault-white">Latest Arrivals</h2>
          <Link to="/catalog" className="text-sm text-vault-gold hover:underline">
            View all &rarr;
          </Link>
        </div>
        {featured === null ? <FullPageSpinner /> : <ProductGrid products={featured} />}
      </section>
    </div>
  );
}
