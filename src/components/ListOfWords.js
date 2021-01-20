import React from "react";


export default function ListOfWords(props) {
  const words = props.words;
  console.log(words)
  return (
    <>
      {words.map((word, i) => (
        <section key={i} className="card">
          <h4 className="title">{word.original}</h4>
          <p>
            correct answer count: <span>{word.correct_count}</span>
          </p>
          <p>
            incorrect answer count: <span>{word.incorrect_count}</span>
          </p>
        </section>
      ))}
    </>
  );
}