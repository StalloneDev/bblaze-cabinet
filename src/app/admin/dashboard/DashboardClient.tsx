"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Settings,
  Briefcase,
  Mail,
  FileText,
  LogOut,
  Loader2,
  Trash2,
  Edit2,
  Plus,
  Minus,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  Upload,
  X,
  Search,
  Eye,
  EyeOff,
  Inbox,
  MailOpen,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  logoutAdminAction,
  updateContactAction,
  updateServiceAction,
  deletePostAction,
  deleteContactMessageAction,
  createPostAction,
  toggleMessageReadAction,
} from "@/app/actions";

interface DashboardClientProps {
  initialContact: any;
  initialServices: any[];
  initialMessages: any[];
  initialPosts: any[];
}

export default function DashboardClient({
  initialContact,
  initialServices,
  initialMessages,
  initialPosts,
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"services" | "contact" | "messages" | "posts">("services");
  const [isPending, setIsPending] = useState(false);

  // --- ÉTATS DE RECHERCHE ET FILTRAGE : MESSAGES CLIENTS ---
  const [messageSearch, setMessageSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState<"all" | "unread" | "read">("all");
  const [msgCurrentPage, setMsgCurrentPage] = useState(1);
  const MESSAGES_PER_PAGE = 5;

  // --- ÉTAT DE CONFIRMATION DE SUPPRESSION ---
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "message" | "post"; id: number } | null>(null);

  // --- ÉTATS DE VISUALISATION ET RÉPONSES RAPIDES MESSAGES ---
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");

  // Modèles de réponses rapides préconfigurés
  const REPLY_TEMPLATES = [
    {
      id: "none",
      label: "Personnalisé (Vide)",
      text: "",
    },
    {
      id: "contact",
      label: "Prise de contact générale",
      text: (name: string, subject: string) => 
        `Bonjour ${name},\n\nMerci pour votre message concernant "${subject}". Nous avons bien pris en compte votre demande.\n\nUn de nos conseillers juridiques va étudier votre dossier et reviendra vers vous dans les plus brefs délais.\n\nRestant à votre entière disposition,\n\nCordialement,\nL'équipe Cabinet BBLAZE`,
    },
    {
      id: "rdv",
      label: "Proposition de rendez-vous",
      text: (name: string, subject: string) => 
        `Bonjour ${name},\n\nNous faisons suite à votre message du Cabinet BBLAZE concernant "${subject}".\n\nAfin d'échanger plus en détail sur votre situation et de vous proposer l'accompagnement le plus adapté, seriez-vous disponible pour un court entretien téléphonique cette semaine ?\n\nSi oui, merci de nous indiquer vos disponibilités ainsi que le numéro à privilégier.\n\nCordialement,\nL'équipe Cabinet BBLAZE`,
    },
    {
      id: "info",
      label: "Demande d'informations complémentaires",
      text: (name: string, subject: string) => 
        `Bonjour ${name},\n\nNous vous remercions pour votre intérêt pour notre cabinet et votre message sur "${subject}".\n\nAfin de nous permettre d'analyser au mieux votre situation, pourriez-vous nous apporter quelques précisions supplémentaires sur les faits et les enjeux de votre dossier ?\n\nNous restons à votre écoute pour toute question.\n\nCordialement,\nL'équipe Cabinet BBLAZE`,
    },
  ];

  const handleSelectTemplate = (templateId: string, msg: any) => {
    if (!msg) return;
    const template = REPLY_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      if (typeof template.text === "function") {
        setReplyText(template.text(msg.name, msg.subject));
      } else {
        setReplyText(template.text);
      }
    }
  };

  const cleanPhoneForWhatsApp = (phone?: string | null) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0") && cleaned.length === 10) {
      cleaned = "33" + cleaned.substring(1);
    }
    return cleaned;
  };

  const handleOpenMessageDetails = async (msg: any) => {
    setSelectedMessage(msg);
    // Pré-remplir avec le modèle par défaut "contact"
    const defaultTemplate = REPLY_TEMPLATES.find((t) => t.id === "contact");
    if (defaultTemplate && typeof defaultTemplate.text === "function") {
      setReplyText(defaultTemplate.text(msg.name, msg.subject));
    } else {
      setReplyText("");
    }
    
    // Si le message est non lu, le marquer automatiquement comme lu en BDD
    if (!msg.read) {
      try {
        await toggleMessageReadAction(msg.id, true);
        router.refresh();
      } catch (err) {
        console.error("Erreur marquage lu auto :", err);
      }
    }
  };

  // --- Gestion de la déconnexion ---
  const handleLogout = async () => {
    setIsPending(true);
    await logoutAdminAction();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    router.push("/");
    router.refresh();
  };

  // --- ÉTAT ET TRANSMISSION : COORDONNÉES ---
  const [contactData, setContactData] = useState({
    email: initialContact?.email || "contact@bblaze.fr",
    phone: initialContact?.phone || "+33 1 23 45 67 89",
    address: initialContact?.address || "123 Avenue de la Justice, 75001 Paris",
    whatsappNumber: initialContact?.whatsappNumber || "+33123456789",
    whatsappMsg: initialContact?.whatsappMsg || "Bonjour, je souhaite obtenir des informations sur vos services.",
  });

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const result = await updateContactAction(contactData);
      if (result.success) {
        toast({
          title: "Coordonnées mises à jour",
          description: "Les coordonnées du cabinet ont été enregistrées avec succès.",
        });
        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Erreur réseau",
        description: "Impossible de contacter le serveur.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  // --- ÉTAT ET TRANSMISSION : SERVICES ---
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState<{
    title: string;
    description: string;
    expertise: string[];
    bulletPoints: string[];
    icon: string;
  }>({
    title: "",
    description: "",
    expertise: [],
    bulletPoints: [],
    icon: "",
  });

  const handleStartEditService = (service: any) => {
    let parsedContent: { expertise: string[]; bulletPoints: string[] } = {
      expertise: [],
      bulletPoints: [],
    };
    try {
      parsedContent = JSON.parse(service.content);
    } catch (e) {
      parsedContent = { expertise: [service.content as string], bulletPoints: [] };
    }

    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      expertise: parsedContent.expertise || [],
      bulletPoints: parsedContent.bulletPoints || [],
      icon: service.icon,
    });
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsPending(true);

    try {
      const result = await updateServiceAction(editingService.id, serviceForm);
      if (result.success) {
        toast({
          title: "Service mis à jour !",
          description: `Le service "${serviceForm.title}" a été modifié avec succès.`,
        });
        setEditingService(null);
        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Erreur réseau",
        description: "Impossible de contacter le serveur.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  // Ajout / Suppression de paragraphes d'expertise
  const handleAddExpertise = () => {
    setServiceForm({
      ...serviceForm,
      expertise: [...serviceForm.expertise, ""],
    });
  };

  const handleRemoveExpertise = (index: number) => {
    const updated = [...serviceForm.expertise];
    updated.splice(index, 1);
    setServiceForm({ ...serviceForm, expertise: updated });
  };

  const handleExpertiseChange = (index: number, val: string) => {
    const updated = [...serviceForm.expertise];
    updated[index] = val;
    setServiceForm({ ...serviceForm, expertise: updated });
  };

  // Ajout / Suppression de points clés (bullet points)
  const handleAddBulletPoint = () => {
    setServiceForm({
      ...serviceForm,
      bulletPoints: [...serviceForm.bulletPoints, ""],
    });
  };

  const handleRemoveBulletPoint = (index: number) => {
    const updated = [...serviceForm.bulletPoints];
    updated.splice(index, 1);
    setServiceForm({ ...serviceForm, bulletPoints: updated });
  };

  const handleBulletPointChange = (index: number, val: string) => {
    const updated = [...serviceForm.bulletPoints];
    updated[index] = val;
    setServiceForm({ ...serviceForm, bulletPoints: updated });
  };

  // --- GESTION DE LA LECTURE : MESSAGES CLIENTS ---
  const handleToggleMessageRead = async (id: number, currentReadStatus: boolean) => {
    setIsPending(true);
    try {
      const result = await toggleMessageReadAction(id, !currentReadStatus);
      if (result.success) {
        toast({
          title: !currentReadStatus ? "Message marqué comme lu" : "Message marqué comme non lu",
          description: "Le statut du message a été mis à jour avec succès.",
        });
        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de modifier le statut.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Erreur réseau",
        description: "Échec de la connexion.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  // --- GESTION DE LA SUPPRESSION : MESSAGES CLIENTS ---
  const handleDeleteMessage = (id: number) => {
    setDeleteConfirm({ type: "message", id });
  };

  // --- GESTION DE LA SUPPRESSION : POSTS ---
  const handleDeletePost = (id: number) => {
    setDeleteConfirm({ type: "post", id });
  };

  // --- EXÉCUTION DE LA SUPPRESSION APRÈS CONFIRMATION ---
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsPending(true);
    setDeleteConfirm(null);

    try {
      let result;
      if (deleteConfirm.type === "message") {
        result = await deleteContactMessageAction(deleteConfirm.id);
        if (result.success) {
          toast({ title: "Message supprimé", description: "Le message client a été retiré de la base de données." });
        }
      } else {
        result = await deletePostAction(deleteConfirm.id);
        if (result.success) {
          toast({ title: "Article supprimé", description: "L'article a été définitivement supprimé du blog." });
        }
      }
      if (result && !result.success) {
        toast({ title: "Erreur", description: result.error || "Impossible de supprimer.", variant: "destructive" });
      } else {
        router.refresh();
      }
    } catch (e) {
      toast({ title: "Erreur réseau", description: "Échec de connexion.", variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  // --- ÉTAT ET TRANSMISSION : NOUVEAU POST ---
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postForm, setPostForm] = useState<{
    title: string;
    content: string;
    category: string;
    imageBase64: string | null;
    imagePreview: string | null;
  }>({
    title: "",
    content: "",
    category: "Actu",
    imageBase64: null,
    imagePreview: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Image trop volumineuse",
        description: "Veuillez sélectionner une image de moins de 2 Mo.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPostForm((prev) => ({
        ...prev,
        imageBase64: base64String,
        imagePreview: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPostForm((prev) => ({
      ...prev,
      imageBase64: null,
      imagePreview: null,
    }));
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le titre et le contenu.",
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);

    try {
      const result = await createPostAction({
        title: postForm.title,
        content: postForm.content,
        category: postForm.category,
        imageBase64: postForm.imageBase64 || undefined,
      });

      if (result.success) {
        toast({
          title: "Post publié avec succès !",
          description: "L'article a bien été enregistré en base de données.",
        });
        setIsCreatingPost(false);
        setPostForm({
          title: "",
          content: "",
          category: "Actu",
          imageBase64: null,
          imagePreview: null,
        });
        router.refresh();
      } else {
        toast({
          title: "Erreur lors de la publication",
          description: result.error || "Une erreur est survenue.",
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
      setIsPending(false);
    }
  };

  // --- STATISTIQUES ET FILTRAGE DES MESSAGES CLIENTS ---
  const totalMessages = initialMessages.length;
  const unreadMessagesCount = initialMessages.filter((msg) => !msg.read).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const messagesThisMonthCount = initialMessages.filter((msg) => {
    const msgDate = new Date(msg.createdAt);
    return msgDate.getMonth() === currentMonth && msgDate.getFullYear() === currentYear;
  }).length;

  const filteredMessages = initialMessages.filter((msg) => {
    if (messageFilter === "unread" && msg.read) return false;
    if (messageFilter === "read" && !msg.read) return false;

    const query = messageSearch.toLowerCase().trim();
    if (!query) return true;

    return (
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      (msg.phone && msg.phone.toLowerCase().includes(query)) ||
      msg.subject.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query)
    );
  });

  // Pagination des messages
  const msgTotalPages = Math.ceil(filteredMessages.length / MESSAGES_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (msgCurrentPage - 1) * MESSAGES_PER_PAGE,
    msgCurrentPage * MESSAGES_PER_PAGE
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Dashboard Administration</h1>
          <p className="text-muted-foreground mt-1">
            Gérez en temps réel vos prestations, vos coordonnées et visualisez les messages de vos clients.
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          disabled={isPending}
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground hover:scale-105 transition-smooth"
        >
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
          Se déconnecter
        </Button>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 md:gap-4">
        <Button
          variant={activeTab === "services" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("services");
            setEditingService(null);
          }}
          className="flex-1 md:flex-none py-6 text-base"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Prestations / Services
        </Button>

        <Button
          variant={activeTab === "contact" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("contact");
            setEditingService(null);
          }}
          className="flex-1 md:flex-none py-6 text-base"
        >
          <Settings className="w-4 h-4 mr-2" />
          Coordonnées du Cabinet
        </Button>

        <Button
          variant={activeTab === "messages" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("messages");
            setEditingService(null);
          }}
          className="flex-1 md:flex-none py-6 text-base relative"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Messages Clients
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
              {unreadMessagesCount}
            </span>
          )}
        </Button>

        <Button
          variant={activeTab === "posts" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("posts");
            setEditingService(null);
          }}
          className="flex-1 md:flex-none py-6 text-base"
        >
          <FileText className="w-4 h-4 mr-2" />
          Publications Blog
        </Button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="mt-8">
        {/* TAB 1: SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-6">
            {!editingService ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialServices.map((service) => (
                  <Card key={service.id} className="shadow-soft hover:shadow-medium border-border transition-smooth relative flex flex-col justify-between">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent px-2 py-1 rounded bg-accent/10">
                          {service.icon}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleStartEditService(service)}
                          className="hover:bg-accent/10 text-accent"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-xl font-serif mt-4">{service.title}</CardTitle>
                      <CardDescription className="line-clamp-3 mt-1.5">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6">
                      <Button
                        variant="secondary"
                        onClick={() => handleStartEditService(service)}
                        className="w-full mt-4 flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Modifier la prestation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-medium border-border animate-in slide-in-from-bottom duration-500">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                  <div>
                    <CardTitle className="text-2xl font-serif">Modifier : {editingService.title}</CardTitle>
                    <CardDescription>
                      Les modifications apportées ci-dessous seront immédiatement visibles sur le site public.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setEditingService(null)}>
                    Annuler
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleUpdateService} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="s-title">Titre de la prestation</Label>
                        <Input
                          id="s-title"
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          required
                          className="transition-smooth focus:border-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="s-icon">Icône de la prestation</Label>
                        <select
                          id="s-icon"
                          value={serviceForm.icon}
                          onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-smooth focus:border-accent text-foreground"
                        >
                          <option value="Briefcase">💼 Ingénierie / Affaires (Briefcase)</option>
                          <option value="Users">👥 RH / Personnel (Users)</option>
                          <option value="Globe">🌐 International / Douane (Globe)</option>
                          <option value="DollarSign">💵 Recouvrement / Finance (DollarSign)</option>
                          <option value="Scale">⚖️ Justice / Médiation (Scale)</option>
                          <option value="GraduationCap">🎓 Formation / École (GraduationCap)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="s-desc">Description courte (affiche sur les cartes)</Label>
                      <Textarea
                        id="s-desc"
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        required
                        rows={2}
                        className="transition-smooth focus:border-accent resize-none"
                      />
                    </div>

                    {/* Expertise Paragraphs */}
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-base font-serif">Texte d'Expertise (Paragraphes)</h4>
                        <Button type="button" size="sm" variant="outline" onClick={handleAddExpertise}>
                          <Plus className="w-4 h-4 mr-1" /> Ajouter un paragraphe
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {serviceForm.expertise.map((para, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <Textarea
                              value={para}
                              onChange={(e) => handleExpertiseChange(idx, e.target.value)}
                              placeholder={`Paragraphe d'expertise ${idx + 1}`}
                              rows={3}
                              required
                              className="flex-1 transition-smooth focus:border-accent resize-none"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveExpertise(idx)}
                              className="text-destructive hover:bg-destructive/10 shrink-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-base font-serif">Domaines d'Intervention (Points clés)</h4>
                        <Button type="button" size="sm" variant="outline" onClick={handleAddBulletPoint}>
                          <Plus className="w-4 h-4 mr-1" /> Ajouter un domaine
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {serviceForm.bulletPoints.map((bp, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              value={bp}
                              onChange={(e) => handleBulletPointChange(idx, e.target.value)}
                              placeholder={`Ex: Création et structuration d'entreprise`}
                              required
                              className="flex-1 transition-smooth focus:border-accent"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveBulletPoint(idx)}
                              className="text-destructive hover:bg-destructive/10 shrink-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t justify-end">
                      <Button type="button" variant="outline" onClick={() => setEditingService(null)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 px-6">
                        {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* TAB 2: CONTACT & COORDONNÉES */}
        {activeTab === "contact" && (
          <Card className="shadow-soft border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Coordonnées du Cabinet & WhatsApp</CardTitle>
              <CardDescription>
                Mettez à jour les moyens de contact officiels affichés sur le site et configurez le bouton WhatsApp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateContact} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="c-email">E-mail officiel</Label>
                    <Input
                      id="c-email"
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      required
                      className="transition-smooth focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="c-phone">Numéro de Téléphone</Label>
                    <Input
                      id="c-phone"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      required
                      className="transition-smooth focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="c-address">Adresse physique</Label>
                  <Input
                    id="c-address"
                    value={contactData.address}
                    onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                    required
                    className="transition-smooth focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="c-wa-num">Numéro WhatsApp (Format international sans '+', ex: 33123456789)</Label>
                    <Input
                      id="c-wa-num"
                      value={contactData.whatsappNumber}
                      onChange={(e) => setContactData({ ...contactData, whatsappNumber: e.target.value })}
                      required
                      className="transition-smooth focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="c-wa-msg">Message WhatsApp automatique par défaut</Label>
                    <Input
                      id="c-wa-msg"
                      value={contactData.whatsappMsg}
                      onChange={(e) => setContactData({ ...contactData, whatsappMsg: e.target.value })}
                      required
                      className="transition-smooth focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 px-6">
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Enregistrer les coordonnées
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: CLIENT MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-border shadow-soft bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Reçus</p>
                    <p className="text-2xl font-serif font-bold">{totalMessages}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Non lus</p>
                    <p className="text-2xl font-serif font-bold flex items-center gap-2">
                      {unreadMessagesCount}
                      {unreadMessagesCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ce mois-ci</p>
                    <p className="text-2xl font-serif font-bold">{messagesThisMonthCount}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-card/30 backdrop-blur-sm border border-border rounded-xl shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, sujet..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="pl-9 h-10 border-border focus:border-accent"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={messageFilter === "all" ? "default" : "outline"}
                  onClick={() => setMessageFilter("all")}
                  size="sm"
                  className="h-10 text-xs px-3 rounded-lg"
                >
                  Tous
                </Button>
                <Button
                  variant={messageFilter === "unread" ? "default" : "outline"}
                  onClick={() => setMessageFilter("unread")}
                  size="sm"
                  className="h-10 text-xs px-3 rounded-lg flex items-center gap-1"
                >
                  Non lus
                  {unreadMessagesCount > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Button>
                <Button
                  variant={messageFilter === "read" ? "default" : "outline"}
                  onClick={() => setMessageFilter("read")}
                  size="sm"
                  className="h-10 text-xs px-3 rounded-lg"
                >
                  Lus
                </Button>
              </div>
            </div>

            {/* Messages Cards Grid/List */}
            {filteredMessages.length === 0 ? (
              <Card className="text-center py-16 border-border shadow-soft bg-card/25">
                <CardContent className="space-y-3">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/35 mx-auto" />
                  <h3 className="text-xl font-serif font-bold">Aucun message trouvé</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                    {messageSearch || messageFilter !== "all"
                      ? "Aucun message ne correspond à vos filtres de recherche."
                      : "Les messages soumis par les internautes apparaîtront ici."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
              <div className="space-y-4">
                {paginatedMessages.map((msg) => (
                  <Card 
                    key={msg.id} 
                    className={`shadow-soft border transition-smooth ${
                      !msg.read 
                        ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50" 
                        : "border-border hover:border-accent/30"
                    }`}
                  >
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-lg">{msg.name}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {msg.subject}
                          </span>
                          {!msg.read ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-amber-950 animate-pulse">
                              Non lu
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Lu
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            <a href={`mailto:${msg.email}`} className="hover:text-accent">{msg.email}</a>
                          </span>
                          {msg.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              <a href={`tel:${msg.phone}`} className="hover:text-accent">{msg.phone}</a>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-end">
                        <span className="text-xs text-muted-foreground mr-2">
                          {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {/* Consulter le message */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenMessageDetails(msg)}
                          className="hover:border-accent hover:text-accent flex items-center gap-1.5 h-8 px-3 rounded-full text-xs"
                        >
                          <MailOpen className="w-3.5 h-3.5" />
                          Consulter
                        </Button>
                        
                        {/* Toggle Read/Unread Action */}
                        <Button
                          size="icon"
                          variant="ghost"
                          title={msg.read ? "Marquer comme non lu" : "Marquer comme lu"}
                          onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                          className={`rounded-full ${
                            msg.read ? "text-muted-foreground hover:text-primary hover:bg-primary/10" : "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                          }`}
                        >
                          {msg.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-destructive hover:bg-destructive/10 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 leading-relaxed text-sm text-foreground/90 whitespace-pre-wrap">
                      {msg.message}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination des messages */}
              {msgTotalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMsgCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={msgCurrentPage === 1}
                    className="hover:border-accent disabled:opacity-40"
                  >
                    ← Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {msgCurrentPage} / {msgTotalPages} • {filteredMessages.length} messages
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMsgCurrentPage((p) => Math.min(msgTotalPages, p + 1))}
                    disabled={msgCurrentPage === msgTotalPages}
                    className="hover:border-accent disabled:opacity-40"
                  >
                    Suivant →
                  </Button>
                </div>
              )}
              </>
            )}
          </div>
        )}

        {/* TAB 4: POSTS */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div>
                <h3 className="text-xl font-serif font-bold">Gestion des Publications Blog</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Publiez de nouveaux articles ou supprimez ceux existants.
                </p>
              </div>
              {!isCreatingPost && (
                <Button
                  onClick={() => setIsCreatingPost(true)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau Post
                </Button>
              )}
            </div>

            {isCreatingPost ? (
              <Card className="shadow-medium border-border animate-in slide-in-from-bottom duration-500">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                  <div>
                    <CardTitle className="text-2xl font-serif">Publier un Post</CardTitle>
                    <CardDescription>
                      Remplissez les informations ci-dessous pour ajouter un nouvel article au blog.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setIsCreatingPost(false)}>
                    Annuler
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleCreatePostSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="post-title">Titre de la publication *</Label>
                      <Input
                        id="post-title"
                        type="text"
                        placeholder="Ex: Analyse de la nouvelle réglementation..."
                        value={postForm.title}
                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                        required
                        maxLength={150}
                        className="transition-smooth focus:border-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image de couverture (Max 2 Mo)</Label>
                      {postForm.imagePreview ? (
                        <div className="relative border border-border rounded-lg overflow-hidden h-60 bg-muted flex items-center justify-center">
                          <img src={postForm.imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleRemoveImage}
                            className="absolute top-3 right-3 shadow-md w-8 h-8 rounded-full hover:scale-105"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border hover:border-accent/40 rounded-lg p-8 text-center bg-card/30 transition-smooth group cursor-pointer relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="space-y-3">
                            <div className="p-3 rounded-full bg-accent/5 w-fit mx-auto group-hover:scale-110 transition-bounce">
                              <Upload className="w-6 h-6 text-accent" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-sm">Cliquez pour téléverser une image</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP jusqu'à 2 Mo</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post-category">Catégorie de la publication *</Label>
                      <select
                        id="post-category"
                        value={postForm.category}
                        onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-smooth focus:border-accent"
                        required
                      >
                        <option value="Actu">Actualités (Général)</option>
                        <option value="Juridique">Ingénierie Juridique</option>
                        <option value="RH">Ressources Humaines</option>
                        <option value="Commerce">Commerce International</option>
                        <option value="Mediation">Médiation & Recouvrement</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post-content">Contenu de la publication *</Label>
                      <Textarea
                        id="post-content"
                        placeholder="Saisissez votre texte d'analyse juridique, actualité..."
                        value={postForm.content}
                        onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                        required
                        rows={10}
                        maxLength={5000}
                        className="transition-smooth focus:border-accent resize-none leading-relaxed"
                      />
                      <div className="flex justify-end">
                        <p className="text-xs text-muted-foreground">{postForm.content.length}/5000 caractères</p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t justify-end">
                      <Button type="button" variant="outline" onClick={() => setIsCreatingPost(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 px-6">
                        {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Publier sur le site
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : initialPosts.length === 0 ? (
              <Card className="text-center py-16 border-border shadow-soft">
                <CardContent className="space-y-3">
                  <FileText className="w-12 h-12 text-muted-foreground/35 mx-auto" />
                  <h3 className="text-xl font-serif font-bold">Aucune publication</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                    Les articles et publications de blog s'afficheront ici.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {initialPosts.map((post) => (
                  <Card key={post.id} className="shadow-soft border-border hover:border-accent/20 transition-smooth flex items-center justify-between p-4 gap-4">
                    <div className="flex items-center gap-4 overflow-hidden">
                      {post.imageUrl ? (
                        <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-muted">
                          <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded shrink-0 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-accent/30">
                          <Clock className="w-6 h-6" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <h4 className="font-serif font-bold text-base truncate">{post.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Publié le {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <Button asChild size="icon" variant="ghost" className="text-accent hover:bg-accent/10">
                        <a href="/blog" target="_blank">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AlertDialog de confirmation de suppression */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.type === "message"
                ? "Voulez-vous vraiment supprimer ce message client ? Cette action est irréversible."
                : "Voulez-vous vraiment supprimer cet article de blog ? Cette action est irréversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tiroir de détails de message et réponse rapide */}
      <Sheet open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto h-full flex flex-col justify-between">
          <div>
            <SheetHeader className="space-y-3 pb-6 border-b text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-accent px-2.5 py-1 rounded bg-accent/10">
                  {selectedMessage?.subject || "Message"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedMessage && new Date(selectedMessage.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <SheetTitle className="text-2xl font-serif font-bold text-foreground text-left">
                Message de {selectedMessage?.name}
              </SheetTitle>
              <SheetDescription className="text-sm text-left">
                Consultez le message complet et répondez directement par e-mail ou WhatsApp.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 pt-6">
              {/* Expéditeur Info */}
              <div className="bg-muted/40 p-4 rounded-xl space-y-3 border border-border/60">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Expéditeur</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">E-mail</span>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${selectedMessage?.email}`} className="font-medium text-primary hover:underline truncate block max-w-[200px]">
                        {selectedMessage?.email}
                      </a>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-6 h-6 hover:bg-primary/10 text-primary rounded-full shrink-0"
                        title="Copier l'e-mail"
                        onClick={() => {
                          if (selectedMessage?.email) {
                            navigator.clipboard.writeText(selectedMessage.email);
                            toast({
                              title: "E-mail copié",
                              description: "L'adresse e-mail a été copiée.",
                            });
                          }
                        }}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  {selectedMessage?.phone && (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground block">Téléphone</span>
                      <div className="flex items-center gap-2">
                        <a href={`tel:${selectedMessage.phone}`} className="font-medium text-primary hover:underline truncate block max-w-[200px]">
                          {selectedMessage.phone}
                        </a>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-6 h-6 hover:bg-primary/10 text-primary rounded-full shrink-0"
                          title="Copier le numéro"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedMessage.phone);
                            toast({
                              title: "Numéro copié",
                              description: "Le numéro de téléphone a été copié.",
                            });
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Corps du message */}
              <div className="space-y-2">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Message client</h4>
                <div className="bg-card border border-border p-4 rounded-xl text-sm leading-relaxed text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto shadow-sm">
                  {selectedMessage?.message}
                </div>
              </div>

              {/* Zone de réponse rapide */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Réponse rapide</h4>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="template-select" className="text-xs text-muted-foreground shrink-0">Modèle :</Label>
                    <select
                      id="template-select"
                      onChange={(e) => handleSelectTemplate(e.target.value, selectedMessage)}
                      defaultValue="contact"
                      className="text-xs bg-background border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
                    >
                      {REPLY_TEMPLATES.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Rédigez ou personnalisez votre réponse ici..."
                    rows={6}
                    className="text-sm transition-smooth focus:border-accent resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t mt-6 bg-background shrink-0">
            <Button
              asChild
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 flex items-center justify-center gap-2 text-sm py-5"
            >
              <a
                href={`mailto:${selectedMessage?.email}?subject=RE: ${encodeURIComponent(selectedMessage?.subject || "")}&body=${encodeURIComponent(replyText)}`}
              >
                <Mail className="w-4 h-4" />
                Répondre par E-mail
              </a>
            </Button>
            {selectedMessage?.phone && (
              <Button
                asChild
                variant="outline"
                className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 flex items-center justify-center gap-2 text-sm py-5 transition-colors"
              >
                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(selectedMessage.phone)}?text=${encodeURIComponent(replyText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Répondre sur WhatsApp
                </a>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
