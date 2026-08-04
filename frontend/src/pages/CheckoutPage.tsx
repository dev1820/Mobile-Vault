import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getProduct } from "../api/productsApi";
import { submitOrder } from "../api/ordersApi";
import type { Product } from "../types/product";
import { imageUrl } from "../api/client";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";
import { formatPrice } from "../utils/format";

// Placeholder payment details — replace with your real bank/JazzCash/EasyPaisa account info.
const PAYMENT_METHODS = [
  { label: "Bank Transfer", value: "Meezan Bank — Account Title: Mobile Vault — Account #: 0123456789012" },
  { label: "JazzCash", value: "0300-1234567 (Mobile Vault)" },
  { label: "EasyPaisa", value: "0300-1234567 (Mobile Vault)" },
];

const schema = z.object({
  customerFirstName: z.string().min(1, "Required"),
  customerLastName: z.string().min(1, "Required"),
  customerEmail: z.string().min(1, "Required").email("Enter a valid email"),
  customerPhone: z.string().min(1, "Required"),
  deliveryAddress: z.string().min(1, "Required"),
  deliveryCity: z.string().min(1, "Required"),
  deliveryNotes: z.string().optional(),
  paymentReference: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [proof, setProof] = useState<File | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true));
  }, [id]);

  function handleProofChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    setProof(file);
    setProofError(null);
    if (proofInputRef.current) proofInputRef.current.value = "";
  }

  async function onSubmit(values: FormValues) {
    if (!product) return;
    if (!proof) {
      setProofError("Payment proof screenshot is required");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitOrder({ ...values, productId: product.id, paymentProof: proof });
      setDone(true);
    } catch {
      setSubmitError("This item may no longer be available, or something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-vault-silver">This listing could not be found.</p>
        <Link to="/catalog" className="mt-4 inline-block text-vault-gold hover:underline">
          &larr; Back to catalog
        </Link>
      </div>
    );
  }

  if (!product) {
    return <FullPageSpinner />;
  }

  if (product.status !== "AVAILABLE") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-xl font-semibold text-vault-white">
          This item is no longer available
        </h1>
        <p className="mt-2 text-sm text-vault-silver">
          Someone may have already reserved it. Take a look at the rest of our catalog.
        </p>
        <Link to="/catalog" className="mt-4 inline-block text-vault-gold hover:underline">
          &larr; Browse catalog
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl font-semibold text-vault-gold">
          Thanks — we&apos;ve received your order!
        </h1>
        <p className="text-vault-silver">
          We&apos;ll verify your advance payment and confirm shortly. You&apos;ll be contacted at the
          phone number/email you provided.
        </p>
        <Link to="/" className="mt-2 text-vault-gold hover:underline">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  const advance = Number(product.priceRupees) * 0.5;
  const cover = product.images[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Link to={`/product/${product.id}`} className="text-sm text-vault-silver hover:text-vault-gold">
        &larr; Back to listing
      </Link>

      <h1 className="mt-3 font-display text-2xl font-semibold text-vault-white">Purchase Now</h1>

      <div className="mt-6 flex items-center gap-4 rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-vault-charcoal-light">
          {cover && <img src={imageUrl(cover.url)} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-vault-white">{product.title}</p>
          <p className="text-sm text-vault-silver">Total: {formatPrice(product.priceRupees)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-vault-silver">Advance (50%)</p>
          <p className="font-display text-lg font-semibold text-vault-gold">{formatPrice(advance)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-vault-gold/20 bg-vault-gold/5 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-vault-gold">
          Step 1 — Send the advance payment
        </h2>
        <p className="mt-1 text-xs text-vault-silver">
          Transfer {formatPrice(advance)} using any of the methods below, then fill out the form so
          we can confirm your order.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {PAYMENT_METHODS.map((method) => (
            <li key={method.label} className="rounded-md bg-vault-charcoal px-3 py-2 text-sm">
              <span className="font-medium text-vault-white">{method.label}:</span>{" "}
              <span className="text-vault-silver">{method.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-vault-gold">
          Step 2 — Your delivery details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" error={errors.customerFirstName?.message} {...register("customerFirstName")} />
          <Input label="Last Name" error={errors.customerLastName?.message} {...register("customerLastName")} />
        </div>

        <Input label="Email" type="email" error={errors.customerEmail?.message} {...register("customerEmail")} />
        <Input label="Phone Number" error={errors.customerPhone?.message} {...register("customerPhone")} />

        <Textarea
          label="Delivery Address"
          rows={3}
          error={errors.deliveryAddress?.message}
          {...register("deliveryAddress")}
        />
        <Input label="City" error={errors.deliveryCity?.message} {...register("deliveryCity")} />
        <Textarea label="Delivery Notes (optional)" rows={2} {...register("deliveryNotes")} />
        <Input
          label="Payment Transaction ID (optional)"
          placeholder="If your bank/JazzCash/EasyPaisa gave you a reference number"
          {...register("paymentReference")}
        />

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-vault-silver">
            Payment Proof Screenshot
          </span>
          {proof && (
            <div className="mb-3 h-24 w-24 overflow-hidden rounded-md bg-vault-charcoal-light">
              <img src={URL.createObjectURL(proof)} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <input
            ref={proofInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleProofChange(e.target.files)}
            className="hidden"
            id="payment-proof-input"
          />
          <Button type="button" variant="secondary" onClick={() => proofInputRef.current?.click()}>
            {proof ? "Replace Screenshot" : "Upload Screenshot"}
          </Button>
          {proofError && <p className="mt-1 text-xs text-red-400">{proofError}</p>}
        </div>

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}

        <Button type="submit" disabled={submitting} className="mt-2 self-start">
          {submitting ? "Submitting…" : "Submit Order"}
        </Button>
      </form>
    </div>
  );
}
