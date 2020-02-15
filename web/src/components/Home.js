import React, {Component,Fragment} from 'react';
import { withRouter } from "react-router-dom";
import { logout } from '../services/auth';
import BotaoSair from '../components/ui/BotaoSair';
import Cidades from '../components/Cidades';

class Home extends Component {
    handleLogout = e => {
        logout();
        this.props.history.push("/");
    };
    render(){
        return(
            <Fragment>
                <Cidades />
                <br/>
                <BotaoSair color="#222" onClick={this.handleLogout}>Sair</BotaoSair>
            </Fragment>
        );
    }
};

export default withRouter(Home);