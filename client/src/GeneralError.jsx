import React, { Component } from "react";
import { Message, Header } from "semantic-ui-react";

const GeneralError = props => {
	const { visible } = props;
	return (
		<Message
			visible={visible}
			error
			header={<Header as="h3" textAlign="left" content="There was an error" />}
			content="Please try again."
		/>
	);
};

export default GeneralError;
