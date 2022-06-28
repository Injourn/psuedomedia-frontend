import React from 'react';
import ApiClient from './ApiClient';
import ProfilePopover from './ProfilePopover';
import jwt from 'jwt-decode'

function ReplyBox(props){
    const [message,setMessage] = React.useState("");

    const handleSubmit = (event) => {        
        event.preventDefault();
        let options = {baseURL: process.env.REACT_APP_API_URL};
        let apiClient = new ApiClient(options);
        apiClient.setBearerAuthorization(props.tokens.jwtToken);
        apiClient.setHeader("pm-refreshToken",props.tokens.refreshToken);
        apiClient.feed.create({"PostText":message,"ParentPostId":props.parentId}).then(res => {
            window.location.reload();
        });
    }

    return (
        <form className="d-flex" onSubmit={handleSubmit}>
            <input className="form-control me-2" onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Send a reply" aria-label="reply"/>
            <button className="btn btn-outline-primary" type="submit">Reply</button>
        </form>
    );
}

class Status extends React.Component{
    constructor(props){
        super(props);
        this.state = {rating:this.props.data.rating, userRating:this.props.data.userRating,editMode:false,editMessage:this.props.data.message}
        if(this.props.tokens.jwtToken){
            const user = jwt(this.props.tokens.jwtToken);
            this.currentUsersPost = user.id === this.props.data.userCreatedById
        }

        this.upVote = this.upVote.bind(this);
        this.downVote = this.downVote.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggleEditMode(){
        this.setState({
            editMode: !this.state.editMode
        })
    }

    handleSubmit(event){
        event.preventDefault();
        let apiClient = this.getApiClient();
        apiClient.feed.update({"PostText":this.state.editMessage},this.props.data.id).then(res => {
            window.location.reload();
        });   
    }
    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        })
    }

    getApiClient(){
        let options = {baseURL: process.env.REACT_APP_API_URL};
        let apiClient = new ApiClient(options);
        apiClient.setBearerAuthorization(this.props.tokens.jwtToken);
        apiClient.setHeader("pm-refreshToken",this.props.tokens.refreshToken);
        return apiClient;
    }

    upVote(event){
        let apiClient = this.getApiClient();
        apiClient.feed.upvotePost(this.props.data.id).then(res => {
            this.setState({
                rating: res.response.rating
            });
        });
    }

    downVote(event){
        
        let apiClient = this.getApiClient();
        apiClient.feed.downvotePost(this.props.data.id).then(res => {
            this.setState({
                rating: res.response.rating
            });
        });
    }
    render(){   
        return (
            <div className='card text-start my-5'>
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <div className='p-2'>
                            <ProfilePopover userId={this.props.data.userCreatedById} displayName={this.props.data.userCreatedName} />
                        </div>
                        <div className="p-2">
                            {this.state.userRating > 0 ?
                                <i className="fa-solid fa-arrow-up m-0" onClick={this.upVote} style={{color:'mediumspringgreen'}}></i> :
                                <i className="fa-solid fa-arrow-up m-0" onClick={this.upVote} ></i> }
                            &nbsp;
                            {this.state.userRating < 0 ?
                                <i className="fa-solid fa-arrow-down m-0" onClick={this.downVote} style={{color:'red'}}></i> :
                                <i className="fa-solid fa-arrow-down m-0" onClick={this.downVote} ></i> }
                            &nbsp;
                            <b>{this.state.rating}</b>
                        </div>
                    </div>
                    
                </div>
                
                <ul className='list-group list-group-flush'>
                    {this.state.editMode ? 
                        <li className='list-group-item'>
                            <div className='card my-5'>
                                <div className="card-body">
                                    <form onSubmit={this.handleSubmit} className="d-flex">
                                        <input className="form-control me-2" type="text" placeholder="Something on your mind?" value={this.state.editMessage} name="editMessage" onChange={this.handleChange}/>
                                        <button className="btn btn-outline-danger" type="reset" onClick={this.toggleEditMode}>Cancel</button>
                                        <button className="btn btn-outline-success" type="submit">Modify Status</button>
                                    </form>
                                </div>
                            </div>
                        </li>
                        :
                        <li className='list-group-item'>
                            <div className="d-flex justify-content-between">
                                <div className="date p-2">
                                    {new Date(this.props.data.createdDate).toDateString()}
                                </div>
                                <div classNAme="p-2">
                                {   
                                    this.currentUsersPost && 
                                    <b onClick={this.toggleEditMode}>Edit</b>
                                }
                                </div>
                            </div>
                            {this.props.data.message}
                        </li>
                    }
                    {
                    this.props.data.replies.map((stats,id)=>{
                        return (
                            <li className='list-group-item'>
                                <div className="card-body">
                                    <b>{stats.userCreatedName}:</b> {stats.message}
                                </div>
                            </li>
                        )
                    })
                    }
                    { this.props.displayInput &&
                    <li className='list-group-item'>
                        <div className="card-body">
                                <ReplyBox {...this.props} parentId={this.props.data.id}/>
                        </div>
                    </li>
                    }
                </ul>
            </div>
        );
    }
}

export default Status;