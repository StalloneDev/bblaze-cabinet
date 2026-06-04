import Link from "next/link";
import Image from "next/image";
import { Scale, Mail, Phone, MapPin, ShieldAlert } from "lucide-react";

const Footer = () => {
  const services = [
    { label: "Ingénierie Juridique", path: "/services/ingenierie-juridique" },
    { label: "Ressources Humaines", path: "/services/ressources-humaines" },
    { label: "Commerce International", path: "/services/commerce-international" },
    { label: "Recouvrement", path: "/services/recouvrement" },
    { label: "Médiation", path: "/services/mediation" },
    { label: "Formations", path: "/services/formations" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-auto bg-white p-1.5 rounded-lg border border-border flex items-center shrink-0 shadow-soft">
                <Image
                  src="/logo.jpg"
                  alt="BBLAZE Logo"
                  width={80}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">BBLAZE</h3>
                <p className="text-[10px] text-primary-foreground/70 font-semibold uppercase tracking-wider leading-none mt-1">Cabinet Conseil</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Votre partenaire de confiance pour tous vos besoins juridiques. Excellence, expertise et accompagnement personnalisé.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-serif">Nos Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.path}>
                  <Link
                    href={service.path}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-smooth"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-serif">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-primary-foreground/80 hover:text-accent transition-smooth">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-primary-foreground/80 hover:text-accent transition-smooth">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-primary-foreground/80 hover:text-accent transition-smooth">
                  Actualités / Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-primary-foreground/80 hover:text-accent transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-serif">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Avenue de la Justice, 75001 Paris</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+33123456789" className="hover:text-accent transition-smooth">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contact@bblaze.fr" className="hover:text-accent transition-smooth">
                  contact@bblaze.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} BBLAZE. Tous droits réservés.
          </p>
          <Link 
            href="/admin" 
            className="flex items-center gap-1.5 text-xs text-primary-foreground/45 hover:text-accent transition-smooth"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Espace Administration
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
