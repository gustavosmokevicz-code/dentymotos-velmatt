import { parseWixMediaUrl, buildTransformUrl } from '@/components/ui/image-helpers';

// One fixed, preloaded rendition per photo: ~1600px wide, WebP/AVIF via Accept.
export function optimizedSrc(url) {
  const parsed = parseWixMediaUrl(url);
  if (!parsed) return url;
  return buildTransformUrl(parsed, { width: 1600, quality: 85 });
}

// Plain wrapper + img reproducing the DOM shape the carousel CSS was calibrated
// against, minus the lazy/blur behavior: photos are preloaded and decoded
// before a slide switch starts, so no placeholder is ever shown.
export default function PreloadedPhoto({ src, className, style }) {
  return (
    <span className={className} style={style}>
      <img src={optimizedSrc(src)} alt="" className="model-photo-fill" />
    </span>
  );
}
