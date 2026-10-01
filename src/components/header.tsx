import { Brand } from "./brand";
import { MobileMenu } from "./mobile-menu";
import { NavigationLinks } from "./navigation-links";
import { Button, WhatsAppLink } from "./button";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <NavigationLinks location="Main" />
        <div className="header-action">
          <WhatsAppLink>WhatsApp</WhatsAppLink>
          <Button href="/contact">Let’s talk</Button>
        </div>
        <MobileMenu>
          <NavigationLinks location="Mobile" />
          <WhatsAppLink />
        </MobileMenu>
      </div>
    </header>
  );
}
