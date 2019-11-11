package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Survey struct {	
	ID      primitive.ObjectID  `json:"_id,omitempty" bson:"_id,omitempty"`
	Title   string              `json:"title,omitempty"`
	Options []string            `json:"options,omitempty"`
	Votes   []int               `json:"votes,omitempty"`
}

type Vote struct {	
	ID       primitive.ObjectID  `json:"_id,omitempty" bson:"_id,omitempty"`
	SurveyId string 			`json:"surveyId,omitempty"`
	Email    string              `json:"email,omitempty"`
	Country  string              `json:"country,omitempty"`
	Age      int                 `json:"age,omitempty"`
}

