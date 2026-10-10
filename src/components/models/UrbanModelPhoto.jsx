import PreloadedPhoto from '@/components/models/PreloadedPhoto';
import '@/components/models/urban-photos.css';

export default function UrbanModelPhoto({ model, mobile = false }) {
  const framing = model.photoFraming;
  // Pad the mask around the subject; its solid center contains the mirrors and both wheels.
  const floorOffset = 90 * (framing.desktop / 100) * (9 / 16) * (framing.ground - 0.5);
  return (
    <div
      className={`urban-model-photo ${mobile ? 'models-mp-photo' : 'models-bg-photo'}`}
      data-model-photo={model.model}
      style={{ '--photo-width': `${mobile ? framing.mobile : framing.desktop}%`, '--photo-floor-offset': `${floorOffset}vw` }}
      aria-hidden="true"
    >
      <PreloadedPhoto src={model.photo} className="urban-model-image" />
    </div>
  );
}
