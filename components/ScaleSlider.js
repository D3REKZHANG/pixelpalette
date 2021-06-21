import { Grid, Slider, Typography, IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings';

export default function ScaleSlider(props){
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item>
                <Typography> Scale </Typography>
            </Grid>
            <Grid item xs>
                <Slider
                    value={typeof props.scale === 'number' ? props.scale : 0}
                    onChange={(e, newval) => props.setScale(newval)}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    marks
                    defaultValue = {1} step = {1} min={1} max={10}
                />
            </Grid>
            <Grid item>
                <IconButton color="primary" onClick={props.handleClick}> <SettingsIcon /> </IconButton>
            </Grid>
        </Grid>
    );
}
