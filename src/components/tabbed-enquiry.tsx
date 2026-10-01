"use client";
import { useEffect, useRef, useState } from "react";
import { whatsappHref } from "@/content/contact";
type Field = {
    name: string;
    label: string;
    required?: boolean;
    type?: string;
    full?: boolean;
    options?: string[];
};
const shared: Field[] = [{ name: "name", label: "Full name", required: true }, { name: "phone", label: "Phone number", type: "tel", required: true }];
const forms: {
    title: string;
    fields: Field[];
}[] = [
    { title: "Website enquiry", fields: [...shared, { name: "whatsapp", label: "WhatsApp number", type: "tel" }, { name: "email", label: "Email", type: "email" }, { name: "service", label: "Website service", options: ["New business website", "Existing website redesign"] }, { name: "location", label: "Your location" }, { name: "existing", label: "Existing website or project context", full: true }, { name: "message", label: "Message", type: "textarea", full: true }] },
    { title: "IT support", fields: [...shared, { name: "brand", label: "Computer brand" }, { name: "model", label: "Model" }, { name: "problem", label: "Problem or support needed", required: true, full: true }, { name: "message", label: "Additional details", type: "textarea", full: true }] },
    { title: "Network enquiry", fields: [...shared, { name: "equipment", label: "Equipment or setup" }, { name: "quantity", label: "Number of devices", type: "number" }, { name: "message", label: "Message", type: "textarea", full: true }] }
];
export function TabbedEnquiry() {
    const [active, setActive] = useState(0);
    const [ready, setReady] = useState(false);
    const [draft, setDraft] = useState<{
        index: number;
        href: string;
    } | null>(null);
    const tabs = useRef<(HTMLButtonElement | null)[]>([]);
    const status = useRef<HTMLDivElement>(null);
    useEffect(() => setReady(true), []);
    function submit(event: React.FormEvent<HTMLFormElement>, index: number) {
        event.preventDefault();
        const form = event.currentTarget;
        // Trim required text before native validation so whitespace is not accepted.
        for (const field of Array.from(form.elements))
            if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)
                field.value = field.value.trim();
        if (!form.reportValidity())
            return;
        const data = new FormData(form);
        const lines = forms[index].fields.map(field => { const value = String(data.get(field.name) || "").trim(); return value ? `${field.label}: ${value}` : ""; }).filter(Boolean);
        const href = whatsappHref([`Hello Nexora Technologies, I would like to discuss ${forms[index].title.toLowerCase()}.`, "", ...lines].join("\n"));
        window.open(href, "_blank", "noopener,noreferrer");
        setDraft({ index, href });
        form.reset();
        requestAnimationFrame(() => status.current?.focus());
    }
    return <div className="evidence-form-card">
    <div className="enquiry-tabs" role="tablist" aria-label="Enquiry type">{forms.map((form, index) => <button key={form.title} ref={node => { tabs.current[index] = node; }} type="button" disabled={!ready} role="tab" id={`enquiry-tab-${index}`} aria-controls={`enquiry-panel-${index}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => { const next = event.key === "ArrowRight" ? (active + 1) % 3 : event.key === "ArrowLeft" ? (active + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : null; if (next !== null) {
            event.preventDefault();
            setActive(next);
            tabs.current[next]?.focus();
        } }}>{form.title}</button>)}</div>
    {forms.map((form, index) => <div key={form.title} id={`enquiry-panel-${index}`} role="tabpanel" aria-labelledby={`enquiry-tab-${index}`} hidden={active !== index}>
        <form noValidate onChange={() => { if (draft?.index === index) setDraft(null); }} onSubmit={event => submit(event, index)}>
        <fieldset disabled={!ready}>
        <legend className="sr-only">{form.title}</legend>
        <div className="evidence-form-grid">{form.fields.map(field => {
                const id = `enquiry-${index}-${field.name}`;
                const common = { id, name: field.name, required: field.required, "aria-describedby": "enquiry-guidance", maxLength: field.type === "textarea" ? 3000 : 500 };
                return <div className={`enquiry-field ${field.full ? "field-full" : ""}`} key={field.name}>
                <label htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>{field.type === "textarea" ? <textarea {...common} rows={4}/> : field.options ? <select {...common}>{field.options.map(option => <option key={option}>{option}</option>)}</select> : <input {...common} type={field.type || "text"} min={field.type === "number" ? 1 : undefined} autoComplete={field.name === "name" ? "name" : field.name === "phone" ? "tel" : field.name === "email" ? "email" : "off"}/>}</div>;
            })}</div>
        <button className="btn btn-primary" type="submit">Prepare WhatsApp draft</button>
        </fieldset>
        </form>{draft?.index === index && <div className="enquiry-status" role="status" tabIndex={-1} ref={status}>Your draft is ready. Nothing has been sent. Review and send it in WhatsApp. <a href={draft.href} target="_blank" rel="noopener noreferrer">Open your WhatsApp draft (new tab)</a>.</div>}</div>)}
    {!ready && <div className="enquiry-fallback">
    <p>The form needs JavaScript to prepare a draft. Use the phone or WhatsApp links to make an enquiry.</p>
    </div>}
  </div>;
}
