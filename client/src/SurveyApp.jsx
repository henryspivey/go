import React, { Component } from "react";
import axios from "axios";
import {
	Card,
	Header,
	Form,
	Label,
	Segment,
	Grid,
	Button,
	Input
} from "semantic-ui-react";
import SurveyCard from "./SurveyCard";

class SurveyApp extends Component {
	constructor(props) {
		super(props);

		this.state = {			
			surveys: [],
			questions: [{ question: "", options: [{ text: "", selected: false }]}],		
			votes: [],				
			disabled: false
		};

	}

	componentDidMount() {
		this.getSurveys();
	}

	onQuestionChange = (idx) => e => {
		const questions = this.state.questions;

		questions[idx].question = e.target.value;
		this.setState({
			questions
		});
	};

	onSubmit = () => {
		let { questions, votes } = this.state;
		// const optionsText = options.map(option => option.text);
		// const votes = Array.from({ length: options.length }, () => 0);
		axios
			.post(
				"/api/survey",
				{
					questions,
					votes
				},
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}
			)
			.then(res => {				
				this.getSurveys();
			})
			.catch(function(error) {
				console.log(error);
			});
		this.setState({ question: "", options: [{ text: "", selected: false }] });
	};

	getSurveys = () => {		
		axios.get("/api/survey").then(res => {
			const data = res.data;
			if (data) {
				this.setState({
					surveys: res.data
				});
			} else {
				this.setState({
					surveys: []
				});
			}
		});
	};

	addQuestion = e => {
		this.setState({
			questions: [
				...this.state.questions,
				{ question: "", options: [{ text: "", selected: false }] }
			]
		});
	};

	addOption = e => {
		const { questions } = this.state;
		const questionIdx = e;
		questions[questionIdx].options.push({ text: "", selected: false });
		this.setState({ questions: questions });
	};

	removeOption = idx => () => {
		this.setState({
			options: this.state.options.filter((s, sidx) => idx !== sidx)
		});
	};

	handleOptionChange = (idx, optionIdx) => e => {
		const questions = this.state.questions;

		const newOptions = questions[idx].options.map((option, i) => {
			if (i !== optionIdx) return option;
			return { ...option, text: e.target.value };
		});
		questions[idx].options = newOptions;
		this.setState({ questions });
	};

	render() {
		const { questions, title, options, country, region } = this.state;
		return (
			<>
				<Header as="h2">Survey App</Header>
				<Card fluid>
					<Card.Content>
						<Form>
							<Form.Field>
								{questions.map((question, i) => (
									<>
										<Input
											type="text"
											name="title"
											onChange={this.onQuestionChange(i)}
											value={question.question}
											fluid
											placeholder="Enter your question"
											label="Question: "
										/>
										{question.options.map((option, optionIdx) => (
											<>
												<Form.Field inline key={optionIdx} required>
													<Input
														label={`Option # ${optionIdx + 1}`}
														type="text"
														placeholder="Please enter an option"
														onChange={this.handleOptionChange(i, optionIdx)}
													/>
												</Form.Field>
											</>
										))}
										<Button
											icon="plus"
											labelPosition="left"
											onClick={() => this.addOption(i)}
											content="Add Option"
										/>
									</>
								))}
							</Form.Field>
							<Button
								icon="plus"
								labelPosition="left"
								onClick={() => this.addQuestion()}
								content="Add Question"
							/>
						</Form>
					</Card.Content>

					<Card.Content extra>
						<Button
							color="teal"
							type="submit"
							onClick={this.onSubmit}
							content="Submit"
						/>
					</Card.Content>
				</Card>

				<Grid.Row>
					<Segment>
						<Header as="h2">Surveys</Header>
						<Card.Group>
							{this.state.surveys.length === 0 ? (
								<Header>No surveys yet</Header>
							) : (
								this.state.surveys.map((item, index) => (
									<SurveyCard key={item._id} {...item} />
								))
							)}
						</Card.Group>
					</Segment>
				</Grid.Row>
			</>
		);
	}
}

export default SurveyApp;
