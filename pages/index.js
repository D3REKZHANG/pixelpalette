import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useRef } from 'react'
import { Button } from '@material-ui/core'

export default function Home() {

    const [img, setImg] = useState();
    const canvas = useRef(null);

    const uploadHandler = (event) =>{
        setImg(URL.createObjectURL(event.target.files[0]));
    }

    useEffect(()=>{
        const ctx = canvas.current.getContext();
    },[img]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Pixel Palette</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>P I X E L P A L E T T E </h1>

            <input type="file" id="upload"  onChange={uploadHandler} style={{display:"none"}}/>
            <Button color="primary"> <label for="upload">Select file</label> </Button>
            <img src={img} width="500"/>
            <canvas id="display" width="200" height="100" style={{border:"1px solid #000000"}} ref={canvas}></canvas>
        </div>
    )
}
