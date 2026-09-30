// Change the authorized number here; every telephone and WhatsApp URL derives from it.
export const contact = {
  displayNumber: "+94 78 662 0728",
  phoneNumber: "+94786620728",
  defaultMessage: "Hello Nexora Technologies, I’d like to discuss a project.",
};

export const telephoneHref = `tel:${contact.phoneNumber}`;
export const whatsappBase = `https://wa.me/${contact.phoneNumber.replace(/\D/g, "")}`;
export function whatsappHref(message = contact.defaultMessage) {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

export type Enquiry = {
  name: string;
  service: string;
  email: string;
  message: string;
};
export function enquiryMessage(values: Enquiry) {
  return [
    "Hello Nexora Technologies, I’d like to make an enquiry.",
    "",
    `Name: ${values.name.trim()}`,
    `Service: ${values.service}`,
    ...(values.email.trim() ? [`Email: ${values.email.trim()}`] : []),
    "",
    "Message:",
    values.message.trim(),
  ].join("\n");
}
