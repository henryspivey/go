package middleware

import (
	"context"
	"encoding/json"	
	"log"
	"net/http"	
	"survey-app/server/models"
	"github.com/gorilla/mux"	
	

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DB connection string
// const connectionString = "mongodb://localhost:27017"
const connectionString = "mongodb+srv://admin:saVfgSXGXvseqbNH@cluster0-ezqbz.mongodb.net/test?retryWrites=true&w=majority"

// Database Name
const dbName = "mydb"

// Collection name
const collName = "survey"

// collection object/instance
var collection *mongo.Collection

// create connection with mongo db
func init() {

	// Set client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}
	
	collection = client.Database(dbName).Collection(collName)
	
}

// GetAllSurveys get all the survey route
func GetAllSurveys(w http.ResponseWriter, r *http.Request) {	
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	payload := getAllSurveys()
	json.NewEncoder(w).Encode(payload)


}

func CreateSurvey(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	
	var survey models.Survey
	_ = json.NewDecoder(r.Body).Decode(&survey)		
	var id interface{}

	id= insertOneSurvey(survey)

	if oid, ok := id.(primitive.ObjectID); ok {
	    json.NewEncoder(w).Encode("https://limitless-garden-10375.herokuapp.com/survey/"+oid.Hex())
	}
		
}

func GetSurvey(w http.ResponseWriter, r *http.Request) {	
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	params := mux.Vars(r)	
	payload := GetSurveyById(params["id"])
	json.NewEncoder(w).Encode(payload)
}

func VoteSurvey(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var vote models.Vote
	_ = json.NewDecoder(r.Body).Decode(&vote)		
	voteSurvey(params["id"], vote)
	json.NewEncoder(w).Encode(vote)
}


func GetSurveyById(survey string) models.Survey  {	
	
	id, _ := primitive.ObjectIDFromHex(survey)
	filter := bson.M{"_id": id}
	var result models.Survey
	err:= collection.FindOne(context.Background(), filter).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}
	
	return result
}


func voteSurvey(survey string, vote models.Vote) {
	id, _ := primitive.ObjectIDFromHex(survey)
	filter := bson.M{"_id": id}	
	
	update := bson.M{"$push": bson.M{"votes": vote}}
	_, err := collection.UpdateOne(context.Background(),filter,update)
	if err != nil {
		log.Fatal(err)
	}
	
}

// get all surveys from the DB and return it
func getAllSurveys() []primitive.M {
	cur, err := collection.Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}
	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)

	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	cur.Close(context.Background())
	return results
}

// Insert one survey in the DB
func insertOneSurvey(survey models.Survey) interface{} {
	result, err := collection.InsertOne(context.Background(), survey)
	if err != nil {
		log.Fatal(err)
	}
	newID := result.InsertedID
	return newID
	
}


