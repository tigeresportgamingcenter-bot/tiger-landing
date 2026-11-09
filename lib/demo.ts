// Demo content is for local previews only: it needs DEMO_CONTENT=true in .env.local and never runs in production builds.
export const isDemoEnabled = () => process.env.NODE_ENV !== "production" && process.env.DEMO_CONTENT === "true";
