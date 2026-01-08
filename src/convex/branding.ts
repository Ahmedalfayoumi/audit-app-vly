import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get the current branding settings
export const getBranding = query({
  args: {},
  handler: async (ctx) => {
    const branding = await ctx.db.query("companyBranding").first();
    return branding;
  },
});

// Update branding colors and text theme
export const updateBrandingColors = mutation({
  args: {
    primaryColor: v.string(),
    secondaryColor: v.string(),
    textTheme: v.union(v.literal("light"), v.literal("dark")),
  },
  handler: async (ctx, args) => {
    const existingBranding = await ctx.db.query("companyBranding").first();

    if (existingBranding) {
      await ctx.db.patch(existingBranding._id, {
        primaryColor: args.primaryColor,
        secondaryColor: args.secondaryColor,
        textTheme: args.textTheme,
      });
      return existingBranding._id;
    } else {
      return await ctx.db.insert("companyBranding", {
        primaryColor: args.primaryColor,
        secondaryColor: args.secondaryColor,
        textTheme: args.textTheme,
      });
    }
  },
});

// Update company name
export const updateCompanyName = mutation({
  args: {
    companyName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingBranding = await ctx.db.query("companyBranding").first();

    if (existingBranding) {
      await ctx.db.patch(existingBranding._id, {
        companyName: args.companyName,
      });
      return existingBranding._id;
    } else {
      return await ctx.db.insert("companyBranding", {
        primaryColor: "#3b82f6",
        secondaryColor: "#8b5cf6",
        textTheme: "dark" as const,
        companyName: args.companyName,
      });
    }
  },
});

// Generate upload URL for logo
export const generateLogoUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Generate upload URL for favicon
export const generateFaviconUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Update logo URL
export const updateLogoUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingBranding = await ctx.db.query("companyBranding").first();

    if (existingBranding) {
      await ctx.db.patch(existingBranding._id, {
        logoUrl: args.storageId,
      });
      return existingBranding._id;
    } else {
      return await ctx.db.insert("companyBranding", {
        primaryColor: "#3b82f6",
        secondaryColor: "#8b5cf6",
        textTheme: "dark" as const,
        logoUrl: args.storageId,
      });
    }
  },
});

// Update favicon URL
export const updateFaviconUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingBranding = await ctx.db.query("companyBranding").first();

    if (existingBranding) {
      await ctx.db.patch(existingBranding._id, {
        faviconUrl: args.storageId,
      });
      return existingBranding._id;
    } else {
      return await ctx.db.insert("companyBranding", {
        primaryColor: "#3b82f6",
        secondaryColor: "#8b5cf6",
        textTheme: "dark" as const,
        faviconUrl: args.storageId,
      });
    }
  },
});

// Get logo URL
export const getLogoUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get favicon URL
export const getFaviconUrl = query({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
