"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { enquiryMessage, whatsappHref, type Enquiry } from "@/content/contact";
import { ChatIcon } from "./icons";

type Errors = Partial<Record<keyof Enquiry, string>>;

export function EnquiryForm({
  services,
}: {
  services: { id: string; title: string }[];
}) {
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [draft, setDraft] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const serviceHints: Record<string, string> = {
    websites:
      "Tell us about your business, the pages you need and any existing website.",
    "it-support":
      "Describe the device and what happens when the issue occurs. Leave out passwords.",
    networks:
      "Describe your workspace, connected devices and where the connection needs improvement.",
  };
  const status = useRef<HTMLDivElement>(null);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (draft) status.current?.focus();
  }, [draft]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const selected = services.find(
      (service) => service.id === data.get("service"),
    );
    const values: Enquiry = {
      name: String(data.get("name") || "").trim(),
      service: selected?.title || "",
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    const nextErrors: Errors = {};
    if (!values.name) nextErrors.name = "Please enter your name.";
    if (!selected) nextErrors.service = "Please choose a service.";
    const email = form.elements.namedItem("email") as HTMLInputElement;
    if (values.email && email.validity.typeMismatch)
      nextErrors.email =
        "Enter a valid email address, or leave this field empty.";
    if (!values.message)
      nextErrors.message =
        "Please tell us a little about your project or issue.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setDraft(null);
      (
        form.elements.namedItem(Object.keys(nextErrors)[0]) as HTMLElement
      )?.focus();
      return;
    }
    const url = whatsappHref(enquiryMessage(values));
    setDraft(url);
    // A user-initiated draft only. No fetch, storage, email or automatic sending.
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      className="enquiry-form"
      onSubmit={submit}
      noValidate
      onChange={(event) => {
        setDraft(null);
        const name = event.target.getAttribute("name") as keyof Enquiry | null;
        if (name) setErrors((current) => ({ ...current, [name]: undefined }));
      }}
      aria-labelledby="enquiry-form-title"
    >
      <h2 id="enquiry-form-title">Tell us what you have in mind.</h2>
      <p className="form-intro">
        We’ll prepare your enquiry as a WhatsApp draft. You review it and choose
        whether to send it in WhatsApp.
      </p>
      <p className="form-required">Fields marked * are required.</p>
      {Object.values(errors).some(Boolean) && (
        <p className="error-summary" role="alert">
          Please check the highlighted fields below.
        </p>
      )}
      <fieldset disabled={!ready} className="form-fields">
        <legend className="sr-only">Your enquiry</legend>
        <div className="field">
          <label htmlFor="name">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="field-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="service">
            Service <span aria-hidden="true">*</span>
          </label>
          <select
            id="service"
            name="service"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.service)}
            aria-describedby={
              errors.service
                ? "service-error service-guidance"
                : "service-guidance"
            }
            onChange={(event) => setSelectedService(event.target.value)}
            className={selectedService ? "service-selected" : undefined}
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
          <p
            id="service-guidance"
            className={`service-guidance${selectedService ? " has-selection" : ""}`}
            role="status"
          >
            {serviceHints[selectedService] ||
              "Choose a service for a useful starting point for your message."}
          </p>
          {errors.service && (
            <p id="service-error" className="field-error">
              {errors.service}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="email">
            Email <span className="optional">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : "email-help"}
          />
          <p id="email-help" className="field-hint">
            Include this only if you want it in your WhatsApp enquiry.
          </p>
          {errors.email && (
            <p id="email-error" className="field-error">
              {errors.email}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="message">
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={3000}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "message-error message-help" : "message-help"
            }
          />
          <p id="message-help" className="field-hint">
            Share your goal or describe the issue. Please don’t include
            passwords or sensitive information.
          </p>
          {errors.message && (
            <p id="message-error" className="field-error">
              {errors.message}
            </p>
          )}
        </div>
        <button type="submit" className="btn btn-whatsapp">
          <ChatIcon />
          Prepare WhatsApp enquiry<span aria-hidden="true">↗</span>
        </button>
        <p className="field-hint">
          Opens WhatsApp in a new tab. Nothing is sent automatically.
        </p>
      </fieldset>
      <noscript>
        <p className="form-fallback">
          JavaScript is needed to prepare a custom draft. Use the WhatsApp or
          telephone link on this page to contact us directly.
        </p>
      </noscript>
      {draft && (
        <div ref={status} className="draft-status" role="status" tabIndex={-1}>
          <h3>Your draft is ready to review.</h3>
          <p>
            No message has been sent by this website. Review the draft and send
            it in WhatsApp when you’re ready.
          </p>
          <a href={draft} target="_blank" rel="noopener noreferrer">
            Open your prepared draft (new tab) ↗
          </a>
          <p className="field-hint">
            Use this link if your browser blocked the new tab.
          </p>
        </div>
      )}
    </form>
  );
}
