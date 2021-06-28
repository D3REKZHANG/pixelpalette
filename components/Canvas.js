import { CircularProgress } from '@material-ui/core'
import LoadingOverlay from 'react-loading-overlay';

export default function Canvas(props){

    return (
        <LoadingOverlay
            active={props.loading}
            spinner={<CircularProgress />}
            styles={{
                wrapper: (base) => ({
                    ...base,
                    margin: '10px'
                }),
                overlay: (base) => ({
                    ...base,
                    background: 'rgba(0, 0, 0, 0.3)'
                })
            }}
        >
            <canvas
                id="display"
                width={(props.image === null) ? 0 : 500}
                height={(props.image === null) ? 0 : props.image.height*(500/props.image.width)}
                style={{border:((props.image === null) ? 0 : 1) + "px solid #000000"}}
                ref={props.canvasRef}
            />
        </LoadingOverlay>
    );
}
