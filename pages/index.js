import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'
import { Button, Slider, Grid, Input } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';

import { scaleRes } from "../processing.js";

export default function Home() {

    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState(null);

    // options
    const [res, setRes] = useState(100);

    const canvas = useRef(null);

    const uploadHandler = (e) =>{
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2){
                const img = new Image;
                img.src = reader.result;
                img.onload = () =>{
                    setImage(img);
                }
            }
        }
        reader.readAsDataURL(e.target.files[0])
    };

    useEffect(()=>{
        if(image === null) return;

        const ctx = canvas.current.getContext('2d');
        ctx.drawImage(image,0,0,500,image.height*(500/image.width));
        const imgData = ctx.getImageData(0,0,500,image.height*(500/image.width));
        setImageData(imgData);
        scaleRes(imgData);
    },[image]);

    useEffect(()=>{
        if(image == null) return;
        const ctx = canvas.current.getContext('2d');
        ctx.putImageData(scaleRes(imageData, res),0,0);
    },[res]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Pixel Palette</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>P I X E L P A L E T T E </h1>
            <input type="file" id="upload" accept="image/*"onChange={uploadHandler} style={{display:"none"}}/>
            <Button color="primary"> <label for="upload">Select file</label> </Button>
            <canvas id="display" width={(image===null)?0:500} height={(image === null)?0:image.height*(500/image.width)} style={{border:((image==null)?0:1)+"px solid #000000"}} ref={canvas}></canvas>

            <div style={{visibility:(image===null)?"hidden":"visible", width:"350px", margin:"30px"}}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography> Resolution </Typography>
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={typeof res === 'number' ? res : 0}
                            onChange={(e, newval) => setRes(newval)}
                            aria-labelledby="input-slider"
                            defaultValue = {100} step = {1} min={1} max={100}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            style={{width: 30}}
                            value={res}
                            margin="dense"
                            onChange={(e)=>setRes(e.target.value === '' ? '' : Number(e.target.value.slice(0,-1)))}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
