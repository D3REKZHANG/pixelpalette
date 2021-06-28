import { DialogContent, DialogActions, DialogTitle, Dialog, TextField, Button, Grid, CircularProgress } from '@material-ui/core'
import { useState, useEffect, useRef } from 'react'

import LoadingOverlay from 'react-loading-overlay';
import Palette from "./Palette.js"

export default function PalettesDialog(props){

    const [ link, setLink ] = useState('');

    const [ palettes, setPalettes ] = useState([]);

    const handleClick = (palette) => {
        props.setPalette(palette);
    }

    const handleLinkChange = () => {
        if (!/^https:\/\/coolors\.co\/([0-9a-fA-F]{6}-)+[0-9a-fA-F]{6}$/.test(link)) return;

        console.log(linkToList(link));
        props.setPalette(linkToList(link));
    }

    const linkToList = (link) => {
        if (/^https:\/\/coolors\.co\/([0-9a-fA-F]{6}-)+[0-9a-fA-F]{6}$/.test(link)) {
            return link.split('/').slice(-1)[0].split('-').map((val) => '#' + val);
        } else {
            return [];
        }
    };

    useEffect(() => {
        // ON MOUNT
        const links = [
            "https://coolors.co/0a1128-001f54-034078-1282a2-fefcfb",
            "https://coolors.co/880d1e-dd2d4a-f26a8d-f49cbb-cbeef3",
            "https://coolors.co/e63946-f1faee-a8dadc-457b9d-1d3557",
            "https://coolors.co/22577a-38a3a5-57cc99-80ed99-c7f9cc",
            "https://coolors.co/d8e2dc-ffe5d9-ffcad4-f4acb7-9d8189",
            "https://coolors.co/003049-d62828-f77f00-fcbf49-eae2b7"
        ];

        const arr = [];
        links.forEach((link) => {
            arr.push(linkToList(link));
        })

        setPalettes(arr);
    }, []);


    return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={props.open}
            >
        <LoadingOverlay
            active={props.loading}
            spinner={<CircularProgress />}
            styles={{
                overlay: (base) => ({
                    ...base,
                    background: 'rgba(0, 0, 0, 0.3)'
                })
            }}
        >
                <DialogTitle>Palettes</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1} alignItems="center" justify="space-between">
                        {palettes.map((palette, i)=>{
                            return (
                                <Grid onClick={() => handleClick(palette)} key={i} item xs={6}>
                                    <Palette palette={palette} />
                                </Grid>
                            )
                        })}
                    </Grid>
                    <Grid container spacing={2} alignItems="center" justify="space-between">
                        <Grid item xs={10}>
                            <TextField
                                variant="outlined"
                                size="small"
                                id="link"
                                error={(link === '') ? false : !/^https:\/\/coolors\.co\/([0-9a-fA-F]{6}-)+[0-9a-fA-F]{6}$/.test(link)}
                                label="Coolors Link"
                                fullWidth
                                onChange={(e) => setLink(e.target.value)}
                                value={link}
                                style={{ margin: "10px" }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleLinkChange}
                            >
                                Go
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Grid item xs={6}>
                            <Palette palette={(link !== '') ? linkToList(link) : []} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Ok
                    </Button>
                </DialogActions>
        </LoadingOverlay>
            </Dialog>
    );
}
