import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  // 1. Initialiser le Contact
  await prisma.contactInfo.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      email: 'contact@cabinetjuridique.fr',
      phone: '+33 1 23 45 67 89',
      address: '123 Avenue de la Justice, 75001 Paris',
      whatsappNumber: '+33123456789',
      whatsappMsg: 'Bonjour, je souhaite obtenir des informations sur vos services.',
    },
  });
  console.log('ContactInfo initialisé !');

  // 2. Initialiser les Services
  const servicesData = [
    {
      id: 'ingenierie-juridique',
      title: 'Ingénierie Juridique',
      description: "Création d'entreprise, rédaction de contrats, audit juridique et restructuration.",
      icon: 'Briefcase',
      content: JSON.stringify({
        expertise: [
          "Notre équipe d'experts en ingénierie juridique vous accompagne dans tous les aspects juridiques de votre activité. De la création de votre structure à sa croissance, en passant par les opérations de restructuration, nous mettons notre expertise à votre service pour sécuriser vos projets et optimiser votre organisation juridique.",
          "Nous intervenons aussi bien pour les start-ups en phase de création que pour les grandes entreprises nécessitant une restructuration ou une mise en conformité réglementaire."
        ],
        bulletPoints: [
          "Création et structuration d'entreprise",
          "Rédaction et négociation de contrats commerciaux",
          "Audit juridique complet",
          "Restructuration et fusion-acquisition",
          "Mise en conformité réglementaire",
          "Protection de la propriété intellectuelle"
        ]
      })
    },
    {
      id: 'ressources-humaines',
      title: 'Ressources Humaines',
      description: 'Droit du travail, contrats, procédures internes et gestion de litiges sociaux.',
      icon: 'Users',
      content: JSON.stringify({
        expertise: [
          "Le droit du travail est un domaine complexe en constante évolution. Notre équipe vous accompagne dans la gestion quotidienne de vos ressources humaines et vous conseille pour prévenir les risques juridiques liés aux relations de travail.",
          "De la rédaction des contrats à la gestion des litiges, en passant par la mise en place de procédures internes, nous assurons la conformité de vos pratiques RH avec la législation en vigueur."
        ],
        bulletPoints: [
          "Conseil en droit du travail",
          "Rédaction de contrats de travail",
          "Élaboration de règlements intérieurs",
          "Gestion des procédures disciplinaires",
          "Assistance lors de litiges sociaux",
          "Formation des équipes RH"
        ]
      })
    },
    {
      id: 'commerce-international',
      title: 'Commerce International',
      description: 'Contrats internationaux, Incoterms, gestion douanière et import/export.',
      icon: 'Globe',
      content: JSON.stringify({
        expertise: [
          "Dans un monde globalisé, le commerce international offre d'immenses opportunités mais comporte également des risques juridiques complexes. Notre cabinet vous aide à sécuriser vos transactions transfrontalières et à naviguer dans le cadre réglementaire international.",
          "Nous vous conseillons sur le choix et l'application des Incoterms, la rédaction de contrats commerciaux internationaux et le respect des réglementations douanières pour fluidifier vos échanges mondiaux."
        ],
        bulletPoints: [
          "Conseil sur les réglementations douanières",
          "Rédaction de contrats internationaux",
          "Accompagnement import/export",
          "Gestion des litiges commerciaux internationaux",
          "Conseil sur le choix des Incoterms",
          "Optimisation fiscale internationale"
        ]
      })
    },
    {
      id: 'recouvrement',
      title: 'Recouvrement',
      description: 'Recouvrement amiable et judiciaire, négociation et relances personnalisées.',
      icon: 'DollarSign',
      content: JSON.stringify({
        expertise: [
          "La gestion des impayés est cruciale pour la santé financière de votre entreprise. Nous mettons en œuvre des stratégies de recouvrement efficaces, privilégiant dans un premier temps le dialogue et la négociation pour préserver vos relations commerciales.",
          "En cas de nécessité, nous engageons les procédures judiciaires adaptées pour obtenir le paiement rapide de vos créances, tout en assurant un suivi rigoureux de l'exécution des décisions obtenues."
        ],
        bulletPoints: [
          "Recouvrement amiable de créances",
          "Relances téléphoniques et écrites personnalisées",
          "Négociation d'échéanciers de paiement",
          "Procédures de recouvrement judiciaire",
          "Suivi de l'exécution des décisions de justice",
          "Conseil en prévention des impayés"
        ]
      })
    },
    {
      id: 'mediation',
      title: 'Médiation',
      description: 'Médiation commerciale, familiale et professionnelle pour résoudre les conflits.',
      icon: 'Scale',
      content: JSON.stringify({
        expertise: [
          "La médiation est un mode alternatif de règlement des différends (MARD) qui permet de résoudre les conflits de manière rapide, confidentielle et pacifique, en évitant les aléas et la longueur d'un procès judiciaire.",
          "Notre médiateur diplômé et neutre aide les parties à rétablir le dialogue, à identifier leurs intérêts communs et à construire ensemble une solution sur mesure, mutuellement acceptable et durable."
        ],
        bulletPoints: [
          "Médiation inter-entreprises (conflits commerciaux)",
          "Médiation intra-entreprise (conflits du travail)",
          "Médiation familiale et successorale",
          "Négociation raisonnée et facilitation de dialogue",
          "Rédaction de protocoles d'accord",
          "Prévention et gestion de crise"
        ]
      })
    },
    {
      id: 'formations',
      title: 'Formations en Droit',
      description: 'Formations pour entreprises et particuliers sur mesure.',
      icon: 'GraduationCap',
      content: JSON.stringify({
        expertise: [
          "La formation continue en droit est essentielle pour sécuriser l'activité de vos équipes et anticiper les évolutions réglementaires. Nous concevons et animons des sessions de formation interactives et concrètes adaptées aux réalités de votre secteur.",
          "Nos thématiques couvrent le droit des contrats, le droit du travail, la responsabilité des dirigeants, et le RGPD, avec des formats modulables (présentiel ou distanciel) conçus pour maximiser l'apprentissage pratique."
        ],
        bulletPoints: [
          "Formations en droit des contrats",
          "Sensibilisation aux risques juridiques en entreprise",
          "Formation sur les actualités en droit du travail",
          "Ateliers pratiques de négociation contractuelle",
          "Sessions sur mesure pour les dirigeants",
          "Certifications et évaluations"
        ]
      })
    }
  ];

  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    });
    console.log(`Service '${service.title}' inséré/mis à jour.`);
  }

  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
