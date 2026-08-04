import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitComplaint } from "../../api/complaintsApi";
import { COMPLAINT_TYPE_LABELS } from "../../types/complaint";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";

const schema = z.object({
  fullName: z.string().min(1, "Required"),
  email: z.string().min(1, "Required").email("Enter a valid email"),
  phoneNumber: z.string().min(1, "Required"),
  orderNumber: z.string().min(1, "Required"),
  complaintType: z.enum([
    "ORDER_ISSUE",
    "PRODUCT_DEFECT",
    "DELIVERY_ISSUE",
    "PAYMENT_ISSUE",
    "WARRANTY_CLAIM",
    "OTHER",
  ]),
  description: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

export function ComplaintForm() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { complaintType: "ORDER_ISSUE" },
  });

  function handlePhotoChange(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    setPhotos((prev) => [...prev, ...newFiles]);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function handleVideoChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    setVideo(file);
    if (videoInputRef.current) videoInputRef.current.value = "";
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitComplaint({ ...values, photos, video });
      setDone(true);
      reset();
      setPhotos([]);
      setVideo(null);
    } catch {
      setSubmitError("Something went wrong submitting your complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-vault-gold/20 bg-vault-gold/5 p-6 text-center">
        <h3 className="font-display text-xl font-semibold text-vault-gold">
          Thanks — your complaint has been received.
        </h3>
        <p className="mt-2 text-sm text-vault-silver">
          Please text your ticket number to us on WhatsApp for faster follow-up. We aim to resolve
          complaints within 48 working hours.
        </p>
        <Button variant="secondary" className="mt-4" onClick={() => setDone(false)}>
          Submit Another Complaint
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Phone Number" error={errors.phoneNumber?.message} {...register("phoneNumber")} />
        <Input
          label="Order Number"
          placeholder="e.g. MV-1029"
          error={errors.orderNumber?.message}
          {...register("orderNumber")}
        />
      </div>

      <Select label="Complaint Type" error={errors.complaintType?.message} {...register("complaintType")}>
        {Object.entries(COMPLAINT_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Textarea
        label="Describe Your Issue in Detail"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      <div>
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-vault-silver">
          Supporting Photos (optional)
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
          id="complaint-photos-input"
        />
        <Button type="button" variant="secondary" onClick={() => photoInputRef.current?.click()}>
          Add Photos
        </Button>
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-vault-silver">
          Supporting Video (optional)
        </span>
        {video && (
          <div className="mb-2 flex items-center gap-3 text-sm text-vault-silver">
            <span className="truncate">{video.name}</span>
            <button type="button" onClick={() => setVideo(null)} className="text-red-400 hover:underline">
              Remove
            </button>
          </div>
        )}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          onChange={(e) => handleVideoChange(e.target.files)}
          className="hidden"
          id="complaint-video-input"
        />
        <Button type="button" variant="secondary" onClick={() => videoInputRef.current?.click()}>
          {video ? "Replace Video" : "Add Video"}
        </Button>
      </div>

      {submitError && <p className="text-sm text-red-400">{submitError}</p>}

      <Button type="submit" disabled={submitting} className="mt-2 self-start">
        {submitting ? "Submitting…" : "Submit Complaint"}
      </Button>
    </form>
  );
}
