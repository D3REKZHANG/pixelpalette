export function scaleRes(imageData, res){
    // convert imageData to 2d array of rgb tuples
    var pixelArr = unpack(imageData);
    
    // scale res
    for(var r=0;r<pixelArr.length;r+=1){
        for(var c=0;c<pixelArr[0].length;c+=1){
            pixelArr[r][c] = [255,255,0];
        }
    }

    // convert pixelArr back to single dimensional array
    pack(pixelArr,imageData);
    return imageData;
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

function pack(pixelArr,imageData){
    var w = imageData.width;
    for(var i=0;i<pixelArr.length;i+=1){
        for(var j=0;j<pixelArr[0].length;j+=1){
            var base = (i*w+j)*4
            imageData.data[base] = pixelArr[i][j][0]
            imageData.data[base+1] = pixelArr[i][j][1]
            imageData.data[base+2] = pixelArr[i][j][2]
            imageData.data[base+3] = 255;
        }
    }
}
