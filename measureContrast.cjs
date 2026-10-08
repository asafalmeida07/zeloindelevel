const luminance = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const contrast = (rgb1, rgb2) => {
  const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

const bg = [20, 40, 75]; // rgba(20, 40, 75)
const fg = [255, 255, 255]; // #ffffff

const ratio = contrast(bg, fg).toFixed(2);
console.log(`Contraste medido do Navbar: ${ratio}:1`);
if (ratio >= 4.5) {
  console.log('PASSOU (>= 4.5:1)');
} else {
  console.log('FALHOU (< 4.5:1)');
}
