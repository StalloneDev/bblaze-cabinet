"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MessageSquare,
  ArrowRight,
  User,
  Search,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  category: string;
  createdAt: Date;
}

interface BlogClientProps {
  initialPosts: any[];
  isAdmin: boolean;
}

const categories = [
  { id: "Tous", label: "Toutes les publications", emoji: "📂" },
  { id: "Juridique", label: "Ingénierie Juridique", emoji: "⚖️" },
  { id: "RH", label: "Ressources Humaines", emoji: "👥" },
  { id: "Commerce", label: "Commerce International", emoji: "🌐" },
  { id: "Mediation", label: "Médiation & Recouvrement", emoji: "🤝" },
  { id: "Actu", label: "Actualités", emoji: "📰" },
];

const POSTS_PER_PAGE = 6;

export default function BlogClient({ initialPosts, isAdmin }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  // Déterminer la catégorie d'un post
  const getPostCategory = (post: Post) => {
    const matched = categories.find((cat) => cat.id === post.category);
    if (matched) return matched;
    return { id: "Actu", label: "Actualités", emoji: "📰" };
  };

  // Filtrer les posts en temps réel
  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "Tous") return matchesSearch;

    return matchesSearch && post.category === selectedCategory;
  });

  // Reset la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Search & Filter section */}
      <div className="space-y-6 bg-card/40 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-soft">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une publication, une analyse juridique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-base rounded-xl border-border focus:border-accent transition-smooth shadow-sm bg-background"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full flex items-center gap-1.5 px-4 py-2 hover:scale-105 transition-bounce text-sm shadow-sm"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts Results Grid */}
      <div>
        {filteredPosts.length === 0 ? (
          <Card className="text-center py-20 shadow-soft border-border bg-card/30 backdrop-blur-sm">
            <CardContent className="space-y-6">
              <MessageSquare className="w-16 h-16 text-muted-foreground/35 mx-auto animate-pulse" />
              <h3 className="text-2xl font-serif font-bold">Aucune publication trouvée</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || selectedCategory !== "Tous"
                  ? "Ajustez vos filtres ou vos termes de recherche pour trouver d'autres articles."
                  : "Le cabinet n'a publié aucun article pour le moment. Revenez bientôt !"}
              </p>
              {(searchQuery || selectedCategory !== "Tous") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Tous");
                  }}
                  variant="outline"
                  className="hover:scale-105 transition-smooth"
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => {
                const cat = getPostCategory(post);
                return (
                  <Card
                    key={post.id}
                    className="flex flex-col border-none shadow-soft hover:shadow-strong transition-smooth hover:scale-[1.02] overflow-hidden bg-card/80 backdrop-blur-sm relative"
                  >
                    {/* Category Badge on top of image */}
                    <span className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <span>{cat.emoji}</span>
                      {cat.label}
                    </span>

                    {/* Post Image (Base64) */}
                    {post.imageUrl ? (
                      <div className="h-52 w-full overflow-hidden relative bg-muted flex items-center justify-center">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-smooth hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="h-52 w-full bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-accent/30">
                        <Calendar className="w-16 h-16" />
                      </div>
                    )}

                    <CardHeader className="space-y-2">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          Cabinet BBLAZE
                        </span>
                      </div>
                      <CardTitle className="text-xl font-serif line-clamp-2 leading-snug">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
                        {post.content}
                      </p>

                      <div className="pt-4 border-t border-border flex justify-end">
                        <Button
                          asChild
                          variant="ghost"
                          className="text-accent hover:text-accent/80 hover:bg-accent/10 p-0 text-sm font-semibold flex items-center gap-1 group"
                        >
                          <Link href={`/blog/${post.id}`}>
                            Voir plus
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-10 w-10 rounded-full border-border hover:border-accent hover:bg-accent/10 disabled:opacity-40 transition-smooth"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-full text-sm font-semibold transition-smooth ${
                      page === currentPage
                        ? "bg-accent text-accent-foreground shadow-medium"
                        : "border-border hover:border-accent hover:bg-accent/10"
                    }`}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-10 w-10 rounded-full border-border hover:border-accent hover:bg-accent/10 disabled:opacity-40 transition-smooth"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <span className="text-xs text-muted-foreground ml-2">
                  Page {currentPage} sur {totalPages} &bull; {filteredPosts.length} articles
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
