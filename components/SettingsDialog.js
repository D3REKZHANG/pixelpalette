import { RadioGroup, Radio, DialogContent, DialogActions, DialogTitle, Dialog, Button, Grid, Typography, Select, MenuItem, FormControlLabel } from '@material-ui/core'

export default function SettingsDialog(props){

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
        >
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Typography color="textSecondary">Pixelation</Typography>
                </Grid>
                <Grid container spacing={2} alignItems="center" justify="space-between">
                    <Grid item>
                        <RadioGroup
                            row
                            value={props.scaleStyle}
                            onChange={props.handleChange}
                        >
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                value={0}
                                label="Sharp"
                                labelPlacement="left"
                            />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                value={1}
                                label="Soft"
                                labelPlacement="left"
                            />
                        </RadioGroup>
                    </Grid>
                </Grid>
                <Grid container>
                    <Typography color="textSecondary">Palette Matching</Typography>
                </Grid>
                <Grid container spacing={2} alignItems="center" justify="space-between">
                    <Grid item>
                        <RadioGroup
                            row
                            value={props.paletteStyle}
                            onChange={props.handleChange2}
                        >
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                value={0}
                                label="Contrast"
                                labelPlacement="left"
                            />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                value={1}
                                label="Vibrant"
                                labelPlacement="left"
                            />
                        </RadioGroup>
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
