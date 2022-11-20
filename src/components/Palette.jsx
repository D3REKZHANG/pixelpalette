import { Grid, Card, CardContent } from '@mui/material'

export default function Palette(props){
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
