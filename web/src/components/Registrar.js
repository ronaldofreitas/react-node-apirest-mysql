import React, { Component,Fragment } from "react";
import { Link, withRouter } from "react-router-dom";

import rest from '../services/rest'; // api rest

class Registrar extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    error: ""
  };

  handleSignUp = async e => {
    e.preventDefault();
    const { name, email, password } = this.state;
    if (!name || !email || !password) {
      this.setState({ error: "Preencha todos os dados para se cadastrar" });
    } else {
      try {
        await rest.post("/cadastrar", { name, email, password }).then( (ret) => {
            if (ret.data.user === null && ret.data.erro === 1) {
                this.setState({ error: ret.data.msg });
            } else {
                this.props.history.push("/");
            }
        } );
      } catch (err) {
        console.log(err);
        this.setState({ error: "Ocorreu um erro ao registrar sua conta. T.T" });
      }
    }
  };

  render() {
    return (
      <Fragment>
        <form onSubmit={this.handleSignUp}>
          {this.state.error && <p>{this.state.error}</p>}
          <input
            type="text"
            placeholder="Nome"
            onChange={e => this.setState({ name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Endereço de e-mail"
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button type="submit">Cadastrar</button>
          <hr />
          <Link to="/">Fazer login</Link>
        </form>
      </Fragment>
    );
  }
}

export default withRouter(Registrar);
