// Generate a random color that is not too similar to the used colors
export function getRandomColor(usedColors,differenceThreshold) {
    var letters = '0123456789ABCDEF';
    var color;

    do {
      color = '#';

      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }

    } while (isColorTooSimilar(color, usedColors,differenceThreshold) );

    return color;
}

// Check if the new color is too similar to any of the used colors
function isColorTooSimilar(color, usedColors,differenceThreshold) {
    for (var i = 0; i < usedColors.length; i++) {

      if (getColorDifference(color, usedColors[i]) < differenceThreshold) { 
        return true;
      }

    }

    return false;
}

function deltaE2000(lab1, lab2) {
    var l1 = lab1[0];
    var a1 = lab1[1];
    var b1 = lab1[2];
    var l2 = lab2[0];
    var a2 = lab2[1];
    var b2 = lab2[2];
  
    var kL = 1;
    var kC = 1;
    var kH = 1;
  
    var c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
    var c2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
    var cAvg = (c1 + c2) / 2;
  
    var G = 0.5 * (1 - Math.sqrt(Math.pow(cAvg, 7) / (Math.pow(cAvg, 7) + Math.pow(25, 7))));
  
    var a1p = (1 + G) * a1;
    var a2p = (1 + G) * a2;
  
    var c1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2));
    var c2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2));
  
    var h1p = (Math.atan2(b1, a1p) * 180) / Math.PI;
    if (h1p < 0) {
      h1p += 360;
    }
  
    var h2p = (Math.atan2(b2, a2p) * 180) / Math.PI;
    if (h2p < 0) {
      h2p += 360;
    }
  
    var deltaHp;
    if (c1p * c2p == 0) {
      deltaHp = 0;
    } else if (Math.abs(h2p - h1p) <= 180) {
      deltaHp = h2p - h1p;
    } else if (h2p - h1p > 180) {
      deltaHp = h2p - h1p - 360;
    } else {
      deltaHp = h2p - h1p + 360;
    }
  
    var deltaLp = l2 - l1;
    var deltaCp = c2p - c1p;
    var deltaHp = 2 * Math.sqrt(c1p * c2p) * Math.sin(deltaHp * Math.PI / 360);
  
    var deltaL = deltaLp;
    var deltaC = deltaCp;
    var deltaH = deltaHp;
    if (c1p * c2p == 0) {
      deltaH = 0;
    } else if (Math.abs(h2p - h1p) <= 180) {
      deltaH = deltaHp;
    } else if (h2p - h1p > 180) {
      deltaH = deltaHp - 360;
    } else {
      deltaH = deltaHp + 360;
    }

    var LpAvg = (l1 + l2) / 2;
    var CpAvg = (c1p + c2p) / 2;
  
    var hpAvg;
    if (c1p * c2p == 0) {
      hpAvg = h1p + h2p;
    } else if (Math.abs(h1p - h2p) <= 180) {
      hpAvg = (h1p + h2p) / 2;
    } else if (h1p + h2p < 360) {
      hpAvg = (h1p + h2p + 360) / 2;
    } else {
      hpAvg = (h1p + h2p - 360) / 2;
    }
  
    var T =
      1 -
      0.17 * Math.cos((hpAvg - 30) * Math.PI / 180) +
      0.24 * Math.cos(2 * hpAvg * Math.PI / 180) +
      0.32 * Math.cos((3 * hpAvg + 6) * Math.PI / 180) -
      0.20 * Math.cos((4 * hpAvg - 63) * Math.PI / 180);
  
    var SL = 1 + (0.015 * Math.pow(LpAvg - 50, 2)) / Math.sqrt(20 + Math.pow(LpAvg - 50, 2));
    var SC = 1 + 0.045 * CpAvg;
    var SH = 1 + 0.015 * CpAvg * T;
  
    var deltaTheta = 30 * Math.exp(-Math.pow((hpAvg - 275) / 25, 2));
    var RC = 2 * Math.sqrt(Math.pow(CpAvg, 7) / (Math.pow(CpAvg, 7) + Math.pow(25, 7)));
    var RT = -RC * Math.sin(2 * deltaTheta * Math.PI / 180);
  
    var deltaE2000 = Math.sqrt(
      Math.pow(deltaL / (kL * SL), 2) +
        Math.pow(deltaC / (kC * SC), 2) +
        Math.pow(deltaH / (kH * SH), 2) +
        RT * (deltaC / (kC * SC)) * (deltaH / (kH * SH))
    );
  
    return deltaE2000;
}

// Calculate the difference between two colors using the CIEDE2000 algorithm
function getColorDifference(color1, color2) {
    var lab1 = rgb2lab(hex2rgb(color1) );
    var lab2 = rgb2lab(hex2rgb(color2) );

    return deltaE2000(lab1,lab2);
}
  
// Convert a hexadecimal color code to an RGB array
function hex2rgb(hex) {
    var r = parseInt(hex.substring(1, 3), 16);
    var g = parseInt(hex.substring(3, 5), 16);
    var b = parseInt(hex.substring(5, 7), 16);
    return [r, g, b];
}
  
// Convert an RGB array to a Lab array
function rgb2lab(rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var x, y, z;
  
    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  
    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  
    var l = (116 * y) - 16;
    var a = 500 * (x - y);
    var b = 200 * (y - z);
  
    return [l, a, b];
}