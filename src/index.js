import React from 'react';
import {render} from 'react-dom';
import './index.css';


class SearchBar extends React.Component {
	constructor(props){
		super(props);
		this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
		this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
	}
	handleChangeCheckbox(e){
		this.props.onHandleChangeCheckbox(e);
	}
	handleFilterTextChange(e){
		this.props.onHandleFilterTextChange(e.target.value);
	}
	render() {
		const countryData=this.props.countryData;
		return (
			<div className="search_bar">
				<form>
					<div className="checkboxes_container">
						{countryData.map((x,idx)=>{return(<label key={idx}><span>{x.name}</span><input type="checkbox" name={x.value} checked={x.checked} onChange={this.handleChangeCheckbox}/></label>)})}
					</div>
					<div className="search_input">
						<label>
							<span>Search:</span>
							<input type="search" id="search" name="change" onChange={this.handleFilterTextChange}/>
						</label>
					</div>
				</form>
			</div>
		);
	}
}

class CountryRow extends React.Component {
  render() {
 	const rowData = this.props.rowData;
    return (
    	<tr>{this.props.countryData.map((title,idx) => {if(title.type === "img"){return (<td key={idx}><img src={rowData[title.value]} alt=""/></td>)}else{return (<td key={idx}>{rowData[title.value]}</td>)}})}</tr>
    );
  }
}

class CountriesTable extends React.Component {
  render() {
  	const rows=[];
  	const filterText= this.props.filterText.toLowerCase();
    const countries=this.props.countries.forEach((country) => {
    	if(country.name.toLowerCase().indexOf(filterText) === -1){return;}

    	rows.push(
			<CountryRow rowData={country} key={country.name} countryData={this.props.countryData}/>
		);
    });
  

    return (
    	<div className="countries_tabel">
    		<table>
    			<thead>
    				<tr>
    					{this.props.countryData.map((x,idx)=>{return(<th key={idx}>{x.name}</th>)})}
    				</tr>
    			</thead>
    			<tbody>
    				{rows}
    			</tbody>
    		</table>
    	</div>

    );
  }
}

class FilterableCountriesTable extends React.Component {
	constructor(props){
		super(props);
		this.state={
			countriesData:[],
			filterText: '',
			countryData:[
				{
					name:"Name",
					value:"name",
					type:"string",
					checked:true
				},
				{
					name:"Code",
					value:"alpha3Code",
					type:"string",
					checked:true
				},
				{
					name:"Flag",
					value:"flag",
					type:"img",
					checked:true
				},
				{
					name:"Region",
					value:"region",
					type:"string",
					checked:true
				},
				{
					name:"Subregion",
					value:"subregion",
					type:"string",
					checked:false
				},
				{
					name:"Capital",
					value:"capital",
					type:"string",
					checked:false
				},
				{
					name:"Population",
					value:"population",
					type:"string",
					checked:false
				},			
			]
		};
		this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
		this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
	}
	componentDidMount() {
	    fetch("https://restcountries.eu/rest/v2/all?fields=name;capital;flag;alpha3Code;region;subregion;population;")
	      .then(res => res.json())
	      .then(
	        (result) => {
	          this.setState({
	            countriesData: result
	          });
	        }
	      )		
	}
	handleChangeCheckbox(e){
		const chackBoxData = this.state.countryData;
		const type= chackBoxData.findIndex((x) => e.target.name === x.value);
		chackBoxData[type].checked = e.target.checked;
		this.setState({
			[chackBoxData]:chackBoxData
		});
	}
	handleFilterTextChange(text){
	    this.setState({
	      filterText: text
	    });		
	}
	render() {
		const activeCountryData = this.state.countryData.filter((x)=>{return x.checked});
		return (
		<div className="countries_tabel_container">
			<h1>Countries</h1>
			<SearchBar countryData={this.state.countryData} onHandleChangeCheckbox={this.handleChangeCheckbox} onHandleFilterTextChange={this.handleFilterTextChange}/>
			<CountriesTable countries={this.state.countriesData} countryData={activeCountryData} filterText={this.state.filterText}/>
		</div>
		);
	}
}


const element = <FilterableCountriesTable />;
render(element, document.getElementById('root'));
