export function scaleRes(imageData, res){
    // convert imageData to 2d array of rgb tuples
    var pixelArr = unpack(imageData);
    
    // scale res
    for(var r=0;r<pixelArr.length-4;r+=4){
        for(var c=0;c<pixelArr[0].length-4;c+=4){
            pixelArr[r][c] = [0,0,0];
        }
    }

    // convert pixelArr back to single dimensional array
    imageData.data.set(pack(pixelArr));
    return imageData;
}

function unpack(imageData){
    var pixelArr = []
    const w = imageData.width;
    const h = imageData.height;
    for(var i=0;i<h*4-4;i+=4){
        var row = []
        for(var j=0;j<w*4-4;j+=4){
            row.push([imageData.data[i%w], imageData.data[i*j+1], imageData.data[i*j+2]]);
        }
        pixelArr.push(row);
    }
    return pixelArr;
}

function pack(pixelArr){
    var data = new Uint8ClampedArray(pixelArr.length*pixelArr[0].length*4);
    for(var i=0;i<pixelArr.length;i+=1){
        for(var j=0;j<pixelArr[0].length;j+=1){
            data(pixelArr[i][j][0],pixelArr[i][j][1],pixelArr[i][j][2], 255);
        }
    }
    return data;
}
