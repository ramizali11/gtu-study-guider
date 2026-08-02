import { createFileRoute } from "@tanstack/react-router";

import Dashboard from "@/pages/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GTU AI Study Assistant — Dashboard" },
      {
        name: "description",
        content:
          "Track study progress, generate MCQs, practice viva and prepare for GTU exams with an AI study assistant dashboard.",
      },
      { property: "og:title", content: "GTU AI Study Assistant — Dashboard" },
      {
        property: "og:description",
        content:
          "Track study progress, generate MCQs, practice viva and prepare for GTU exams with an AI study assistant dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
