import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitDeviceRequest } from "../api/deviceRequestsApi";
import { CATEGORY_LABELS } from "../types/product";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";

const schema = z.object({
  category: z.enum(["PHONE", "ACCESSORY"]),
  itemName: z.string().min(1, "Required"),
  details: z.string().min(1, "Required"),
  budgetRupees: z.union([z.literal(""), z.coerce.number().min(0, "Must be 0 or more")]).optional(),
  customerName: z.string().min(1, "Required"),
  customerPhone: z.string().min(1, "Required"),
  customerEmail: z.string().min(1, "Required").email("Enter a valid email"),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function RequestDevicePage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { category: "PHONE" },
  });

  async function onSubmit(values: FormOutput) {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitDeviceRequest({
        ...values,
        budgetRupees: values.budgetRupees === "" || values.budgetRupees === undefined ? null : values.budgetRupees,
      });
      setDone(true);
    } catch {
      setSubmitError("Something went wrong submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl font-semibold text-vault-gold">Thanks — we&apos;ll be in touch!</h1>
        <p className="text-vault-silver">
          We&apos;ve received your request. Our team will look into sourcing it and reach out to you
          directly.
        </p>
        <Link to="/" className="mt-2 text-vault-gold hover:underline">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-vault-white">Request a Device</h1>
      <p className="mt-1 text-sm text-vault-silver">
        Can&apos;t find what you&apos;re looking for in our catalog? Tell us what you need and
        we&apos;ll try to source it for you.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Select label="What are you looking for?" error={errors.category?.message} {...register("category")}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Input
          label="Item Name"
          placeholder="e.g. iPhone 15 Pro Max, or MagSafe Charger"
          error={errors.itemName?.message}
          {...register("itemName")}
        />

        <Textarea
          label="Details"
          rows={4}
          placeholder="Storage, color, condition preference, or anything else we should know"
          error={errors.details?.message}
          {...register("details")}
        />

        <Input
          label="Budget (PKR, optional)"
          type="number"
          min={0}
          error={errors.budgetRupees?.message as string | undefined}
          {...register("budgetRupees")}
        />

        <Input label="Your Name" error={errors.customerName?.message} {...register("customerName")} />
        <Input label="Phone Number" error={errors.customerPhone?.message} {...register("customerPhone")} />
        <Input label="Email" type="email" error={errors.customerEmail?.message} {...register("customerEmail")} />

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}

        <Button type="submit" disabled={submitting} className="mt-2 self-start">
          {submitting ? "Submitting…" : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}
