import styles from './Home.module.css';
import { useState, useRef, useEffect } from 'react';
import { Button, Grid,} from '@mui/material';

import { scalePixels, colourMatch } from "../../processing.js";

import Canvas from "../components/Canvas";
import Palette from "../components/Palette";
import SettingsDialog from "../components/SettingsDialog";
import PalettesDialog from "../components/PalettesDialog";
import ScaleSlider from "../components/ScaleSlider";

const Home = () => {

  // STATES AND REFS
  const [image, setImage] = useState(null);
  const [cache, setCache] = useState([]);
  const [colourCache, setColourCache] = useState([]);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [palettesOpen, setPalettesOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // options
  const [scaleStyle, setScaleStyle] = useState(0);
  const [scale, setScale] = useState(1);
  const [palette, setPalette] = useState([]);
  const [paletteStyle, setPaletteStyle] = useState(0);

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

  // USE EFFECT HOOKS
  useEffect(() => {
    if (image === null) return;
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
    setPalette([]);
    setCache(arr);
  }, [image]);

  useEffect(() => {
    if (image === null) return;
    const ctx = canvas.current.getContext('2d');
    if (palette.length === 0)
    ctx.putImageData(cache[scaleStyle][scale], 0, 0);
    else
    ctx.putImageData(colourCache[scaleStyle][paletteStyle][scale], 0, 0);
  },[scale, scaleStyle, paletteStyle]);

  // other functions

  const changePalette = async (palette) => {
    const ctx = canvas.current.getContext('2d');
    setLoading(true);
    const process = async () => {
      const arr = [[[0], [0]], [[0], [0]]];
      for (var i=1;i<=10;i++) {
        arr[0][0].push(colourMatch(ctx, cache[0][i], palette, 'difference'));
        arr[1][0].push(colourMatch(ctx, cache[1][i], palette, 'difference'));
        arr[0][1].push(colourMatch(ctx, cache[0][i], palette, 'projection'));
        arr[1][1].push(colourMatch(ctx, cache[1][i], palette, 'projection'));
      }
      ctx.putImageData(arr[scaleStyle][paletteStyle][scale], 0, 0);
      setPalette(palette);
      setLoading(false);
      setColourCache(arr);
    }
    process();
  }

  return (
    <div className={styles.container} style={{ background: "#fafbff" }}>

      <h1>P I X E L P A L E T T E </h1>
      <input type="file" id="upload" accept="image/*"onChange={handleUpload} style={{display:"none"}} />
      <Button variant="outlined" color="primary" style={{ margin: "10px" }}> <label for="upload">Select file</label> </Button>

      <Canvas canvasRef={canvas} loading={loading} image={image} />

      {image &&
        <div style={{width:"350px", margin:"0px 30px"}}>
          <ScaleSlider scale={scale} setScale={setScale} handleClick={() => setSettingsOpen(true)} />
          <PalettesDialog open={palettesOpen} loading={loading} setLoading={setLoading} changePalette={changePalette} handleClose={() => setPalettesOpen(false)} />
          <Palette palette={palette} />
          <Grid container spacing={2} alignItems="center" justify="center">
            <Grid item>
              <Button variant="outlined" color="primary" onClick={() => setPalettesOpen(true)}>Choose Palette</Button>
            </Grid>
          </Grid>
        </div>
      }
      <SettingsDialog
        open={settingsOpen}
        scaleStyle={scaleStyle}
        handleChange={(e) => setScaleStyle(parseInt(e.target.value, 10))}
        paletteStyle={paletteStyle}
        handleChange2={(e) => setPaletteStyle(parseInt(e.target.value, 10))}
        handleClose={() => setSettingsOpen(false)}
        />
    </div>
  )
}

export default Home;
