import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'
import { CircularProgress, Box, DialogContent, DialogActions, DialogTitle, Dialog, IconButton, MenuItem, Select, Button, Slider, Grid, Input } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import LoadingOverlay from 'react-loading-overlay';

import { scalePixels } from "../processing.js";

export default function Home() {

    // STATES AND REFS
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [cache, setCache] = useState([]);

    const [settingsOpen, setSettingsOpen] = useState(false);
    var loading = false;

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
        reader.readAsDataURL(e.target.files[0])
    };

    const handleStyleChange = (e) => setScaleStyle(e.target.value);

    const handleSettingsClick = (e) => setSettingsOpen(true);
    const handleSettingsClose = (e) => setSettingsOpen(false);


    // USE EFFECT HOOKS
    
    useEffect(()=>{
        if(image === null) return;
        const ctx = canvas.current.getContext('2d');
        ctx.drawImage(image,0,0,500,image.height*(500/image.width));
        const imgData = ctx.getImageData(0,0,500,image.height*(500/image.width));
        setImageData(imgData);

        loading = true;
        // cache 
        const arr = [[0], [0]];
        for (var i=1;i<=10;i++) {
            arr[0].push(scalePixels(ctx, imgData, i, "block"));
            arr[1].push(scalePixels(ctx, imgData, i, "average"));
        }
        loading = false;
        setCache(arr);
    },[image]);

    useEffect(()=>{
        if(image === null) return;
        const ctx = canvas.current.getContext('2d');
        ctx.putImageData(cache[scaleStyle][scale],0,0);
    },[scale, scaleStyle]);

    
    const cacheData = (imgData, style) => {
        const ctx = canvas.current.getContext('2d');
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Pixel Palette</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>P I X E L P A L E T T E </h1>
            <input type="file" id="upload" accept="image/*"onChange={handleUpload} style={{display:"none"}}/>
            <Button color="primary"> <label for="upload">Select file</label> </Button>
            <LoadingOverlay
                active={loading}
                spinner={<CircularProgress />}
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: 'rgba(0, 0, 0, 0.3)'
                    })
                }}
            >
                <canvas id="display" width={(image===null)?0:500} height={(image === null)?0:image.height*(500/image.width)} style={{border:((image==null)?0:1)+"px solid #000000"}} ref={canvas}></canvas>
            </LoadingOverlay>

            <div style={{visibility:(image===null)?"hidden":"visible", width:"350px", margin:"30px"}}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography> Scale </Typography>
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={typeof scale === 'number' ? scale : 0}
                            onChange={(e, newval) => setScale(newval)}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            marks
                            defaultValue = {1} step = {1} min={1} max={10}
                        />
                    </Grid>
                    <Grid item>
                        <IconButton color="primary" onClick={handleSettingsClick}> <SettingsIcon /> </IconButton>
                    </Grid>
                </Grid>
            </div>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={settingsOpen}
            >
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography>Style</Typography>
                        </Grid>
                        <Grid item>
                            <Select
                                value={scaleStyle}
                                onChange={handleStyleChange}
                            > 
                                <MenuItem value={0}>Sharp</MenuItem>
                                <MenuItem value={1}>Soft</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSettingsClose} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
