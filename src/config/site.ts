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
      tags: ["TypeScript", "JavaScript", "CSS"],
      demo: "https://baro-korean-course-exm.lovable.app",
    },
    {
      id: "dashboard",
      image: "/images/langits2.jpg",
      tags: ["TypeScript", "JavaScript", "CSS"],
      demo: "https://langit-djajan-exmp.lovable.app",
    },
    {
      id: "commerce",
      image: "/images/kasirkuss2.jpg",
      tags: ["TypeScript", "CSS", "JavaScript", "IndexedDB", "Supabase"],
      demo: "https://kasirku-on.netlify.app",
    },
  ],
  pricing: [
    { id: "landing", startingPrice: 650 },
    { id: "company", startingPrice: 1200 },
    { id: "webApp", startingPrice: null },
  ],
} as const;
