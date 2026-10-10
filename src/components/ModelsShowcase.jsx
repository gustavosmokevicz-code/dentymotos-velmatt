import { useState, useEffect, useRef, Fragment } from 'react';
import { ArrowLeft, ArrowRight, Gauge, Zap, BatteryCharging } from 'lucide-react';
import PreloadedPhoto, { optimizedSrc } from '@/components/models/PreloadedPhoto';
import UrbanModelPhoto from '@/components/models/UrbanModelPhoto';
import { URBANAS } from '@/components/models/urbanCatalog';

const X13_PHOTO = 'https://media.base44.com/images/public/6ab9a8c91318a2c8f812767d/766f41d1b_c419b902-563e-49db-8110-30490420d6bf.jpg';
const HARLEY_PHOTO = 'https://media.base44.com/images/public/6ab9a8c91318a2c8f812767d/17c61a994_07a19960-7b64-4ae9-88aa-d3d3530a674e.jpg';

export const PNEU_LARGO = {
  id: 'scooters',
  ariaLabel: 'Modelos de scooters elétricas',
  subtitle: 'SCOOTERS DE PNEU LARGO',
  models: [
    {
      brand: 'VELMATT', model: 'X13', price: 'R$ 7.990',
      speed: '32 km/h', power: '1.000 W', range: 'Até 50 km',
      battery: 'Lítio removível', color: 'Preto',
      photo: X13_PHOTO, photoClass: 'is-x13', scale: 0.62, offsetY: 50,
    },
    {
      brand: 'VELMATT', model: 'HARLEY', price: 'R$ 7.990',
      speed: '32 km/h', power: '1.000 W', range: 'Até 50 km',
      battery: 'Lítio removível', color: 'Azul',
      photo: HARLEY_PHOTO, photoClass: 'is-harley', scale: 0.62, offsetY: 50,
    },
  ],
};

export { URBANAS };

const SPECS = (m) => [
  { icon: Gauge, label: 'VELOCIDADE MÁX.', value: m.speed },
  { icon: Zap, label: 'POTÊNCIA', value: m.power },
  { icon: BatteryCharging, label: 'AUTONOMIA', value: m.range },
];

const EXTRA = (m) => [
  { label: 'BATERIA', value: m.battery },
  { label: m.colorLabel || 'COR', value: m.color },
];

const renderIdentity = (m) => (
  <div className="models-identity">
    <span className="models-brand">{m.brand}</span>
    <span className="models-model">{m.model}</span>
  </div>
);

const renderPrice = (m) => (
  <div className="models-price">
    <span className="models-price-label">A PARTIR DE</span>
    <div className="models-price-row">
      <span className="models-price-line" aria-hidden="true" />
      <span className="models-price-value">{m.price}</span>
      <span className="models-price-line" aria-hidden="true" />
    </div>
  </div>
);

const renderSpecs = (m) => (
  <div className="models-specs">
    {SPECS(m).map((s, i) => (
      <Fragment key={s.label}>
        <div className="models-spec">
          <s.icon className="models-spec-icon" size={40} strokeWidth={1.5} aria-hidden="true" />
          <div className="models-spec-text">
            <span className="models-spec-label">{s.label}</span>
            <span className="models-spec-value">{s.value}</span>
          </div>
        </div>
        {i < 2 && <span className="models-spec-divider" aria-hidden="true" />}
      </Fragment>
    ))}
  </div>
);

const renderExtra = (m) => (
  <div className="models-extra">
    {EXTRA(m).map((e, i) => (
      <Fragment key={e.label}>
        <div className="models-extra-item">
          <span className="models-spec-label">{e.label}</span>
          <span className="models-spec-value">{e.value}</span>
        </div>
        {i < 1 && <span className="models-spec-divider models-extra-divider" aria-hidden="true" />}
      </Fragment>
    ))}
  </div>
);

function SlideText({ current, outgoing, animating, render }) {
  return (
    <div className="models-twrap">
      <div className="models-tstatic">{render(current)}</div>
      {animating && outgoing != null && (
        <>
          <div key={`out-${outgoing.model}`} className="models-tout">{render(outgoing)}</div>
          <div key={`in-${current.model}`} className="models-tin">{render(current)}</div>
        </>
      )}
    </div>
  );
}

const modelStyleVars = (model) => ({
  '--scale': model.scale ?? 1,
  '--offset-y': `${model.offsetY ?? 0}px`,
});

function BgPhoto({ model }) {
  if (model.photoFraming) return <UrbanModelPhoto model={model} />;
  return (
    <PreloadedPhoto
      src={model.photo}
      className={`models-bg-photo ${model.photoClass || ''}`}
      style={modelStyleVars(model)}
    />
  );
}

function MpPhoto({ model }) {
  if (model.photoFraming) return <UrbanModelPhoto model={model} mobile />;
  return (
    <PreloadedPhoto
      src={model.photoMobile || model.photo}
      className={`models-mp-photo ${model.photoClass || ''}`}
    />
  );
}

// Giant outlined name shrinks for long model names so it fits 90% of the viewport width
const bgNameStyle = (name) => ({ fontSize: `min(clamp(120px, 18vw, 280px), ${Math.round(88 / Math.max(name.length * 0.85, 1))}vw)` });

// Desktop background slide: glow, name and floor line render behind the photo
function BgSlide({ model, animClass }) {
  return (
    <div className={`models-bg ${animClass ?? ''}`}>
      <div className="models-bgname" aria-hidden="true" style={bgNameStyle(model.model)}>{model.model}</div>
      <div className="models-glow" aria-hidden="true" />
      <BgPhoto model={model} />
      <div className="models-floorline" aria-hidden="true" />
    </div>
  );
}

export default function ModelsShowcase({ config = PNEU_LARGO }) {
  const models = config.models;
  const n = models.length;
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [outgoing, setOutgoing] = useState(null);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(null);
  const sectionRef = useRef(null);
  const readyRef = useRef(new Set());
  // Synchronous lock: events fired in the same tick (rapid taps, double swipes)
  // must never queue a second transition while one is running.
  const animatingRef = useRef(false);

  // Preload and decode every carousel photo once the section approaches the
  // viewport; a switch only starts when the next photo is already ready.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let started = false;
    const preloadAll = () => {
      models.forEach((m) => {
        if (readyRef.current.has(m.model)) return;
        const img = new Image();
        const done = () => readyRef.current.add(m.model);
        img.onload = done;
        img.onerror = done;
        img.src = optimizedSrc(m.photo);
        if (img.complete) done();
        else img.decode().then(done, done);
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (!started) { started = true; preloadAll(); }
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [models]);

  useEffect(() => {
    if (!animating) return;
    const t = setTimeout(() => {
      animatingRef.current = false;
      setAnimating(false);
      setOutgoing(null);
    }, 1040);
    return () => clearTimeout(t);
  }, [animating]);

  const navigate = (dir) => {
    if (animatingRef.current || n < 2) return;
    const nextIndex = (index + dir + n) % n;
    if (!readyRef.current.has(models[nextIndex].model)) return;
    animatingRef.current = true;
    setDirection(dir);
    setOutgoing(index);
    setIndex(nextIndex);
    setAnimating(true);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -40) navigate(1);
    else if (dx > 40) navigate(-1);
  };

  const m = models[index];
  const out = outgoing != null ? models[outgoing] : null;

  return (
    <section
      ref={sectionRef}
      id={config.id}
      className="models"
      style={{ '--dir': direction }}
      aria-label={config.ariaLabel}
      aria-roledescription="carrossel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Desktop: full-bleed background scene (name, glow, photo, floor line) */}
      <div className="models-bg-desktop">
        {animating && out ? (
          <>
            <BgSlide key={`out-${out.model}`} model={out} animClass="models-bg-out" />
            <BgSlide key={`in-${m.model}`} model={m} animClass="models-bg-in" />
          </>
        ) : (
          <BgSlide key={m.model} model={m} />
        )}
      </div>

      {/* Slow drifting smoke (desktop only) */}
      <div className="models-atmo" aria-hidden="true">
        <div className="models-smoke models-smoke-a" />
        <div className="models-smoke models-smoke-b" />
      </div>

      <div className="models-overlay" aria-hidden="true" />
      <div className="models-grain" aria-hidden="true" />

      <div className={`models-content ${animating ? 'models-animating' : ''}`}>
        <header className="models-head">
          <span className="models-kicker">{config.kicker || 'SCOOTERS ELÉTRICOS'}</span>
          <h2 className="models-title">CONHEÇA NOSSOS MODELOS</h2>
          <span className="models-subtitle">{config.subtitle}</span>
          <span className="models-divider" aria-hidden="true" />
        </header>

        <div className="models-identity-row">
          <button
            type="button"
            className="models-arrow-mobile models-arrow-mobile-prev"
            onClick={() => navigate(-1)}
            disabled={n < 2}
            aria-label="Modelo anterior"
          >
            <span className="models-arrow-mobile-circle">
              <ArrowLeft size={16} strokeWidth={1.4} aria-hidden="true" />
            </span>
          </button>
          <SlideText current={m} outgoing={out} animating={animating} render={renderIdentity} />
          <button
            type="button"
            className="models-arrow-mobile models-arrow-mobile-next"
            onClick={() => navigate(1)}
            disabled={n < 2}
            aria-label="Próximo modelo"
          >
            <span className="models-arrow-mobile-circle">
              <ArrowRight size={16} strokeWidth={1.4} aria-hidden="true" />
            </span>
          </button>
        </div>

        {/* Desktop: spacer gap with side arrows */}
        <div className="models-scooter-gap">
          <button
            type="button"
            className="models-arrow models-arrow-prev"
            onClick={() => navigate(-1)}
            disabled={n < 2}
            aria-label="Modelo anterior"
          >
            <ArrowLeft size={18} strokeWidth={1.4} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="models-arrow models-arrow-next"
            onClick={() => navigate(1)}
            disabled={n < 2}
            aria-label="Próximo modelo"
          >
            <ArrowRight size={18} strokeWidth={1.4} aria-hidden="true" />
          </button>
        </div>

        {/* Mobile: in-flow photo container */}
        <div className="models-photo-mobile">
          {animating && out ? (
            <>
              <div key={`out-${out.model}`} className="models-mp models-bg-out">
                <MpPhoto model={out} />
              </div>
              <div key={`in-${m.model}`} className="models-mp models-bg-in">
                <MpPhoto model={m} />
              </div>
            </>
          ) : (
            <div key={m.model} className="models-mp">
              <MpPhoto model={m} />
            </div>
          )}
        </div>

        <SlideText current={m} outgoing={out} animating={animating} render={renderPrice} />
        {!config.onlyPrice && (
          <>
            <SlideText current={m} outgoing={out} animating={animating} render={renderSpecs} />
            <SlideText current={m} outgoing={out} animating={animating} render={renderExtra} />
          </>
        )}
      </div>
    </section>
  );
}
