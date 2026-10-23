export const siteConfig = {
  name: "sufi",
  title: "Freelance Full-Stack Web Developer (React · TypeScript · Next.js)",
  location: "Indonesia",
  countryCode: "ID",
  email: "richhum4n@gmail.com",
  whatsapp: "6285838146815",
  baseUrl: "https://your-domain.com",
  heroImage: "/images/hero-studio.jpg",
  skills: ["React", "TypeScript", "Next.js", "Node.js"],
  socials: {
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-username/",
  },
  projects: [
    {
      id: "studio",
      image: "/images/baro-edit.jpg",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      demo: "https://baro-korean-course-exm.lovable.app",
      source: "https://github.com/your-username/studio-north-concept",
    },
    {
      id: "dashboard",
      image: "/images/langits2.jpg",
      tags: ["React", "TypeScript", "Recharts"],
      demo: "",https://langit-djajan-exmp.lovable.app/
      source: "https://github.com/your-username/pulse-dashboard-concept",
    },
    {
      id: "commerce",
      image: "/images/kasirkuss2.jpg",
      tags: ["Next.js", "Shopify", "Framer Motion"],
      demo: "https://kasirku-on.netlify.app",
      source: "https://github.com/your-username/forma-store-concept",
    },
  ],
  pricing: [
    { id: "landing", startingPrice: 650 },
    { id: "company", startingPrice: 1200 },
    { id: "webApp", startingPrice: null },
  ],
} as const;
