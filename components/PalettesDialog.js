import { DialogContent, DialogActions, DialogTitle, Dialog, TextField, Button, Grid, Typography } from '@material-ui/core'
import { useState } from 'react'

import Palette from "./Palette.js"

export default function PalettesDialog(props){

    const [ link, setLink ] = useState('https://coolors.co/ffffff-ffffff-ffffff-ffffff-ffffff');

    const handleLinkChange = (e) => setLink(e.target.value);

    const linkToList = (link) => {
        return link.split('/').slice(-1)[0].split('-').slice(-5).map((val) => '#' + val);
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
        >
            <DialogTitle>Palettes</DialogTitle>
            <DialogContent>
                <Grid container spacing={1} alignItems="center" justify="space-between">
                    {props.palettes.map((palette, i)=>{
                        return (
                            <Grid item xs="6">
                                <Palette key={i} palette={palette} />
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid container spacing={1} alignItems="center" justify="space-between">
                    <Grid item xs="10">
                        <TextField
                            variant="outlined"
                            size="small"
                            id="link"
                            label="Coolors Link"
                            fullWidth
                            onChange={handleLinkChange}
                            value={link}
                            style={{ margin: "10px" }}
                        />
                    </Grid>
                </Grid>
                <Grid>
                    <Grid item xs="6">
                        <Palette palette={(link !== '') ? linkToList(link) : []} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
