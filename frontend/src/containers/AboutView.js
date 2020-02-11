import React, { Component } from 'react';
class AboutView extends Component {
    render() {
        return (
            <div>
                <h1>Informazioni su...</h1>
                <p>
                    Questa pagina contiene informazioni generiche
                    sulla applicazione che stai utilizzando.
                </p>
                <p>
                    Il progetto è stato realizzato con React, una libreria
                    ideata da Facebook per lo sviluppo di <strong>SPA</strong>,
                    ovvero (<em>Single Page Application</em>), dinamiche e
                    performanti, che possono essere all'occorrenza diventare
                    <strong>multiview</strong> e supportare più viste.
                </p>
                <p>
                    Scopri tutte le funzionalità di React leggendo la
                    <a href="https://www.html.it/guide/react-la-guida/">guida di HTML.it</a>.
                </p>
            </div>
        );
    }
}

export default AboutView;