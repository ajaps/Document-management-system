import React from 'react';
// import { Link } from 'react-router-dom';

class SearchBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      searchTerm: '',
    };
    this.textChanged = this.textChanged.bind(this);
    this.searchDb = this.searchDb.bind(this);
  }

  textChanged(e) {
    console.log(e.target.value);
    // console.log(e.keyCode);s
    // if (e.keyCode === 13) {
      const searchTerm = e.target.value;
      // console.log(this.props.location.search)
      // props.history.push(`/dashboard/search?${e.target.value}`);
      this.setState({ searchTerm });
      // location.href = `/dashboard/search?${e.target.value}`;

    // }
  }

  searchDb() {
    location.href = `/dashboard/search?${this.state.searchTerm}`;
  }

  render() {
    const { searchTerm } = this.state;
    const search = (this.props.props.location.search).replace('?', '');
    return (
      <div className="container searchBar">
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2">
            <div className="input-group">
              <div className="input-group-btn search-panel">
                <select className="form-control col-lg-2" id="accessType" value="Public">
                  <option>Documents</option>
                  <option>Users</option>
                </select>
              </div>
              <input type="hidden" name="search_param" value="all"
              id="search_param" />
              <input type="text" className="form-control" name="x"
                placeholder="Search term..." value={searchTerm || search}
                onChange={this.textChanged}/>
              <span className="input-group-btn">
                <button className="btn btn-default" type="button">
                  <span className="glyphicon glyphicon-search"
                    onClick={this.searchDb}/></button>
                </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBar;

{/*<div className="container col-lg-5 searchbar ">
        <input type="text" className="inputFormatting form-control col-lg-4"
        onKeyDown={this.textChanged} id="search" placeholder="Search here"
        value={searchTerm || search} />
      </div>*/}
