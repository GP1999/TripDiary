import React from 'react';
import './Admin.css';
class Itemcards extends React.Component {
    constructor(props) {
        super(props);
        this.handleReject=this.handleReject.bind(this);
        this.handeAccept=this.handeAccept.bind(this);

    }
    handeAccept(event){
        event.preventDefault();
        let doc=this;
        let data={email:this.props.User,ItemName:this.props.ItemName};
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch('/accept',requestOptions)
        .then(function(res){
            if(res.status===200)
            {
                console.log("Accepted success fully");
               let med= doc.props.reload();
               console.log(med);
            }

        })

    }
    handleReject(event){
        event.preventDefault();
        let doc=this;
        let data={email:this.props.User,ItemName:this.props.ItemName};
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch('/reject',requestOptions)
        .then(function(res){
            if(res.status===200)
            {
                console.log("Rejected success fully");
               let med= doc.props.reload();
               console.log(med);
            }

        })
    }


    render() {
        return (
            <div className="card1 rounded-5" >

                <div className="card-body">
        <h6 className="hd">User<br/>{this.props.User}</h6>
                    <h6 className="hd">Item Name:{this.props.ItemName}</h6>
        <h6 className="hd">Address:<br/>{this.props.Address}</h6>
                    <h6 className="hd">Total Price:{this.props.TotalPrice}
                    </h6>
                    <h6 className="hd">Status:{this.props.status}
                    </h6>
                    <button className="btn-grad" onClick={this.handeAccept}>Accept
                    </button>
                    <button className="btn-grad" onClick={this.handleReject}>
                        Reject
                    </button>

                </div>
            </div>


        )
    }
}

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: [],
             Message: "",
              Authorized: false
            }
            this.reload=this.reload.bind(this);

    }
    reload(){
        let doc = this;
        fetch('/admin').then(function (res) {
            if (res.status === 200) 
                return res.json();
             else {
                doc.setState({Message: "You are Not Authorised to View "})
            }
        }).then(function (res) {

            if(res)
            doc.setState({data: res, Authorized: true})
        })
        return "Complete";

    }
    componentDidMount() {
        this.reload();

        
    }
    render() {
        let doc=this;
        console.log(this.state.Authorized+" "+this.state.data);
        if (this.state.Authorized===true) {
            return(
                <div className=" cards-container">
                    {
                        
                        this.state.data.map(function(element,index){
                         return    <Itemcards reload={doc.reload} status={element.status} ItemName={element.Item} User={element.Useremail} Address={element.Address} TotalPrice={element.TotalPrice}/>
                        })
                    }

                </div>
            );
        } else {
            return(
            <h1>{
                this.state.Message
            }</h1>);
        }
    }


}
export default Admin;