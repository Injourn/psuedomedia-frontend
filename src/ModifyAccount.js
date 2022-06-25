import React from "react";
import ApiClient from "./ApiClient";

class ModifyAccount extends React.Component{
    constructor(props){
        super (props);
        this.state = {id:'', displayName: '', username: '', password: '',error: false,errorMsg:''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        let apiClient = this.getApiClient();
        apiClient.account.getUserAccount().then(res => {
            this.setState({
                displayName: res.response.name,
                username: res.response.username,
                id : res.response.id
            });
        })
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

    handleSubmit(event){
        event.preventDefault();        
        let apiClient = this.getApiClient();
        apiClient.account.update({"Id":this.state.id,"Name":this.state.displayName,"Username":this.state.username,"Password":this.state.password}).then(res =>{
            console.log(res);
            if(!res.success){
                if(res.response){
                    this.setState({
                        error: true,
                        errorMsg: res.response
                    });
                }
            }
            else {
                if(res.response){
                    this.props.setTokens(res.response);
                }
                window.location = "/";
            }
        });
    }

    render(){
        return (
            <div className="my-auto account-card">
                <div className="col-md-6 col-12 card mx-auto">
                    <div className="card-header">
                        Create new Account
                    </div>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="displayName" className="form-label">Display name</label>
                                <input type="username" className="form-control" name="displayName" value={this.state.displayName} onChange={this.handleChange} id="displayName"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input disabled={true} type="username" className="form-control" name="username" value={this.state.username} id="username"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password (Keep blank for no change)</label>
                                <input type="password" className="form-control" name="password" onChange={this.handleChange} id="password"/>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModifyAccount;