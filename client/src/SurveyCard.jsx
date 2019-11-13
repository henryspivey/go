import React from "react";
import {
	Card,	
	Button,
	List

} from "semantic-ui-react";
import QuestionBuilder from './QuestionBuilder';

const SurveyCard = props => {
	const {_id, questions} = props;	
	return (
		<Card  color="purple" fluid>
			<Card.Content>
			<Card.Meta>Survey {_id}</Card.Meta>
			{questions && questions.map((question) => (
				<QuestionBuilder question={question} />
				
				))}				
			</Card.Content>
			<Card.Content extra>
				<Button href={`/survey/${_id}`} color="blue" content="Take Survey" />
			</Card.Content>
		</Card>
	);
};


export default SurveyCard;