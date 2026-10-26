import type { NextConfig } from "next";
import quizPortraits from "./public/images/jogos/integrantes/credits.json";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      ...quizPortraits.map((photo) => ({
        pathname: photo.src,
        search: `?v=${photo.sha256.slice(0, 12)}`,
      })),
    ],
  },
};

export default nextConfig;
