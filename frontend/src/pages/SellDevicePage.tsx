import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitSellRequest } from "../api/sellRequestsApi";
import {
  ACCESSORIES_LABELS,
  REPAIR_STATUS_LABELS,
  SIM_STATUS_LABELS,
} from "../types/sellRequest";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().min(1, "Required").email("Enter a valid email"),
  phoneNumber: z.string().min(1, "Required"),
  phoneCompany: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  conditionRating: z.coerce.number().min(1, "1-10").max(10, "1-10"),
  storageCapacity: z.string().min(1, "Required"),
  simStatus: z.enum(["PTA_APPROVED", "NON_PTA", "FACTORY_UNLOCKED", "CARRIER_LOCKED"]),
  repairStatus: z.enum(["ORIGINAL", "SCREEN_REPLACED", "BATTERY_REPLACED", "OTHER_REPAIR"]),
  accessories: z.enum(["BOX_ONLY", "BOX_AND_CHARGER", "ALL_ACCESSORIES", "NONE"]),
  deviceSerialNumber: z.string().min(1, "Required"),
  deviceDetails: z.string().min(1, "Required"),
  expectedPriceRupees: z.coerce.number().min(0, "Must be 0 or more"),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function SellDevicePage() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [photosError, setPhotosError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { simStatus: "PTA_APPROVED", repairStatus: "ORIGINAL", accessories: "BOX_AND_CHARGER" },
  });

  function handlePhotoChange(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    setPhotos((prev) => [...prev, ...newFiles]);
    setPhotosError(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(values: FormOutput) {
    if (photos.length === 0) {
      setPhotosError("At least one photo is required");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitSellRequest({ ...values, photos, video });
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
          We&apos;ve received your device details. Our team will review your submission and contact
          you shortly to confirm a rate and next steps.
        </p>
        <Link to="/" className="mt-2 text-vault-gold hover:underline">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-vault-white">Sell Your Device</h1>
      <p className="mt-1 text-sm text-vault-silver">
        Fill out your device details below and our team will get back to you with a rate.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" error={errors.firstName?.message} {...register("firstName")} />
          <Input label="Last Name" error={errors.lastName?.message} {...register("lastName")} />
        </div>

        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="Phone Number" error={errors.phoneNumber?.message} {...register("phoneNumber")} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Phone Company" placeholder="Apple" error={errors.phoneCompany?.message} {...register("phoneCompany")} />
          <Input label="Model" placeholder="iPhone 13 Pro" error={errors.model?.message} {...register("model")} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Condition (1-10)"
            type="number"
            min={1}
            max={10}
            error={errors.conditionRating?.message}
            {...register("conditionRating")}
          />
          <Input label="Storage" placeholder="128GB" error={errors.storageCapacity?.message} {...register("storageCapacity")} />
        </div>

        <Select label="Sim Status" error={errors.simStatus?.message} {...register("simStatus")}>
          {Object.entries(SIM_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Select label="Repair Status" error={errors.repairStatus?.message} {...register("repairStatus")}>
          {Object.entries(REPAIR_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Select label="Accessories Included" error={errors.accessories?.message} {...register("accessories")}>
          {Object.entries(ACCESSORIES_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Input
          label="Device Serial Number"
          error={errors.deviceSerialNumber?.message}
          {...register("deviceSerialNumber")}
        />

        <Textarea
          label="Device Details"
          rows={4}
          placeholder="Anything the buyer should know: scratches, battery health, issues, etc."
          error={errors.deviceDetails?.message}
          {...register("deviceDetails")}
        />

        <Input
          label="Expected Sale Price (PKR)"
          type="number"
          min={0}
          error={errors.expectedPriceRupees?.message}
          {...register("expectedPriceRupees")}
        />

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-vault-silver">
            Photos
          </span>
          {photos.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((file, index) => (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-md bg-vault-charcoal-light">
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => handlePhotoChange(e.target.files)}
            className="hidden"
            id="sell-photos-input"
          />
          <Button type="button" variant="secondary" onClick={() => photoInputRef.current?.click()}>
            Add Photos
          </Button>
          {photosError && <p className="mt-1 text-xs text-red-400">{photosError}</p>}
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-vault-silver">
            Video (optional)
          </span>
          {video ? (
            <div className="mb-2 flex items-center gap-3 text-sm text-vault-silver">
              <span className="truncate">{video.name}</span>
              <button type="button" onClick={() => setVideo(null)} className="text-red-400 hover:underline">
                Remove
              </button>
            </div>
          ) : null}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
            className="hidden"
            id="sell-video-input"
          />
          <Button type="button" variant="secondary" onClick={() => videoInputRef.current?.click()}>
            {video ? "Replace Video" : "Add Video"}
          </Button>
        </div>

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}

        <Button type="submit" disabled={submitting} className="mt-2 self-start">
          {submitting ? "Submitting…" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
