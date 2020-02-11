import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import HomeView from './containers/HomeView';
import AboutView from './containers/AboutView';
import ThumbnailsListView from './containers/ThumbnailsListView';
import AnnotationView from './containers/AnnotationView';
import TaskView from './containers/TaskView';
class ContentRouter extends Component {
  render() {
    return (
        <BrowserRouter>
          <div>
                <Route exact path="/" component={HomeView}/>
                
                <Route exact path="/about" component={AboutView}/>
                <Route exact path="/tasks" component={TaskView}/>
                <Route exact path="/images/:taskID" component={ThumbnailsListView}/>
                <Route exact path="/images/:taskID/:imageID" component={AnnotationView}/>

          </div>
        </BrowserRouter>
    );
  }
}
export default ContentRouter;

/*
<Route exact path="/login" component={Login}/>
<Route exact path="/signup" component={Signup}/>
*/