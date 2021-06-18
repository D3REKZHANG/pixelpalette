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
                        if(r+rr < h && c+cc < w){
                            red += pixelArr[r+rr][c+cc][0];
                            blue += pixelArr[r+rr][c+cc][1];
                            green += pixelArr[r+rr][c+cc][2];
                            cnt++;
                        }
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

function fastAverage(pixels, scale, w, h){
    // Replaces all pixels within a block with top left pixel
    var pixelArr = pixels;
    for(var r=0;r<h;r+=scale){
        for(var c=0;c<w;c+=scale){
            let cnt = 0, red = 0, green = 0, blue = 0;
            const pivot = [0,0,0];

            if(scale%2 == 1){
                pivot = pixelArr[r+scale/2][c+scale/2]
            } else {
                for(var rr=scale/2-1;rr<=scale/2;rr++){
                    for(var cc=scale/2-1;cc<=scale/2;cc++){
                        if(r+rr < h && c+cc < w){
                            red += pixelArr[r+rr][c+cc][0];
                            blue += pixelArr[r+rr][c+cc][1];
                            green += pixelArr[r+rr][c+cc][2];
                            cnt++;
                        }
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
