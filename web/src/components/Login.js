import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import rest from '../services/rest'; // api rest
import { auth } from '../services/auth'; // login auth

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  handleSignIn = async e => {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({ error: "Preencha e-mail e senha para continuar!" });
    } else {
      try {
        const response = await rest.post("/autenticar", { email, password });
        auth(response.data.token);
        this.props.history.push("/home");
      } catch (err) {
        this.setState({
          error:"Não foi possível logar"
        });
      }
    }
  };

  render() {
    return (
      <div>
        <span>Demonstração de uso do React (frontend <small>sem qualquer uso de CSS</small>), Node (API rest - backend) e Mysql </span><br/><br/>
        <form onSubmit={this.handleSignIn}>
          {this.state.error && <p>{this.state.error}</p>}
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
          <button type="submit">Entrar</button>
          <hr />
        </form>
        <Link to="/registrar">Cadastrar</Link>
      </div>
    );
  }
}

export default withRouter(Login);
