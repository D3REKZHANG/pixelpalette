export function scaleRes(imageData, res){
    // convert imageData to 2d array of rgb tuples
    var pixelArr = unpack(imageData);
    
    const nHeight = parseInt(pixelArr.length*(res/100))
    const nWidth = parseInt(pixelArr[0].length*(res/100))
    
    const side = parseInt(pixelArr.length/nHeight)
    console.log(pixelArr.length,nHeight, side);
    var a=0;
    // scale res
    for(var r=0;r<nHeight;r++){
        for(var c=0;c<nWidth;c++){
            const pivot = pixelArr[r*side][c*side];
            for(var rr=0;rr<side;rr++){
                for(var cc=0;cc<side;cc++){
                    pixelArr[r*side+rr][c*side+cc] = pivot;
                }
            }
        }
    }
    console.log(a)

    // convert pixelArr back to single dimensional array
    pack(pixelArr,imageData);
    console.log("done");
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
