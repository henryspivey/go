import React from 'react'
import {Card, List} from "semantic-ui-react";


const QuestionBuilder = props => {
	const {question} = props;	
	return (
		<List>
	    <List.Item>	    	
					{question.question}
			</List.Item>
	  </List>
		
	)

}

export default QuestionBuilder;