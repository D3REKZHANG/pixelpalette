import { Grid, Card, CardContent, Typography} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    title: {
        fontSize: 14,
    },
});

export default function Palette(props){

    const classes = useStyles();
    
    return (
        <Card variant="outlined" style={{ minWidth: "100px", margin: "10px" }}>
            <CardContent style={{ padding: "5px" }}>
                <Grid container spacing={0} justify="center">
                    { props.palette.map((item, index)=>{
                        return (
                            <Grid item xs key={index}>
                                <div style={{ width: "100%", paddingBottom: "100%", background: item }} />
                            </Grid>
                        )   
                    }) }
                </Grid>
            </CardContent>
        </Card>
    )

}
