import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  // Accept any React component (LucideIcon or otherwise)
  icon: React.ComponentType<{ className?: string }>;
  link: string;
}

const ServiceCard = ({ title, description, icon: Icon, link }: ServiceCardProps) => {
  return (
    <Card className="group hover:shadow-strong transition-smooth border-border hover:border-accent/50 h-full flex flex-col">
      <CardHeader>
        <div className="p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 w-fit mb-4 group-hover:scale-110 transition-bounce">
          <Icon className="w-8 h-8 text-accent" />
        </div>
        <CardTitle className="text-2xl font-serif">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Additional content can be added here */}
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="group/btn w-full justify-between">
          <Link href={link}>
            <span>En savoir plus</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-smooth" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;

