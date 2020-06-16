import React from 'react';
import './Items.css';
import Popup from  '../PopUp/PopUp.js';

class ItemCard extends React.Component{
    constructor(props){
        super(props);
        this.state = { showPopup: false };  
       this.togglePopup= this.togglePopup.bind(this)
    }
    togglePopup() {  
        this.setState({  
             showPopup: !this.state.showPopup  
        });  
         }  
    render(){
        //console.log(this.props.Description+" "+this.props.price);
        if(this.state.showPopup){
          return(
            <div className="container">
            {
    this.state.showPopup ?  
    <Popup  
              price={this.props.price}
              ItemName={this.props.itemname} 
              closePopup={this.togglePopup.bind(this)}  
    />  
    : null
          
    }  
	
    </div>
    );
        }
        else
        {        
        return (
            <React.Fragment>
            
							
							
							<div className="col-12 col-sm-6 col-md-6 col-lg-3 m-3">
								<div className="card w-100 h-100 mb-4">                    
									<div className="card-header">                                
										<h5 className="card-title m-0 p-0 font-weight-bolder text-secondary">{this.props.itemname}</h5>
									</div>
									<div className="card-body text-left">
                                                      <p className="card-text">{this.props.Description}</p>
										<span className="font-lead-base font-weight-bold text-muted">20% Off!</span>
										<div className="promotion-promo">{this.props.price}</div>
										<div className="promotion-price">
											<div className="promotion-price-desc">Now</div>
                                              <div className="promotion-price-text">{this.props.price*0.8}</div>                                    
										</div>
									</div>
									<div className="card-footer"><a onClick={this.togglePopup} className="btn btn-warning">Order</a></div>
								</div>
							</div>

						
                            </React.Fragment>
    

    

        );
    }
}
}
class Items extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data:[]
        }
    }
    componentDidMount(){
        let doc=this;
        fetch('http://127.0.0.1:9000/')
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{
            doc.setState({
                data:res
            })
            
        })
    }
    render(){



        return(
            <div className="container">
		<div className="row">			
			<div className="mx-auto">
				<div className="col-lg-12">
					<div className="text-center my-3">
						<h1 className="text-center my-5">Available Items</h1>						
						<div className="card-deck no-gutters">

                        {
                    this.state.data.map(function(element,index){  
                        
                    return <ItemCard itemname={element.Name} price={element.Price} Description={element.Desc} key={index}/>
                    
                })
                }
                        </div>
					</div>
				</div>
			</div>
		</div>
	</div>
        )
    }

}

export default Items;