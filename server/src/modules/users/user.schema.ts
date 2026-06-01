import { z } from 'zod';


// ─── Update Profile Schema ────────────────────────────────────────────────────

export const updateProfileSchema = z.object({

  body: z
    .object({

      name: z
        .string()
        .min(
          2,
          'Name must be at least 2 characters'
        )
        .max(
          50,
          'Name cannot exceed 50 characters'
        )
        .trim()
        .optional(),


      bio: z
        .string()
        .max(
          300,
          'Bio cannot exceed 300 characters'
        )
        .trim()
        .nullable()
        .optional(),


      avatarUrl: z
        .string()
        .url(
          'avatarUrl must be a valid URL'
        )
        .nullable()
        .optional(),


      githubUrl: z
        .string()
        .url(
          'githubUrl must be a valid URL'
        )
        .regex(
          /^https?:\/\/(www\.)?github\.com\/.+/,
          'Must be a valid GitHub URL'
        )
        .nullable()
        .optional(),


      linkedinUrl: z
        .string()
        .url(
          'linkedinUrl must be a valid URL'
        )
        .regex(
          /^https?:\/\/(www\.)?linkedin\.com\/.+/,
          'Must be a valid LinkedIn URL'
        )
        .nullable()
        .optional(),


      techStack: z
        .array(
          z
            .string()
            .trim()
            .min(
              1,
              'Technology name cannot be empty'
            )
        )
        .max(
          20,
          'Maximum 20 technologies allowed'
        )
        .optional(),

    })


    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          'At least one field must be provided',
      }
    ),

});


// ─── Inferred Types ───────────────────────────────────────────────────────────


export type UpdateProfileInput =
  z.infer<
    typeof updateProfileSchema
  >['body'];