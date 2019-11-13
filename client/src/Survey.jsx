import React, { Component } from "react";
import axios from "axios";
import {
	CountryDropdown,
	RegionDropdown,
	CountryRegionData
} from "react-country-region-selector";
import VoteStatistics from "./VoteStatistics";
import countryOptions from "./countries";
import {
	Form,
	Radio,
	Statistic,
	Header,
	Container,
	Card,
	Grid,
	Label,
	Dropdown,
	Button,
	Input
} from "semantic-ui-react";

export default class Survey extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			statistics: [],
			country: "",
			age: 0,
			email: "",
			questions: []
		};
	}

	componentDidMount() {
		const { id } = this.props.match.params;
		if (id) {
			this.getSurvey(id);
		}
	}


	onSubmit = () => {
		const { id } = this.props.match.params;
		let { age } = this.state;
		const { country, email, questions } = this.state;
		age = parseInt(age);
		
		const voted = questions.map(question => {			
			return {
				question: `${question.question}`, 
				response: question.options.filter(option => option.selected === true).reduce(option => option.text)
			};
		})


		console.log(voted)
		
		axios
			.post(
				`/api/survey/${id}/vote`,
				{
					email,
					country,
					age,
					responses: voted
				},
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}
			)
			.then((response) => {
				
				console.log(response.data);
			})
			.catch(function(error) {
				console.log(error);
			});
	
	};

	handleRadioChange = ({ target }) => {
		const questions = this.state.questions;
		const newOptions = questions.map((question, i) => {
			if (question.question !== target.name) return question;
			return {
				...question,
				options: question.options.map(option => {
					const checked = option.text === target.value;
					return { ...option, selected: checked };
				})
			};
		});

		this.setState({ questions: newOptions });
	};

	handleInputChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	selectCountry = (e, data) =>{		
		this.setState({ country: data.value });
	};

	getSurvey = id => {
		axios
			.get(`/api/survey/${id}`)
			.then(response => {
				const { questions } = response.data;
				this.setState({
					questions,
					loading: false
				});
			})
			.catch(function(error) {
				console.log(error);
			});
	};



	render() {
		if (!this.state.loading) {
			const { questions, statistics, country, age, email } = this.state;
			return (
				<div>
					<Card fluid>
						<Card.Content>
							<Form onSubmit={this.onSubmit}>
								{questions.map((question, i) => (
									<>
										<Header as="h2" textAlign="left" dividing>
											{question.question}
										</Header>
										{question.options &&
											question.options.map((option, optionIdx) => (
												<Form.Field>
													<Header sub textAlign="left">
														{option.text}
													</Header>
													<Input
														type="radio"
														name={question.question}
														value={option.text}
														checked={option.selected}
														onChange={this.handleRadioChange}
													/>
												</Form.Field>
											))}
									</>
								))}

								<Form.Field>
									<Label>Choose your country</Label>
									<Dropdown
										placeholder="Select Country"
										fluid										
										selection
										options={countryOptions}										
										onChange={this.selectCountry}
										value={country}
									/>
								</Form.Field>
								<Form.Group widths="equal">
									<Form.Field>
										<Input
											type="number"
											name="age"
											onChange={this.handleInputChange}
											value={age}
											fluid
											label="What is your age?"
										/>
									</Form.Field>
									<Form.Field>
										<Input
											type="email"
											name="email"
											onChange={this.handleInputChange}
											value={email}
											fluid
											label="What is your email?"
										/>
									</Form.Field>
								</Form.Group>
								<Button type="submit" content="Vote" />
							</Form>
						</Card.Content>
					</Card>
				</div>
			);
		} else {
			return <p>Loading ... </p>;
		}
	}
}
