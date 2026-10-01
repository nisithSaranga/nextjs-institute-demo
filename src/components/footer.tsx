import Link from "next/link";
import { Brand } from "./brand";
import { whatsappHref } from "@/content/contact";

export function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <Brand />

              <p>Thoughtful technology. Practical solutions.</p>

              <p>
                Website design and development, computer support and network
                setup for small businesses.
              </p>
            </div>

            <div>
              <h2>Navigation</h2>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/services">Services</Link>
                </li>
                <li>
                  <Link href="/support">Support</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2>Services</h2>
              <ul>
                <li>
                  <Link href="/services#websites">
                    Website Design &amp; Development
                  </Link>
                </li>
                <li>
                  <Link href="/support">IT Support</Link>
                </li>
                <li>
                  <Link href="/services#networks">Network Setup</Link>
                </li>
                <li>
                  <Link href="/approach">Technical Solutions</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2>Contact</h2>
              <ul>
                <li>82 Galle Road, Colombo 03, Sri Lanka</li>

                <li>
                  <a href="mailto:hello@nexoratech.lk">
                    hello@nexoratech.lk
                  </a>
                </li>

                <li>
                  <a href="tel:+94786620728">
                    +94 78 662 0728
                  </a>
                </li>

                <li>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp: +94 78 662 0728
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © 2026 Nexora Technologies. All Rights Reserved.
            </span>

            <span className="footer-legal">
              <a href="#">Privacy Policy</a>
              <span> · </span>
              <a href="#">Terms</a>
            </span>
          </div>
        </div>
      </footer>
<a
  className="floating-chat"
  href={whatsappHref()}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat with Nexora on WhatsApp"
>
  <img
    src="https://cdn.simpleicons.org/whatsapp/FFFFFF"
    alt=""
    aria-hidden="true"
  />
</a>
    </>
  );
}