import React from 'react';  
import './PopUp.css';  

class Popup extends React.Component {  
    constructor(props){
        super(props);
        this.state={
            Address:"",
            Quantity:1,
            message:"",
            ordered:false,
            

        }
        this.handleChange=this.handleChange.bind(this);
        this.placeOrder=this.placeOrder.bind(this);

    }
    handleChange(event){
        this.setState({
            [event.target.name]:event.target.value
        })
        console.log(event.target.value);
 
    }
    placeOrder(event){
        event.preventDefault();
        let doc=this;
        console.log("BUy");
        let data={
            item:this.props.ItemName,
            Address:this.state.Address,
            Quantity:this.state.Quantity,
            TotalPrice:this.state.Quantity*this.props.price
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch('/placeOrder',requestOptions)
        .then((response)=>{
            console.log(response.status);
            if(response.status===200)
            {
                
                doc.setState({
                    message:"Successfully Placed"
                })
            }else if(response.status===404){
                doc.setState({
                    message:"Please Login"
                })

            }else{
                doc.setState({
                    message:"Internal Server Error"
                })


            }
        })
    }
  render() {  
      if(this.state.ordered===true){
          return (
            <div className='popup'>  
            <div className='popup\_inner'>  
                  {this.state.message}
                  <button onClick={this.props.closePopup}>Cancel</button>
             </div>
            
             </div>  
                        

          );

      }
      else{
return (  
<div className='popup'>  
<div className='popup\_inner'>  
<h3>{this.state.message}</h3>
<h1>{this.props.ItemName}</h1>  
   <form>
       <label>Address:</label>
       <input   type="text" name="Address" className="form-control w-80 m-2" value={this.state.Address} onChange={this.handleChange}/><br/>
       <label>Quantity</label>
       <input   type="text" name="Quantity" className="form-control w-80 m-2 " value={this.state.Quantity} onChange={this.handleChange}/>
   </form>
   <button className="btn btn-primary m-2" onClick={this.placeOrder}>Buy</button>
   <button className="btn btn-danger m-2" onClick={this.props.closePopup}>Cancel</button>  
</div>  
</div>  
);  
}
  }  
}  

export default Popup;