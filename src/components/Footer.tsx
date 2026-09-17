import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";

// Server Component — récupère ses propres données de contact
const Footer = async () => {
  // Fetch silencieux : si la BD est inaccessible, on utilise les fallbacks
  let contact = null;
  try {
    contact = await prisma.contactInfo.findFirst({
      where: { id: "singleton" },
      select: { email: true, email2: true, phone: true, phone2: true, address: true },
    });
  } catch {
    // Base de données inaccessible → on garde les fallbacks ci-dessous
  }

  const displayContact = {
    address: contact?.address || "Cotonou, Bénin",
    phone: contact?.phone || "+229 01 00 00 00",
    phone2: contact?.phone2 || null,
    email: contact?.email || "contact@cabinetbblaze.com",
    email2: contact?.email2 || null,
  };

  const services = [
    { label: "Ingénierie Juridique", path: "/services/ingenierie-juridique" },
    { label: "Ressources Humaines", path: "/services/ressources-humaines" },
    { label: "Commerce International", path: "/services/commerce-international" },
    { label: "Recouvrement", path: "/services/recouvrement" },
    { label: "Médiation", path: "/services/mediation" },
    { label: "Formations", path: "/services/formations" },
  ];

  const getWhatsappUrl = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, "");
    return `https://wa.me/${digits}`;
  };

  return (
    <footer className="bg-primary text-white dark:bg-primary/10">
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
                <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider leading-none mt-1">Cabinet Conseil</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
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
                    className="text-sm text-white/80 hover:text-accent transition-smooth"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-serif">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-white/80 hover:text-accent transition-smooth">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/80 hover:text-accent transition-smooth">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-white/80 hover:text-accent transition-smooth">
                  Actualités / Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/80 hover:text-accent transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-serif">Contact</h4>
            <ul className="space-y-3">
              {displayContact.address && (
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{displayContact.address}</span>
                </li>
              )}
              {displayContact.phone && (
                <li className="flex items-center gap-2 text-sm text-white/80">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <a
                      href={getWhatsappUrl(displayContact.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent transition-smooth flex items-center gap-1"
                      title="Ouvrir sur WhatsApp"
                    >
                      {displayContact.phone}
                    </a>
                    {displayContact.phone2 && (
                      <a
                        href={getWhatsappUrl(displayContact.phone2)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-smooth flex items-center gap-1"
                        title="Ouvrir sur WhatsApp"
                      >
                        {displayContact.phone2}
                      </a>
                    )}
                  </div>
                </li>
              )}
              {displayContact.email && (
                <li className="flex items-center gap-2 text-sm text-white/80">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href="/contact"
                      className="hover:text-accent transition-smooth"
                      title="Aller à la page contact"
                    >
                      {displayContact.email}
                    </Link>
                    {displayContact.email2 && (
                      <Link
                        href="/contact"
                        className="hover:text-accent transition-smooth"
                        title="Aller à la page contact"
                      >
                        {displayContact.email2}
                      </Link>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} BBLAZE. Tous droits réservés.
          </p>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-white/45 hover:text-accent transition-smooth"
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
