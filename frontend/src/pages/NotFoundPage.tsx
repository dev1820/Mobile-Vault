import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-display text-5xl font-bold text-vault-gold">404</p>
      <p className="text-vault-silver">This page doesn&apos;t exist.</p>
      <Link to="/" className="mt-2 text-vault-gold hover:underline">
        &larr; Back to home
      </Link>
    </div>
  );
}
