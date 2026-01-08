import { mutation } from "./_generated/server";

// Seed initial branding data for testing
export const seedInitialBranding = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if branding already exists
    const existingBranding = await ctx.db.query("companyBranding").first();

    if (existingBranding) {
      return { message: "Branding data already exists", id: existingBranding._id };
    }

    // Create initial branding data
    const brandingId = await ctx.db.insert("companyBranding", {
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      textTheme: "dark" as const,
      companyName: "My Company",
    });

    return { message: "Initial branding data created", id: brandingId };
  },
});
