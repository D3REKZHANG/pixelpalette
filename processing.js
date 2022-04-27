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
    return pack(ctx, result, imageData);
}

function block(pixels, scale, w, h){
    // Replaces all pixels within a block with top left pixel
    var pixelArr = pixels;
    for(var r=0;r<h;r+=scale){
        for(var c=0;c<w;c+=scale){
            let cnt = 0, red = 0, green = 0, blue = 0;
            const pivot = [0,0,0];
            const half = parseInt(scale/2, 10);

            if(scale%2 == 1){
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

function average(pixels, scale, w, h){
    // Replaces all pixels within a block with top left pixel
    var pixelArr = pixels;
    for(var r=0;r<h;r+=scale){
        for(var c=0;c<w;c+=scale){
            let cnt = 0, red = 0, green = 0, blue = 0;
            for(var rr=0;rr<scale;rr++){
                for(var cc=0;cc<scale;cc++){
                    if(r+rr < h && c+cc < w){
                        red += pixelArr[r+rr][c+cc][0];
                        blue += pixelArr[r+rr][c+cc][1];
                        green += pixelArr[r+rr][c+cc][2];
                        cnt++;
                    }
                }
            }
            for(var rr=0;rr<scale;rr++){
                for(var cc=0;cc<scale;cc++){
                    if(r+rr < h && c+cc < w){
                        pixelArr[r+rr][c+cc][0] = red/cnt;
                        pixelArr[r+rr][c+cc][1] = blue/cnt;
                        pixelArr[r+rr][c+cc][2] = green/cnt;
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

    let diff = 0;
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
                bestMatch = sortedPalette[parseInt((grayed[0]/255)*(sortedPalette.length), 10)];
            }

            // cache and set
            pixelArr[r][c] = bestMatch;
        }
    }
    //console.log(diff);
    // convert pixelArr back to single dimensional array
    return pack(ctx, pixelArr, imageData);
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
    return pack(ctx, pixelArr, imageData);
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

function pack(ctx, pixelArr,imageData){
    const temp = ctx.createImageData(imageData.width, imageData.height);
    var w = imageData.width;
    for(var i=0;i<pixelArr.length;i+=1){
        for(var j=0;j<pixelArr[0].length;j+=1){
            var base = (i*w+j)*4
            temp.data[base] = pixelArr[i][j][0]
            temp.data[base+1] = pixelArr[i][j][1]
            temp.data[base+2] = pixelArr[i][j][2]
            temp.data[base+3] = 255;
        }
    }
    return temp;
}
