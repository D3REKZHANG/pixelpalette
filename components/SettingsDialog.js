import { DialogContent, DialogActions, DialogTitle, Dialog, Button, Grid, Typography, Select, MenuItem } from '@material-ui/core'

export default function SettingsDialog(props){

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={props.open}
        >
            <DialogTitle>Choose A Palette</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="center" justify="space-between">
                    <Grid item>
                        <Typography>Style</Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            value={props.scaleStyle}
                            onChange={props.handleChange}
                        > 
                            <MenuItem value={0}>Sharp</MenuItem>
                            <MenuItem value={1}>Soft</MenuItem>
                        </Select>
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
