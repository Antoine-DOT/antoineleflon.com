// "AL" monogram drawn as paths (no font dependency), crossed by a tilted
// orbit with a satellite. public/favicon.svg uses the same shapes, static.
const letterA = 'M9.9 26.5 L14.8 14.5 H17.5 L22.4 26.5 H19.5 L18.5 23.9 H13.8 L12.8 26.5 Z M14.7 21.5 H17.6 L16.15 17.6 Z';
const letterL = 'M23.4 14.5 H26.2 V24 H30.4 V26.5 H23.4 Z';
const orbit = 'M38 20 A18 7 0 1 1 2 20 A18 7 0 1 1 38 20';

export default function BrandMark() {
  return <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <g transform="rotate(-20 20 20)"><path d="M2 20 A18 7 0 0 1 38 20" fill="none" stroke="#f04a18" strokeOpacity=".55" strokeWidth="1.3" /></g>
    <path d={letterA} fill="currentColor" fillRule="evenodd" />
    <path d={letterL} fill="currentColor" />
    <g transform="rotate(-20 20 20)">
      <path d="M2 20 A18 7 0 0 0 38 20" fill="none" stroke="#f04a18" strokeWidth="1.4" />
      <circle className="brand-mark__satellite" r="2" fill="#ffc45b"><animateMotion dur="9s" repeatCount="indefinite" path={orbit} /></circle>
      <circle className="brand-mark__satellite-static" cx="35" cy="23.9" r="2" fill="#ffc45b" />
    </g>
  </svg>;
}
