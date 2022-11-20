import { RadioGroup, Radio, DialogContent, DialogActions, DialogTitle, Dialog, Button, Grid, Typography, FormControlLabel } from '@mui/material';

const SettingsDialog = ({open, scaleStyle, paletteStyle, handleChange, handleChange2, handleClose}) => {

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
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
              value={scaleStyle}
              onChange={handleChange}
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
              value={paletteStyle}
              onChange={handleChange2}
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
        <Button onClick={handleClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog;
