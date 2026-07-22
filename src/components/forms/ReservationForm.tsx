"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, Textarea } from "./Field";
import { Turnstile, turnstileEnabled } from "./Turnstile";
import { sendReservation } from "@/lib/email";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2, "Please tell us your name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a contact number."),
  date: z.string().min(1, "Choose a date."),
  time: z.string().min(1, "Choose a seating."),
  guests: z.string().min(1),
  seating: z.string().min(1),
  occasion: z.string().optional(),
  requests: z.string().max(600).optional(),
});

type Values = z.infer<typeof schema>;

const today = new Date().toISOString().split("T")[0];

export function ReservationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [token, setToken] = useState<string | null>(turnstileEnabled ? null : "dev");

  async function onSubmit(values: Values) {
    setFailed(false);
    if (!token) {
      setFailed(true);
      return;
    }
    try {
      await sendReservation({ ...values, "cf-turnstile-response": token, to: site.email });
      setSent(true);
      reset();
    } catch {
      setFailed(true);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-line/60 bg-surface/40 p-10 text-center"
      >
        <span className="font-jp text-4xl text-accent">承</span>
        <h2 className="mt-4 font-serif text-3xl text-ink">Request received</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Thank you. Our maître d' will confirm your seating by email within 24
          hours. For same-day requests, please call {site.phoneDisplay}.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-[0.7rem] uppercase tracking-wider2 text-accent"
        >
          Make another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="r-name" label="Full name" autoComplete="name" {...register("name")} error={errors.name?.message} />
        <Input id="r-email" label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="r-phone" label="Phone" type="tel" autoComplete="tel" {...register("phone")} error={errors.phone?.message} />
        <Select id="r-guests" label="Guests" {...register("guests")} defaultValue="2">
          {["1", "2", "3", "4", "5", "6"].map((n) => (
            <option key={n} value={n}>
              {n} {n === "1" ? "guest" : "guests"}
            </option>
          ))}
          <option value="7+">7+ (private room)</option>
        </Select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="r-date" label="Date" type="date" min={today} {...register("date")} error={errors.date?.message} />
        <Select id="r-time" label="Seating" {...register("time")} error={errors.time?.message} defaultValue="">
          <option value="" disabled>
            Select a seating
          </option>
          {["17:00", "17:30", "19:30", "20:00", "20:15", "21:45"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Select id="r-seating" label="Seating preference" {...register("seating")} defaultValue="counter">
          <option value="counter">Chef's counter</option>
          <option value="window">Garden window</option>
          <option value="indoor">Indoor table</option>
          <option value="outdoor">Terrace (weather permitting)</option>
          <option value="private">Private room</option>
        </Select>
        <Select id="r-occasion" label="Occasion" optional {...register("occasion")} defaultValue="">
          <option value="">—</option>
          {["Birthday", "Anniversary", "Business", "Celebration", "Just because"].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </div>
      <Textarea
        id="r-requests"
        label="Special requests"
        optional
        placeholder="Allergies, dietary needs, seating notes…"
        {...register("requests")}
        error={errors.requests?.message}
      />

      <Turnstile onVerify={setToken} />

      <AnimatePresence>
        {failed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-accent"
          >
            Something went wrong. Please try again or call {site.phoneDisplay}.
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-bg transition-all duration-500 hover:brightness-110 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Request reservation"}
      </button>
    </form>
  );
}
