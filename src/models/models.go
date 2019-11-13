package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Survey struct {	
	ID      		primitive.ObjectID  `json:"_id,omitempty" bson:"_id,omitempty"`	
	Questions   []primitive.M       `json:"questions,omitempty"`
	Votes   		[]primitive.M       `json:"votes,omitempty"`
}

type Vote struct {	
	ID       primitive.ObjectID  `json:"_id,omitempty" bson:"_id,omitempty"`
	Email    string              `json:"email,omitempty"`
	Country  string              `json:"country,omitempty"`
	Age      int                 `json:"age,omitempty"`
	Responses []primitive.M       `json:"responses,omitempty"`
}

