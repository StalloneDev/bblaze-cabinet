"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { loginAdminAction } from "@/app/actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast({
        title: "Mot de passe requis",
        description: "Veuillez entrer le mot de passe administrateur.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginAdminAction(password);

      if (result.success) {
        toast({
          title: "Connexion réussie !",
          description: "Bienvenue dans votre espace d'administration.",
        });
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        toast({
          title: "Échec de connexion",
          description: result.error || "Mot de passe incorrect.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-32 pb-20">
        <div className="container mx-auto px-4 w-full max-w-md">
          <Card className="shadow-strong border-border bg-card/85 backdrop-blur-md">
            <CardHeader className="space-y-4 text-center">
              <div className="p-3.5 rounded-full bg-gradient-to-br from-primary to-navy-light w-fit mx-auto shadow-md">
                <Scale className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="space-y-1.5">
                <CardTitle className="text-3xl font-serif">Administration</CardTitle>
                <CardDescription>
                  Saisissez le mot de passe administrateur pour accéder au panneau de configuration du cabinet.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe de sécurité</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 transition-smooth focus:border-accent"
                    />
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/60" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium hover:scale-[1.02] transition-smooth"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Se connecter au Dashboard"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
