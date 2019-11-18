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
import GeneralError from "./GeneralError";

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
			countryValid: false,
			disabled: true,
			voted: false,
			generalError: false,
			showResults: false
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
		const {
			country,
			email,
			questions,
			disabled,
			voted,
			generalError
		} = this.state;
		age = parseInt(age);

		const validVotes = questions.map(question => {
			
			return {
				question: `${question.question}`,
				response:
					question.options.filter(option => option.selected === true)
			};
			
		});
		

		if (!voted) {
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
					this.setState({ voted: !voted });
				})
				.catch(error => {
					this.setState({ generalError: !generalError });
				});
		}
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
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	};

	validateField = (fieldName, value) => {
		let emailValid = this.state.emailValid;
		let ageValid = this.state.ageValid;
		let countryValid = this.state.countryValid;

		switch (fieldName) {
			case "email":
				emailValid =
					value.length > 0 &&
					value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
					value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).length > 0;
				break;
			case "age":
				const parsed = parseInt(value);
				ageValid = parsed > 0 && !isNaN(parsed);
				break;
			case "country":
				countryValid = value.length > 0;
				break;
			default:
				break;
		}

		this.setState(
			{
				emailValid,
				ageValid,
				countryValid
			},
			() => {
				this.validateForm(emailValid, ageValid, countryValid);
			}
		);
	};

	validateForm = (emailValid, ageValid, countryValid) => {
		this.setState({ disabled: emailValid && ageValid && countryValid });
	};

	selectCountry = (e, data) => {
		let value = data.value;
		this.setState({ country: value }, () =>
			this.validateField("country", value)
		);
	};

	getSurvey = id => {
		const { generalError } = this.state;
		axios
			.get(`/api/survey/${id}`)
			.then(response => {
				const { questions } = response.data;
				this.setState({
					questions,
					loading: false
				});
			})
			.catch(error => {
				this.setState({ generalError: !generalError });
			});
	};

	render() {
		if (!this.state.loading) {
			const {
				questions,
				country,
				age,
				email,
				disabled,
				voted,
				generalError,
				showResults
			} = this.state;
			return (
				<div>
					<Card fluid>
						<Card.Content>
							<Form onSubmit={this.onSubmit}>
								{questions && questions.map((question, i) => (
									<>
										<Header as="h2" textAlign="left" dividing>
											{question.question}
										</Header>
										{question.options &&
											question.options.map((option, optionIdx) => (
												<Form.Field key={optionIdx}>
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
									visible={true && !disabled}
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
										<Header
											as="h3"
											textAlign="left"
											content="Thanks for voting!"
										/>
									}
									content="You're all set."
								/>
								<GeneralError visible={generalError} />
								<Button
									type="submit"
									content="Vote"
									disabled={!disabled && !voted}
								/>
							</Form>
						</Card.Content>
					</Card>
					{showResults}
				</div>
			);
		} else {
			return <p>Loading ... </p>;
		}
	}
}
