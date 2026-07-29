import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORY_LABELS, CONDITION_LABELS } from "../../types/product";
import type { ProductPayload } from "../../api/productsApi";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["PHONE", "ACCESSORY"]),
  model: z.string().optional(),
  storageCapacity: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(["NEW", "USED_EXCELLENT", "USED_GOOD", "USED_FAIR"]),
  priceRupees: z.coerce.number().min(0, "Price must be 0 or more"),
  batteryHealthPercent: z.union([z.literal(""), z.coerce.number().min(0).max(100)]).optional(),
});

export type ProductFormInput = z.input<typeof schema>;
export type ProductFormOutput = z.output<typeof schema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormInput>;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  submitLabel: string;
  submitting: boolean;
}

export function ProductForm({ defaultValues, onSubmit, submitLabel, submitting }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "PHONE",
      condition: "NEW",
      ...defaultValues,
    },
  });

  async function submit(values: ProductFormOutput) {
    await onSubmit({
      title: values.title,
      description: values.description ?? "",
      category: values.category,
      model: values.model ?? "",
      storageCapacity: values.storageCapacity ?? "",
      color: values.color ?? "",
      condition: values.condition,
      priceRupees: values.priceRupees,
      batteryHealthPercent:
        values.batteryHealthPercent === "" || values.batteryHealthPercent === undefined
          ? null
          : Number(values.batteryHealthPercent),
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <Input label="Title" placeholder="iPhone 13 Pro Max 256GB" error={errors.title?.message} {...register("title")} />

      <Textarea label="Description" rows={4} placeholder="Condition notes, box contents, etc." {...register("description")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Category" error={errors.category?.message} {...register("category")}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select label="Condition" error={errors.condition?.message} {...register("condition")}>
          {Object.entries(CONDITION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input label="Model" placeholder="iPhone 13 Pro Max" {...register("model")} />
        <Input label="Storage" placeholder="256GB" {...register("storageCapacity")} />
        <Input label="Color" placeholder="Sierra Blue" {...register("color")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Price (PKR)"
          type="number"
          min={0}
          step="1"
          error={errors.priceRupees?.message}
          {...register("priceRupees")}
        />
        <Input
          label="Battery Health % (optional)"
          type="number"
          min={0}
          max={100}
          error={errors.batteryHealthPercent?.message as string | undefined}
          {...register("batteryHealthPercent")}
        />
      </div>

      <Button type="submit" disabled={submitting} className="mt-2 self-start">
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
