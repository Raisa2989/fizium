import type { NextConfig } from "next";

/**
 * ФизиУм — полностью статическое PWA: без сервера, API и базы данных.
 *
 * `output: "export"` — сборка в обычные HTML/CSS/JS-файлы (папка out/),
 * которые размещаются на любом статическом хостинге (GitHub Pages, reg.ru и т.д.).
 *
 * `basePath` нужен ТОЛЬКО при публикации в подпапку адреса, например
 * GitHub Pages: https://логин.github.io/fizium/ — тогда при сборке задаётся
 * переменная окружения NEXT_PUBLIC_BASE_PATH=/fizium.
 * Для корня домена (reg.ru, свой домен на GitHub Pages) она пустая —
 * ничего менять не нужно.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
