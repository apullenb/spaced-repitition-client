import React, { Component } from "react";
import TokenService from "../services/token-service";
import UserContext from "../contexts/UserContext";
import ListOfWords from "./ListOfWords";
import API from "../config"

export default class Dashboard extends Component {
  static contextType = UserContext;

  async componentDidMount() {
    try {
      const response = await fetch(`${API.API_ENDPOINT}/language`, {
        headers: {
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
      });
      const json = await response.json();
      this.context.setLanguage(json.language.name);
      this.context.setWords(json.words);
      this.context.setTotalScore(json.language.total_score);
      document.getElementById("learn").focus();
    } catch (error) {
      this.context.setError(error);
    }
    console.log(this.context)
  }

  render() {
    return (
      <section className='dashboard'>
        <div className='top'>
        <h2>You Are Learning</h2>
        <h3>{this.context.language}</h3>
        <a id="learn" className="learn" href="/learn">
          <button>Start Practice</button>
        </a></div>
        <h3>Practice Words</h3>
        <section className="cards">
          {this.context.words ? (
            <ListOfWords words={this.context.words} />
          ) : ( 'Loading'         
          )}
        </section>
        <h3>
          {this.context.totalScore
            ? `Total correct answers: ${this.context.totalScore}`
            : null}
        </h3>
      </section>
    );
  }
}