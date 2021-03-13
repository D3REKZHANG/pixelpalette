import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState} from 'react'

export default function Home() {

    const [img, setImg] = useState();

    const uploadHandler = (event) =>{
        setImg(URL.createObjectURL(event.target.files[0]));
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Pixel Palette</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>P I X E L P A L E T T E </h1>

            <input type="file" id="upload"  onChange={uploadHandler} style={{display:"none"}}/>
            <button> <label for="upload">Select file</label> </button>
            <img src={img} width="500"/>
        </div>
    )
}
