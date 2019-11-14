import React, { Component } from "react";
import axios from "axios";
import countryOptions from "./countries";
import {
	Form,
	Header,
	Card,
	Label,
	Dropdown,
	Button,
	Input,
	Message
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
			questions: [],
			ageValid: false,
			emailValid: false,
			disabled: true,
			voted: false
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
		const { country, email, questions, disabled } = this.state;
		age = parseInt(age);

		const validVotes = questions.map(question => {
			this.validateOptions(question);
			if (!disabled) {
				return {
					question: `${question.question}`,
					response: question.options && question.options
						.filter(option => option.selected === true)
						
				};
			}
		});

		if (!disabled) {
			axios
				.post(
					`/api/survey/${id}/vote`,
					{
						email,
						country,
						age,
						responses: validVotes
					},
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					}
				)
				.then(response => {
					this.setState({voted: !this.state.voted})
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	};

	handleRadioChange = ({ target }) => {
		const questions = this.state.questions;
		const newOptions = questions.map((question, i) => {
			this.validateOptions(question)
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
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	};

	validateField = (fieldName, value) => {
		let emailValid = this.state.emailValid;
		let ageValid = this.state.ageValid;

		switch (fieldName) {
			case "email":
				emailValid =
					value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
					value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).length > 0;
				break;
			case "age":
				ageValid = value > 0 && !isNaN(value);
				break;
			default:
				break;
		}

		this.setState(
			{
				emailValid: emailValid,
				ageValid: ageValid
			},
			this.validateForm
		);
	};

	validateForm = () => {
		this.setState({ disabled: !this.state.emailValid && !this.state.ageValid });
	};

	validateOptions = question => {
		const checked = question.options.filter(option => option.selected === true);
		
		if (checked.length === 0) {
			this.setState({ disabled: !this.state.disabled });
		}
	};

	selectCountry = (e, data) => {
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
			const {
				questions,
				country,
				age,
				email,
				emailValid,
				ageValid,
				disabled,
				voted
			} = this.state;
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
										<Form.Input
											type="number"
											name="age"
											onChange={this.handleInputChange}
											value={age}
											fluid
											label="What is your age?"
											required={true}
										/>
									</Form.Field>
									<Form.Field>
										<Form.Input
											type="email"
											name="email"
											onChange={this.handleInputChange}
											value={email}
											fluid
											label="What is your email?"
											required={true}
										/>
									</Form.Field>
								</Form.Group>

								<Message
									visible={disabled}
									error								
									header={
										<Header as="h3" textAlign="left" content="Invalid Inputs" />
									}
									content="Please check your inputs again. All fields are required."
								/>
								<Message
									visible={voted}
									success
									header={
										<Header as="h3" textAlign="left" content="Thanks for voting!" />
									}
									content="You're all set."
								/>
								<Button type="submit" content="Vote" disabled={disabled} />
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
