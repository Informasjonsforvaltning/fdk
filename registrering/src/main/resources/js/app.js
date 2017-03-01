'use strict';

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom')
const client = require('./client');
// end::vars[]

// tag::app[]
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {datasets: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/datasets'}).done(response => {
            this.setState({datasets: response.entity._embedded.datasets});
    });
    }

    render() {
        return (
            <DatasetList employees={this.state.datasets}/>
    )
    }
}
// end::app[]

// tag::employee-list[]
class DatasetList extends React.Component{
    render() {
        var datasets = this.props.datasets.map(datasets =>
            <Dataset key={datasets._links.self.href} dataset={dataset}/>
    );
        return (
            <table>
            <tbody>
            <tr>
            <th>Id</th>
        <th>Description</th>
        </tr>
        {datasets}
        </tbody>
        </table>
    )
    }
}
// end::employee-list[]

// tag::employee[]
class Dataset extends React.Component{
    render() {
        return (
            <tr>
            <td>{this.props.dataset.id}</td>
        <td>{this.props.dataset.description}</td>
        </tr>
    )
    }
}
// end::employee[]

// tag::render[]
ReactDOM.render(
<App />,
    document.getElementById('react')
)
// end::render[]
