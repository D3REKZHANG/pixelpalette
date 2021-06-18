export function scaleRes(ctx, imageData, scale){
    // convert imageData to 2d array of rgb tuples
    var pixelArr = unpack(imageData);
    
    // scale res
    for(var r=0;r<imageData.height;r+=scale){
        for(var c=0;c<imageData.width;c+=scale){
            const pivot = pixelArr[r][c];
            for(var rr=0;rr<scale;rr++){
                for(var cc=0;cc<scale;cc++){
                    if(r+rr < imageData.height && c+cc < imageData.width)
                        pixelArr[r+rr][c+cc] = pivot;
                }
            }
        }
    }

    // convert pixelArr back to single dimensional array
    return pack(ctx, pixelArr,imageData);
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
