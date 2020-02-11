import React from 'react';
import { Card } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';
import BackgroundCanvas from "./BackgroundCanvas";
import ColorCanvas from "./ColorCanvas";
import OutlineCanvas from "./OutlineCanvas";

class Canvas extends React.Component {
    render = () => {
        const {image, size, mask, boundaries, annColor, outColor } = this.props;
        return <div id="canvases_div" className="overflow-auto" style={{ position:'relative', width:'100%', minHeight:'300px'}}>
                <BackgroundCanvas image={image} size={size} />
                <ColorCanvas size={size} mask={mask} boundaries={boundaries} color={annColor}/>
                <OutlineCanvas size={size} boundaries={boundaries} color={outColor} />
        </div>;
    }
}
export default Canvas;