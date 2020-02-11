import React, { Component } from 'react';
import axios from 'axios';
import Thumbnail from '../components/Thumbnail';
import Grid from '@material-ui/core/Grid';

class ThumbnailsListView extends Component {
    
    state = {
        items: []
    };

    fetchImages = () => {
        const taskID = this.props.match.params.taskID;
        axios.get('http://127.0.0.1:5000/images/'+ taskID).then(res => {
          this.setState({
            items: res.data,
            task: taskID
          });
        });
    }


    componentDidMount() {
        this.fetchImages();
    }
    
    render() {
        const { items, task } = this.state;
        return(
                <div >
                    <Grid  container spacing={10} style={{ margin: 100, width:'100%'}} >
                        {items.map(item => {
                            return <Thumbnail image={item} key={item.id} task={task} />;
                        })}
                    </Grid>
                </div>
    
           
        )
        
    }
    
}
export default ThumbnailsListView;






