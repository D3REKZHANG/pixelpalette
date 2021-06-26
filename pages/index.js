import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'
import { CircularProgress, Button, Grid,} from '@material-ui/core'
import LoadingOverlay from 'react-loading-overlay';

import { scalePixels } from "../processing.js";

import Palette from "../components/Palette.js"
import SettingsDialog from "../components/SettingsDialog.js"
import PalettesDialog from "../components/PalettesDialog.js"
import ScaleSlider from "../components/ScaleSlider.js"

export default function Home() {

    // STATES AND REFS
    const [image, setImage] = useState(null);
    const [cache, setCache] = useState([]);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [palettesOpen, setPalettesOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // options
    const [scaleStyle, setScaleStyle] = useState(0);
    const [scale, setScale] = useState(1);

    const canvas = useRef(null);

    // EVENT HANDLERS

    const handleUpload = (e) => {
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
        if(e.target.files.length > 0){
            setLoading(true);
            reader.readAsDataURL(e.target.files[0])
        }
    };

    const handleStyleChange = (e) => setScaleStyle(e.target.value);

    // USE EFFECT HOOKS
    useEffect(()=>{
        if(image === null) return;
        const ctx = canvas.current.getContext('2d');
        ctx.drawImage(image,0,0,500,image.height*(500/image.width));
        const imgData = ctx.getImageData(0,0,500,image.height*(500/image.width));

        // cache
        const arr = [[0], [0]];
        for (var i=1;i<=10;i++) {
            arr[0].push(scalePixels(ctx, imgData, i, "block"));
            arr[1].push(scalePixels(ctx, imgData, i, "average"));
        }
        setLoading(false);
        setScale(1);
        setCache(arr);
    },[image]);

    useEffect(()=>{
        if(image === null) return;
        const ctx = canvas.current.getContext('2d');
        ctx.putImageData(cache[scaleStyle][scale],0,0);
    },[scale, scaleStyle]);


    return (
        <div className={styles.container} style={{ background: "#fafbff" }}>
            <Head>
                <title>Pixel Palette</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>P I X E L P A L E T T E </h1>
            <input type="file" id="upload" accept="image/*"onChange={handleUpload} style={{display:"none"}}/>
            <Button variant="outlined" color="primary" style={{ margin: "10px" }}> <label for="upload">Select file</label> </Button>
            <LoadingOverlay
                active={loading}
                spinner={<CircularProgress />}
                styles={{
                    wrapper: (base) => ({
                        ...base,
                        margin: '10px'
                    }),
                    overlay: (base) => ({
                        ...base,
                        background: 'rgba(0, 0, 0, 0.3)'
                    })
                }}
            >
                <canvas id="display" width={(image===null)?0:500} height={(image === null)?0:image.height*(500/image.width)} style={{border:((image==null)?0:1)+"px solid #000000"}} ref={canvas}></canvas>
            </LoadingOverlay>

            <div style={{visibility:(image===null)?"hidden":"visible", width:"350px", margin:"0px 30px"}}>
                <ScaleSlider scale={scale} setScale={setScale} handleClick={() => setSettings(true)}/>
                <PalettesDialog open={palettesOpen} handleClose={() => setPalettesOpen(false)}/>
                <Grid container spacing={2} alignItems="center" justify="center">
                    <Grid item>
                        <Button variant="outlined" color="primary" onClick={() => setPalettesOpen(true)}>Choose Palette</Button>
                    </Grid>
                </Grid>
            </div>
            <SettingsDialog open={settingsOpen} scaleStyle={scaleStyle} handleChange={(e) => setScaleStyle(e.target.value)} handleClose={() => setSettingsOpen(false)}/>
            } handleClose={() => setSettingsOpen(false)}/>
        </div>
    )
}
