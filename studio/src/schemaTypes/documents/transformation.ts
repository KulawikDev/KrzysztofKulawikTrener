import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const transformation = defineType({
  name: "transformation",
  title: "Transformacja",
  icon: UserIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Imię",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "age",
      title: "Wiek",
      description: "Wiek osoby w chwili transformacji (w latach)",
      type: "number",
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: "durationMonths",
      title: "Czas trwania (miesiące)",
      description: "Ile miesięcy trwała transformacja",
      type: "number",
    }),
    defineField({
      name: "imageBefore",
      title: "Zdjęcie przed",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Tekst alternatywny",
          type: "string",
          description: "Ważne dla SEO i dostępności.",
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageAfter",
      title: "Zdjęcie po",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Tekst alternatywny",
          type: "string",
          description: "Ważne dla SEO i dostępności.",
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stats",
      title: "Statystyki",
      description: "Mierzalne wyniki transformacji (np. waga, % tłuszczu)",
      type: "array",
      of: [
        {
          type: "object",
          title: "Statystyka",
          fields: [
            defineField({
              name: "label",
              title: "Nazwa",
              type: "string",
              description: 'np. "Waga", "% tłuszczu"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "before",
              title: "Wartość przed",
              type: "string",
              description: 'np. "85 kg", "40%"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "after",
              title: "Wartość po",
              type: "string",
              description: 'np. "70 kg", "25%"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              before: "before",
              after: "after",
            },
            prepare({ title, before, after }) {
              return {
                title,
                subtitle: `${before} → ${after}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Opis transformacji",
      description: "Szczegółowy opis historii i przebiegu transformacji",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      name: "name",
      age: "age",
      media: "imageAfter",
    },
    prepare({ name, age, media }) {
      return {
        title: name,
        subtitle: age ? `${age} lat` : undefined,
        media,
      };
    },
  },
});
