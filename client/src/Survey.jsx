import React, {Component} from 'react';
import axios from "axios";
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import ButtonComponent from './ButtonComponent';
import InputComponent from './InputComponent';
import countryOptions from './countries';
import { Form, Radio, Statistic, Header, Container, Card, Grid, Label, Dropdown} from 'semantic-ui-react';

export default class Survey extends Component{
	constructor(props) {
		super(props);
		this.state = {title: "", options: [], loading: true, statistics: [], country: '', age: 0, email: ''};	
	}

	componentDidMount() {
		const { id } = this.props.match.params
		if(id) {
			this.getSurvey(id)
		}					
	}

	selectCountry (val) {
	  this.setState({ country: val });
	}

	
	onSubmit = () => {		
		let _this = this;
		const { id } = this.props.match.params
		const {value} = this.state;		
		axios.put(`/api/survey/${id}/vote/${value}`)
		  .then(function (response) {
		  	console.log(response.data);
		  }).then(function(){
		  	_this.addVoteData(id)
		  })
		  .then(function(){
		  	_this.getSurveyResults(id)
		  })
		  .catch(function (error) { 
		  	console.log(error)
		  });
	}

	addVoteData = (id) => {
		const surveyId = id
		let {country, age, email} = this.state;
		age = parseInt(age)
		axios
		  .post(
		     `/api/survey/${id}/vote`,
		    {
		    	surveyId,
		      country,
		      age,
		      email	      
		    },
		    {
		      headers: {
		        "Content-Type": "application/x-www-form-urlencoded"
		      }
		    }
		  ).then(function (response) {
		  	console.log(response.data);
		  })
		  .catch(function (error) { 
		  console.log(error)
		});

	}

	handleChange = (e, { value }) => this.setState({ value })
	onChange = (e) => {
		this.setState({[e.target.name]:e.target.value })
	}	

	getSurvey = (id) => {		
		let _this = this;
		axios.get(`/api/survey/${id}`)
		  .then(function (response) {
		  	const {title, options} = response.data;		  	
		    _this.setState({title: title, options: options, loading: false});		    
		  }).then(function(){
		  	_this.getSurveyResults(id);
		  })
		  .catch(function (error) { 
		  	console.log(error)
		  });		
	}


	getSurveyResults = (id) => {		
		let _this = this;
		axios.get(`/api/survey/${id}/results`)
	  .then(function (response) {
	  	const {votes} = response.data;		  	
	    _this.setState({statistics: votes, loading: false});		    
	  })
	  .catch(function (error) { 
	  	console.log(error)
	  });		
	}

	VoteStatistics = (options,votes) => (
	 	<Card fluid color="purple">
	     <Card.Content extra>
	       <Statistic.Group widths={votes.length}>
	       	{votes.map((vote, i) => {
	       		return (
	       			<Statistic horizontal label={`Votes for Option ${options[i]}`} value={vote} />
	       			)
	       	})}	    
	       </Statistic.Group>
	     </Card.Content>
	   </Card>
	)
	
	render() {
		let _this = this;
		if(!_this.state.loading) {
			const {title, options, statistics, country, age, email} = _this.state;
			return (
				<div>
					<Card fluid>
					  <Card.Content>				
					  	<Header as="h2">{title}</Header>	
							<Form onSubmit ={this.onSubmit}>						  
							  {options.map((option,i) => (
							  	<Form.Field>
							  		<Radio
							  		  label={`Choice #${i+1} ${option}`}
							  		  name='radioGroup'
							  		  value={i}
							  		  checked={this.state.value === i}
							  		  onChange={this.handleChange}
							  		/>
							  	</Form.Field> 
							  	))}
							 
								  <Form.Field>
								  	<Label>
								  		Choose your country								  		
								  	</Label>
								  	<Dropdown
						  		    placeholder='Select Country'
						  		    fluid
						  		    search
						  		    selection
						  		    options={countryOptions}
										/>
								  </Form.Field>
								 <Form.Group widths="equal">
								  <Form.Field>
										<InputComponent
										  type="number"
										  name="age"
										  onChange={this.onChange}
										  value={age}
										  fluid
										  label="What is your age?"			  
										/>
									</Form.Field>
									<Form.Field>
										<InputComponent
										  type="email"
										  name="email"
										  onChange={this.onChange}
										  value={email}
										  fluid	
										  label="What is your email?"	  
										/>
									</Form.Field>								           
								</Form.Group>
								<ButtonComponent type='submit' content="Vote"/>
							</Form>
						</Card.Content>
					</Card>		
					{statistics.length > 0 && _this.VoteStatistics(options,statistics)}		
				</div>		
			)
		} else {
			return (<p>Loading ... </p>)
		}
		
	}
}
