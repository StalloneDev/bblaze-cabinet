import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  imageUrl: string;
}

const ServiceCard = ({ title, description, icon: Icon, link, imageUrl }: ServiceCardProps) => {
  return (
    <Card className="group hover:shadow-strong transition-smooth border-border hover:border-accent/40 h-full flex flex-col overflow-hidden bg-card/60 backdrop-blur-sm">
      {/* Image de couverture premium */}
      <div className="h-32 w-full relative overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-smooth"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-60" />
        
        {/* Icône superposée flottante de style haute couture */}
        <div className="absolute -bottom-4 left-4 p-2 rounded-xl bg-background dark:bg-card border border-border shadow-medium group-hover:scale-110 transition-bounce z-10">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      </div>

      <CardHeader className="pt-6 pb-2 px-4">
        <CardTitle className="text-lg font-serif font-bold group-hover:text-accent transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-xs line-clamp-2 leading-relaxed mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow px-4 py-0" />

      <CardFooter className="p-4 pt-0 mt-2">
        <Button asChild variant="ghost" className="group/btn w-full justify-between hover:bg-accent/5 hover:text-accent border border-transparent hover:border-accent/20 rounded-lg text-xs py-3 h-auto">
          <Link href={link}>
            <span className="font-semibold">Découvrir l'expertise</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-smooth" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
