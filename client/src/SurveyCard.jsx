import React from "react";
import { Card } from "semantic-ui-react";
import { Link } from "react-router-dom";
import QuestionBuilder from "./QuestionBuilder";


const SurveyCard = props => {	
	const { _id, questions, index } = props;
	return (
		<Card color="purple" fluid>
			<Card.Content>
				<Card.Header textAlign="left">{`Survey #${index + 1}`}</Card.Header>
				<Card.Meta>Survey {_id}</Card.Meta>
				{questions &&
					questions.map((question,i) => <QuestionBuilder key={i} question={question} />)}
			</Card.Content>
			<Card.Content extra>
				<Link to={`/survey/${_id}`}>
					<p className="surveylink">Take Survey</p>
				</Link>
			</Card.Content>
		</Card>
	);
};

export default SurveyCard;
