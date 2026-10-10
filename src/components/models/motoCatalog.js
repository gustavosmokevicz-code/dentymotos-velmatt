const photo = (file) => `https://media.base44.com/images/public/6ac6df27c1aaf58bc1b5434d/${file}`;

export const MOTOS = {
  id: 'motos',
  ariaLabel: 'Motos a combustão',
  subtitle: 'MOTOS A COMBUSTÃO',
  kicker: 'MOTOS',
  onlyPrice: true,
  models: [
    {
      brand: 'HONDA', model: 'XR300L TORNADO', price: 'R$ 33.900',
      photo: photo('9ea7323aa_01-honda-xr300l-tornado.jpeg'),
      photoFraming: { desktop: 72, mobile: 82, ground: 0.9 },
    },
    {
      brand: 'HONDA', model: 'CG 160 TITAN', price: 'R$ 18.900',
      photo: photo('0d3fa133a_02-honda-cg160-titan.jpeg'),
      photoFraming: { desktop: 72, mobile: 82, ground: 0.9 },
    },
    {
      brand: 'HONDA', model: 'PCX 150 SPORT', price: 'R$ 15.900',
      photo: photo('a9fbd3f28_03-honda-pcx150-sport.jpeg'),
      photoFraming: { desktop: 72, mobile: 82, ground: 0.9 },
    },
    {
      brand: 'HONDA', model: 'CB 300R', price: 'R$ 16.900',
      photo: photo('3ccbe4b8d_04-honda-cb300r.jpeg'),
      photoFraming: { desktop: 72, mobile: 82, ground: 0.9 },
    },
    {
      brand: 'HONDA', model: 'NXR 150 BROS', price: 'R$ 14.900',
      photo: photo('6a287fe7e_05-honda-nxr150-bros.jpeg'),
      photoFraming: { desktop: 72, mobile: 82, ground: 0.9 },
    },
    {
      brand: 'YAMAHA', model: 'FACTOR 150', price: 'R$ 15.900',
      photo: photo('a1947bd55_06-yamaha-factor150.jpeg'),
      photoFraming: { desktop: 72, mobile: 82, ground: 0.9 },
    },
    {
      brand: 'HONDA', model: 'CG 160 FAN', price: 'R$ 16.900',
      photo: photo('f73e6aa82_07-honda-cg160-fan.jpeg'),
      photoFraming: { desktop: 72, mobile: 82, ground: 0.9 },
    },
  ],
};
