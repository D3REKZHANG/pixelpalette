export function scalePixels(ctx, imageData, scale, style){
    // convert imageData to 2d array of rgb tuples
    var pixelArr = unpack(imageData);

    var result;
    let w = imageData.width, h = imageData.height;
    switch(style){
        case "block": result = block(pixelArr, scale, w, h); break;
        case "average": result = average(pixelArr, scale, w, h); break;
    }

    // convert pixelArr back to single dimensional array
    return pack(ctx, result, w, h);
}

export function scalePixelsAll(ctx, imageData, style) {
    // convert imageData to 2d array of rgb tuples
    // var pixelArr = unpack(imageData);

    let w = imageData.width, h = imageData.height;
    const scale = (pA, sc, w, h) => {
      return (style==="block") ? block(unpack(pA), sc, w, h) : average(unpack(pA), sc, w, h);
    }
    const r_2x2 = scale(imageData, 2, w, h);
    const r_3x3 = scale(imageData, 3, w, h);
    const r_5x5 = scale(imageData, 5, w, h);
    const r_7x7 = scale(imageData, 7, w, h);

    const opt_scale = (pA, sc, w, h) => {
      return (style==="block") ? block(copy(pA), sc, w, h) : average(copy(pA), sc, w, h);
    }
    const r_4x4 = opt_scale(r_2x2, 2, w, h, 2);
    const r_8x8 = opt_scale(r_4x4, 2, w, h, 2);
    const r_6x6 = opt_scale(r_3x3, 2, w, h, 2);
    const r_9x9 = opt_scale(r_3x3, 3, w, h, 3);
    const r_10x10 = opt_scale(r_5x5, 2, w, h, 2);

    // convert pixelArr back to single dimensional array
    return [r_2x2, r_3x3, r_4x4, r_5x5, r_6x6, r_7x7, r_8x8, r_9x9, r_10x10].map((result)=> pack(ctx, result, w, h));
}

function block(pixels, scale, w, h, mult=1){
    // Replaces all pixels within a block with center pixel
    var pixelArr = pixels;
    for(var r=0;r<h;r+=scale){
        for(var c=0;c<w;c+=scale){
            let cnt = 0, red = 0, green = 0, blue = 0;
            let pivot = [0,0,0];
            const half = parseInt((scale*mult)/2, 10);

            if((scale*mult)%2 == 1){
                pivot = pixelArr[Math.min(r+half, h-1)][Math.min(c+half, w-1)]
            } else {
                for(var rr=half-1;rr<=half;rr++){
                    for(var cc=half-1;cc<=half;cc++){
                        const pixel = pixelArr[Math.min(r+rr, h-1)][Math.min(c+cc, w-1)]
                        red += pixel[0];
                        blue += pixel[1];
                        green += pixel[2];
                        cnt++;
                    }
                }
                pivot = [red/cnt, blue/cnt, green/cnt];
            }

            for(var rr=0;rr<scale;rr++){
                for(var cc=0;cc<scale;cc++){
                    if(r+rr < h && c+cc < w){
                        pixelArr[r+rr][c+cc][0] = pivot[0];
                        pixelArr[r+rr][c+cc][1] = pivot[1];
                        pixelArr[r+rr][c+cc][2] = pivot[2];
                    }
                }
            }
        }
    }
    return pixels;
}

function average(pixels, scale, w, h, mult=1){
    var pixelArr = pixels;
    for(var r=0;r<h;r+=scale){
        for(var c=0;c<w;c+=scale){
            let cnt=0, red = 0, green = 0, blue = 0;
            for(var rr=0;rr<scale*mult;rr+=mult){
                for(var cc=0;cc<scale*mult;cc+=mult){
                    if(r+rr < h && c+cc < w){
                        red += pixelArr[r+rr][c+cc][0];
                        blue += pixelArr[r+rr][c+cc][1];
                        green += pixelArr[r+rr][c+cc][2];
                        cnt++;
                    }
                }
            }
            const colour = [red/cnt, blue/cnt, green/cnt, 255];
            for(var rr=0;rr<scale*mult;rr++){
                for(var cc=0;cc<scale*mult;cc++){
                    if(r+rr < h && c+cc < w){
                        pixelArr[r+rr][c+cc] = colour;
                    }
                }
            }
        }
    }
    return pixels;
}

export function colourMatch(ctx, imageData, palette, type='true'){
    // convert imageData to 2d array of rgb tuples
    var pixelArr = unpack(imageData);
    var palette = palette.map((colour) => rgb(colour));
    const sortedPalette = sortGrayscale(palette);

    const w = imageData.width, h = imageData.height;

    for(var r=0;r<h;r++){
        for(var c=0;c<w;c++){
            const pixel = pixelArr[r][c];
            
            let bestMatch = null;

            bestMatch = palette[0];

            if(type === 'difference'){
                bestMatch = palette[0];
                let bestDist = distance(palette[0], pixel);

                palette.forEach((colour) => {
                    const dist = distance(colour, pixel);
                    if(dist < bestDist){
                        bestDist = dist;
                        bestMatch = colour;
                    }
                });
            }else if(type === 'projection'){
                const grayed = grayscale(pixelArr[r][c]);
                bestMatch = sortedPalette[parseInt((Math.min((grayed[0]/255), 0.99)*sortedPalette.length), 10)];
            }

            // cache and set
            pixelArr[r][c] = bestMatch;
        }
    }
    // convert pixelArr back to single dimensional array
    return pack(ctx, pixelArr, w, h);
}

export function convertGrayscale(ctx, imageData){
    // convert imageData to 2d array of rgb tuples
    var pixelArr = unpack(imageData);

    const w = imageData.width, h = imageData.height;

    for(var r=0;r<h;r++){
        for(var c=0;c<w;c++){
            pixelArr[r][c] = grayscale(pixelArr[r][c]);
        }
    }
    // convert pixelArr back to single dimensional array
    return pack(ctx, pixelArr, w, h);
}


// HELPER FUNCTIONS

function distance(c1,c2){
    return (c2[0] - c1[0])**2 + (c2[1] - c1[1])**2 + (c2[2] - c1[2])**2;
}

function rgb(hex){
    return [parseInt(hex.slice(1,3), 16), parseInt(hex.slice(3,5), 16), parseInt(hex.slice(5,7), 16)];
}

function hex(rgb){
    return '#'+Math.round(rgb[0]).toString(16)+Math.round(rgb[1]).toString(16)+Math.round(rgb[2]).toString(16);
}

function grayscale(rgb, weighted = true){
    const avg = (weighted) ? 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2] : (rgb[0] + rgb[1] + rgb[2])/3;

    return [avg, avg, avg];
}

function sortGrayscale(palette){
    const toSort = palette.map((colour) => ({og: colour, grey: grayscale(colour)}));

    const sorted = toSort.sort((a,b) => (a.grey[0] > b.grey[0]) ? 1 : -1);

    return sorted.map((obj) => obj.og);
}

function copy(arr) {
    var pixelArr = [];
    for(var i=0;i<arr.length;i++){
        var row = []
        for(var j=0;j<arr[i].length;j++){
            row.push([...arr[i][j]]);
        }
        pixelArr.push(row);
    }
    return pixelArr;
}

function equals(a, b) {
  for(let i=0;i<a.length;i++){
    for(let j=0;j<a[0].length; j++){
      const aa = a[i][j];
      const bb = b[i][j];
      if(aa[0] !== bb[0] || aa[1] !== bb[1] || aa[2] !== bb[2]){
        return false;
      }
    }
  }
  return true;
}

function unpack(imageData){
    var pixelArr = []
    const w = imageData.width;
    const h = imageData.height;
    for(var i=0;i<h;i+=1){
        var row = []
        for(var j=0;j<w;j+=1){
            var base = (i*w+j)*4
            row.push([imageData.data[base], imageData.data[base+1], imageData.data[base+2]]);
        }
        pixelArr.push(row);
    }
    return pixelArr;
}

function pack(ctx, pixelArr, w, h){
    const temp = ctx.createImageData(w, h);
    for(var i=0;i<pixelArr.length;i++){
        for(var j=0;j<pixelArr[0].length;j++){
            const base = (i*w+j)*4
            temp.data[base] = pixelArr[i][j][0]
            temp.data[base+1] = pixelArr[i][j][1]
            temp.data[base+2] = pixelArr[i][j][2]
            temp.data[base+3] = 255;
        }
    }
    return temp;
}
