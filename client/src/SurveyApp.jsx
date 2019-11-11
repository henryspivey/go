import React, { Component } from "react";
import axios from "axios";
import ButtonComponent from './ButtonComponent';
import InputComponent from './InputComponent';

import { Card, Header, Form, Label, Segment, Grid} from "semantic-ui-react";

let endpoint = "http://localhost:8080";

class SurveyApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      surveys: [],      
      question: '',
      options: [{text: ""}],
      disabled: false      
    };
    this.addOption = this.addOption.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }  

  componentDidMount() {
    this.getTask()    
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = () => {
    let {title, options} = this.state;
    options = options.map((option) => {
      return option.text
    })
    const votes = Array.from({length: options.length}, () => 0)
    
    if (title) {
      axios
        .post(
           `${endpoint}/api/survey`,
          {
            title, 
            options,
            votes            
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {          
          this.getTask();
        })
        .catch(function (error) { 
        console.log(error)
      });
    }
    this.setState({title: "", options: [{text: ""}]})
    
  };

  getTask = (id) => {
    let url = endpoint + "/api/survey";
    axios.get(url).then(res => {
      const data = res.data
      if (data) {
        this.setState({
          surveys: res.data.map(item => {         
            return (
              <Card key={item._id} color="purple" fluid >
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={{ wordWrap: "break-word" }}>{item.title}</div>
                  </Card.Header>
                  <Card.Meta>
                    Survey {item._id}
                  </Card.Meta>     
                </Card.Content>
                  <Card.Content extra> 
                    <ButtonComponent basic href={`/api/survey/${item._id}`} content="Take Survey"/>
                  </Card.Content>
              </Card>
            );
          })          
        });
      } else{
        this.setState({
          surveys: [],          
        });      
      }
    });
  }; 


  addOption = (e) => {
    this.setState({options: [...this.state.options, {text: ""}]})
  }

  removeOption = idx => () => {
    this.setState({
      options: this.state.options.filter((s, sidx) => idx !== sidx)
    });
  };

  handleOptionChange = idx => evt => {    
    const newOptions = this.state.options.map((option, optionIdx) => {
      if(idx !== optionIdx) return option
      return {...option, text: evt.target.value}
    })
    this.setState({options: newOptions})
  }


  render() {
    const {title, options, country, region} = this.state;
    return (
      <>
        <Header as="h2">
          Survey App
        </Header>        
        <Card fluid>
          <Card.Content>            
            <Form>              
              <Form.Field>
                <InputComponent
                  type="text"
                  name="title"
                  onChange={this.onChange}
                  value={title}
                  fluid
                  placeholder="Enter your question"
                  label="Question: "
                />
              </Form.Field>
              {options.map((option,i) => (
                <Form.Field inline key={i} required>                  
                  <InputComponent label={`Option # ${i+1}`} type="text" placeholder="Please enter an option" onChange={this.handleOptionChange(i)}/>                      
                </Form.Field>                      
              ))}  
              <ButtonComponent icon="plus" labelPosition='left' onClick={() => this.addOption()} content="Add Option"/>
             
            </Form>          
          </Card.Content>

          <Card.Content extra>
            <ButtonComponent color="teal" type='submit' onClick={() => this.onSubmit()} content="Submit"/>
            
          </Card.Content>
        </Card>
        
        <Grid.Row>        
          <Segment> 
            <Header as="h2">
              Surveys
            </Header>
            <Card.Group>             
              {this.state.surveys.length === 0 ? <Header>No surveys yet</Header>  : 
              this.state.surveys}
            </Card.Group>
          </Segment>
        </Grid.Row>
      </>
        
    );
  }
}

export default SurveyApp;
