import React, { Component } from 'react'
import TokenService from "../../services/token-service";
import UserContext from "../../contexts/UserContext";
import Feedback from "../../components/Feedback";
import { Link } from 'react-router-dom'


import API from "../../config";
class LearningRoute extends Component {

    static contextType = UserContext;
  
    state = {
      answer: null,
      score: null,
      correct: "",
      incorrect: "",
      total: 0,
    };
  
    async componentDidMount() {
      try {
        const response = await fetch(`${API.API_ENDPOINT}/language/head`, {
          headers: {
            authorization: `bearer ${TokenService.getAuthToken()}`,
          },
        });
        const json = await response.json();
        console.log(json)
        this.context.setNextWord(json);
        this.context.setTotalScore(json.totalScore);
        this.setState({
          correct: json.wordCorrectCount,
          incorrect: json.wordIncorrectCount,
          total: json.totalScore,
          isClicked: false,
          score: null,
        });
        console.log(this.context.nextWord.nextWord)
      } catch (e) {
        this.setState({ error: e });
      }
    }
  
    async submitForm(e) {
      e.preventDefault();
      const guessWord = e.target.guess.value.toLowerCase().trim();
      this.context.setGuess(guessWord);
      try {
        const response = await fetch(`${API.API_ENDPOINT}/language/guess`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `bearer ${TokenService.getAuthToken()}`,
          },
          body: JSON.stringify({ guess: guessWord }),
        });
        const json = await response.json();
        this.context.setResponse(json);
        this.setState({
          total: json.totalScore,
        });
      } catch (e) {
        this.setState({ error: e });
      }
  
      this.context.setTotalScore(this.context.response.totalScore);
  
      this.context.setClicked(true);
  
      if (this.context.response.isCorrect) {
        this.setState({
          answer: "correct",
          correct: this.state.correct + 1,
        });
      } else {
        this.setState({
          answer: "incorrect",
          incorrect: this.state.incorrect + 1,
        });
      }
    }
  
    render() {
      return (
        <main className="box">
           <Link
            to='/'>
            {'<- Back To Dashboard'}
          </Link>
        <form onSubmit={(e) => this.submitForm(e, this.context)}>
          {this.state.answer === null && <h2 style={{color:'white'}}>Translate the word:</h2>}
          {this.state.answer === "correct" && (
            <h2 className="feedback">That Is Correct!</h2>
          )}
          {this.state.answer === "incorrect" && (
            <h2 className="feedback">Good try, but that is incorrect! </h2>
          )}
          <h3 style={{textAlign:'center', margin:'5px', paddingBottom:'18px'}}>
            {this.context.nextWord ? this.context.nextWord.nextWord : null}
          </h3>
          <div>
            {this.context.isClicked === false && (
              <label htmlFor="input">
                What's the translation for this word?
              </label>)}
            {this.context.isClicked === false && (
              <p>
                <input
                  autoFocus
                  name="guess"
                  id="input"
                  type="text"
                  required
                ></input>
              </p>)}

            {this.context.isClicked === false && (
              <button type="submit">Submit your answer</button>
            )}
            {this.context.isClicked === true && <Feedback />}
          </div>
          <p>Correct Answers: {this.state.correct}</p>
          <p>Incorrect Answers: {this.state.incorrect}</p>
          <p>Your total score is: {this.state.total}</p>
        </form>
        </main>
      );
    }
  }
  
export default LearningRoute
