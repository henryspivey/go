import React from "react";
import { Statistic, Card } from "semantic-ui-react";

const VoteStatistics = props => {
	const { options, votes } = props;
	return (
		<Card fluid color="purple">
			<Card.Content extra>
				<Statistic.Group widths={votes.length}>
					{votes.map((vote, voteIndex) => {
						return (
							<Statistic
								horizontal
								label={`Votes for Option ${options[voteIndex]}`}
								value={vote}
							/>
						);
					})}
				</Statistic.Group>
			</Card.Content>
		</Card>
	);
};

export default VoteStatistics;
